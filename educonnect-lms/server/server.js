import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import liveClassRoutes from "./routes/liveClassRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Connect to Database
connectDB();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      // Allow localhost, vercel deployments, and render
      if (
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        origin.includes("vercel.app") ||
        origin.includes("onrender.com") ||
        origin === process.env.CLIENT_URL
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);
app.use(express.json());

// Health Check Endpoint
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.status(200).json({
    status: dbState === 1 ? "ok" : "db_disconnected",
    database:
      dbState === 1
        ? "MongoDB Atlas Connected"
        : "MongoDB Disconnected (Check MONGO_URI on Render & Atlas IP Access List 0.0.0.0/0)",
    readyState: dbState,
    service: "EduConnect LMS Backend Server",
  });
});

// Real-Time Socket.io Server Setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// In-Memory Stage State Tracker per Live Room (e.g. Slide Number, Screen Share status, Presenter)
const activeRoomStages = {};

io.on("connection", (socket) => {
  console.log(`⚡ Client connected to LMS Socket: ${socket.id}`);

  // 1. Join Room
  socket.on("join-class", ({ classId, user }) => {
    socket.join(classId);
    socket.currentRoom = classId;
    socket.userName = typeof user === "string" ? user : user?.name || "Student";

    const count = io.sockets.adapter.rooms.get(classId)?.size || 1;

    // Send updated user count to everyone in this class room
    io.to(classId).emit("room-users-count", { count });

    // Send existing peers in this room to newly connected peer (for WebRTC connection establishment)
    const peersInRoom = Array.from(io.sockets.adapter.rooms.get(classId) || [])
      .filter((id) => id !== socket.id);
    socket.emit("all-peers", { peers: peersInRoom });

    // If room already has an active presentation or screen share, sync it to joining student
    if (activeRoomStages[classId]) {
      socket.emit("stage-sync", activeRoomStages[classId]);
    }

    // Notify peers that a new user joined
    socket.to(classId).emit("user-joined", {
      user: socket.userName,
      socketId: socket.id,
      count,
    });
  });

  // 2. Real-Time Stage Synchronization (Slides, Stage Mode, Screen Sharing)
  socket.on("stage-sync", (data) => {
    if (data?.classId) {
      activeRoomStages[data.classId] = {
        ...activeRoomStages[data.classId],
        ...data,
        updatedAt: Date.now(),
      };
      // Broadcast state update to all other connected peers in this room
      socket.to(data.classId).emit("stage-sync", activeRoomStages[data.classId]);
    }
  });

  // 3. WebRTC Signaling Relay for Real Peer-to-Peer Screen & Video Streaming
  socket.on("webrtc-signal", ({ classId, targetSocketId, signal, sender }) => {
    if (targetSocketId) {
      io.to(targetSocketId).emit("webrtc-signal", {
        fromSocketId: socket.id,
        signal,
        sender: sender || socket.userName,
      });
    } else if (classId) {
      socket.to(classId).emit("webrtc-signal", {
        fromSocketId: socket.id,
        signal,
        sender: sender || socket.userName,
      });
    }
  });

  // 4. Real-Time Screen Frame Broadcast (High-reliability Canvas Stream Fallback)
  socket.on("screen-frame", ({ classId, frame, presenterName }) => {
    if (classId && frame) {
      socket.to(classId).emit("screen-frame", {
        frame,
        presenterName: presenterName || socket.userName,
      });
    }
  });

  // 5. Chat Message
  socket.on("send-message", ({ classId, message, user }) => {
    io.to(classId).emit("receive-message", {
      message,
      user: typeof user === "string" ? user : user?.name || "Student",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  });

  // 6. Raise Hand Event
  socket.on("raise-hand", ({ classId, user, isHandRaised }) => {
    const sender = typeof user === "string" ? user : user?.name || "Student";
    io.to(classId).emit("hand-raised-update", {
      user: sender,
      isHandRaised,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  });

  // 7. Disconnect Handling
  socket.on("disconnecting", () => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        const remaining = Math.max(
          1,
          (io.sockets.adapter.rooms.get(room)?.size || 1) - 1,
        );
        socket.to(room).emit("room-users-count", { count: remaining });
        socket.to(room).emit("user-left", { user: socket.userName });

        // Clean up stage if last participant left
        if (remaining <= 1 && !io.sockets.adapter.rooms.get(room)?.size) {
          delete activeRoomStages[room];
        }
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/enrollment", enrollmentRoutes);
app.use("/api/live-class", liveClassRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 EduConnect Server running on port: ${PORT}`);
});
