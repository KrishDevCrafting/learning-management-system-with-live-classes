import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
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
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Real-Time Socket.io Server Setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

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

    // Notify peers that a new user joined
    socket.to(classId).emit("user-joined", {
      user: socket.userName,
      socketId: socket.id,
      count,
    });
  });

  // 2. Chat Message
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

  // 3. Raise Hand Event
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

  // 4. Disconnect Handling
  socket.on("disconnecting", () => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        const remaining = Math.max(
          1,
          (io.sockets.adapter.rooms.get(room)?.size || 1) - 1,
        );
        socket.to(room).emit("room-users-count", { count: remaining });
        socket.to(room).emit("user-left", { user: socket.userName });
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
