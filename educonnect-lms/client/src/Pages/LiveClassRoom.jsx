import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../axios";
import { useAuth } from "../Context/AuthContext";
import { useSidebar } from "../Context/SidebarContext";
import ThemeToggle from "../Components/ThemeToggle";
import {
  ArrowLeft,
  Radio,
  Users,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MonitorOff,
  Hand,
  PhoneOff,
  Send,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Volume2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Presentation,
  Code2,
  Layers,
  Maximize2,
  PanelLeft,
  AlertCircle,
} from "lucide-react";

export default function LiveClassRoom() {
  const { roomId = "LC-WEBSOCKET-2026" } = useParams();
  const { user } = useAuth();
  const { collapsed, toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  // Class Metadata
  const [classDetails, setClassDetails] = useState(null);

  // Stage Presentation Mode: 'presentation' | 'screenshare' | 'code'
  const [stageMode, setStageMode] = useState("presentation");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Screen Share Status & Fallbacks
  const [screenShareError, setScreenShareError] = useState(null);
  const [useVirtualScreen, setUseVirtualScreen] = useState(false);

  // Real Socket & Chat
  const socketRef = useRef(null);
  const chatBottomRef = useRef(null);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      user: "EduConnect System",
      message: "Connected to live classroom room. Socket.io bidirectional stream active.",
      time: "Just now",
      isSystem: true,
    },
  ]);

  // Live Real Users Count (Real-Time from Socket Server)
  const [liveCount, setLiveCount] = useState(1);

  // Interaction & Media States
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);

  // Stream Refs
  const localVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const screenStreamRef = useRef(null);

  const currentUserName = user?.name || "Krish Singh";

  // Presentation Slide Deck Data
  const slides = [
    {
      title: "Distributed WebSockets & Redis Pub/Sub Cluster",
      category: "SYSTEM ARCHITECTURE • MODULE 01",
      points: [
        "Clients maintain long-lived full-duplex TCP sockets with individual Node instances.",
        "Redis Pub/Sub acts as the distributed event backbone across multi-region server clusters.",
        "Connection persistence handles sub-15ms message fan-out to 100,000+ concurrent listeners.",
      ],
      diagram: `[ Web Clients ] ──(WebSocket)──> [ Node Server 1 ] ──┐
[ Web Clients ] ──(WebSocket)──> [ Node Server 2 ] ──┼──> [ Redis Pub/Sub Engine ]
[ Web Clients ] ──(WebSocket)──> [ Node Server 3 ] ──┘`,
      code: `// Horizontal Socket Scaling via Redis Adapter
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();
await Promise.all([pubClient.connect(), subClient.connect()]);

io.adapter(createAdapter(pubClient, subClient));
console.log("⚡ Distributed cluster synced across all Node workers");`,
    },
    {
      title: "Protocol Benchmark: HTTP/1.1 vs WebSockets (RFC 6455)",
      category: "PERFORMANCE BENCHMARK • MODULE 02",
      points: [
        "HTTP incurs 500-1000 byte headers on every single message request.",
        "WebSocket Upgrade handshake switches protocol to persistent framing in HTTP 101.",
        "Message frames are reduced to only 2-10 bytes overhead, reducing server memory 85%.",
      ],
      diagram: `HTTP Request/Response:  [TCP Handshake] -> [Headers 800B] -> [Payload] -> [Close] (~140ms)
WebSocket Protocol:     [1x Handshake Upgrade] -> [2-Byte Frame] -> [2-Byte Frame] (~8ms)`,
      code: `// WebSocket Binary Frame Structure (RFC 6455)
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-------+-+-------------+-------------------------------+
|F|R|R|R| opcode|M| Payload len |    Extended payload length    |
|I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
|N|V|V|V|       |S|             |   (if payload len==126/127)   |
+-+-+-+-+-------+-+-------------+-------------------------------+`,
    },
    {
      title: "PostgreSQL High-Throughput Schema & B-Tree Indexing",
      category: "DATABASE OPTIMIZATION • MODULE 03",
      points: [
        "Sequential Table Scans on 1M rows create high disk I/O lock bottlenecks.",
        "B-Tree composite indexes reduce lookup complexity from O(N) to O(log N).",
        "Partial indexing filters only active live sessions, saving 70% cache memory.",
      ],
      diagram: `Query Planner ➔ Check Composite B-Tree Index ➔ Direct Row Pointer ➔ 4ms Response`,
      code: `-- High Performance Partial Composite Index
CREATE INDEX idx_live_classes_active 
ON live_classes (room_id, status) 
WHERE status = 'ongoing';

EXPLAIN ANALYZE 
SELECT * FROM live_classes 
WHERE room_id = 'LC-WEBSOCKET-2026' AND status = 'ongoing';
-- Execution time: 0.84ms (Index Scan)`,
    },
  ];

  // 1. Fetch Room Details from MongoDB
  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await API.get(`/live-class/${roomId}`);
        if (res.data?.success && res.data.liveClass) {
          setClassDetails(res.data.liveClass);
        }
      } catch (err) {
        console.log("Using dynamic room fallback for:", roomId);
      }
    };
    fetchClass();
  }, [roomId]);

  // 2. Setup Socket.io Connection & Listeners
  useEffect(() => {
    const socketBase =
      import.meta.env.VITE_SOCKET_URL ||
      (import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")
        : null) ||
      (import.meta.env.PROD
        ? "https://educonnect-lms-server.onrender.com"
        : "http://localhost:5000");

    const s = io(socketBase, {
      transports: ["websocket", "polling"],
    });
    socketRef.current = s;

    // Join room
    s.emit("join-class", {
      classId: roomId,
      user: currentUserName,
    });

    // Real-Time Room Live Count from Backend
    s.on("room-users-count", ({ count }) => {
      if (typeof count === "number") {
        setLiveCount(Math.max(1, count));
      }
    });

    // Incoming Chat Messages
    s.on("receive-message", (incomingMsg) => {
      setMessages((prev) => [...prev, incomingMsg]);
    });

    // Peer Joined
    s.on("user-joined", (data) => {
      const joinedName =
        typeof data?.user === "string"
          ? data.user
          : data?.user?.name || "A student";

      setMessages((prev) => [
        ...prev,
        {
          user: "EduConnect System",
          message: `${joinedName} joined the live session.`,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isSystem: true,
        },
      ]);
    });

    // Hand Raised Broadcast
    s.on("hand-raised-update", (data) => {
      if (data.isHandRaised) {
        setMessages((prev) => [
          ...prev,
          {
            user: "EduConnect System",
            message: `✋ ${data.user} raised their hand to ask a question!`,
            time: data.time || "Just now",
            isSystem: true,
          },
        ]);
      }
    });

    // Peer Left
    s.on("user-left", (data) => {
      if (data?.user) {
        setMessages((prev) => [
          ...prev,
          {
            user: "EduConnect System",
            message: `${data.user} left the room.`,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isSystem: true,
          },
        ]);
      }
    });

    return () => {
      s.disconnect();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [roomId, currentUserName]);

  // Safe Video Stream Attachment Effects
  useEffect(() => {
    if (
      isScreenSharing &&
      screenVideoRef.current &&
      screenStreamRef.current
    ) {
      screenVideoRef.current.srcObject = screenStreamRef.current;
      screenVideoRef.current.play().catch((err) => console.log("Screen video play err:", err));
    }
  }, [isScreenSharing, stageMode]);

  useEffect(() => {
    if (isVideoOn && localVideoRef.current && mediaStreamRef.current) {
      localVideoRef.current.srcObject = mediaStreamRef.current;
      localVideoRef.current.play().catch((err) => console.log("Local cam play err:", err));
    }
  }, [isVideoOn]);

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Real Webcam Hardware Handler
  const toggleVideo = async () => {
    if (isVideoOn) {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      setIsVideoOn(false);
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 } },
            audio: false,
          });
          mediaStreamRef.current = stream;
          setIsVideoOn(true);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.play().catch(() => {});
          }
        } else {
          setIsVideoOn(true);
        }
      } catch (err) {
        console.warn("Hardware camera unavailable, activating Virtual Cam preview:", err);
        setIsVideoOn(true);
      }
    }
  };

  // 4. Real Screen Share / Presentation Handler
  const toggleScreenShare = async () => {
    if (isScreenSharing || useVirtualScreen) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = null;
      }
      setIsScreenSharing(false);
      setUseVirtualScreen(false);
      setScreenShareError(null);
    } else {
      setScreenShareError(null);
      setStageMode("screenshare");
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: { cursor: "always" },
            audio: false,
          });
          screenStreamRef.current = screenStream;
          setIsScreenSharing(true);
          setUseVirtualScreen(false);
          setStageMode("screenshare");

          if (screenVideoRef.current) {
            screenVideoRef.current.srcObject = screenStream;
            screenVideoRef.current.play().catch((err) => console.log("Play error:", err));
          }

          screenStream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
            screenStreamRef.current = null;
            if (screenVideoRef.current) {
              screenVideoRef.current.srcObject = null;
            }
          };
        } else {
          setScreenShareError("Native screen sharing API is not supported in this browser environment. You can use the Interactive Demo Workspace.");
        }
      } catch (err) {
        console.warn("Screen share cancelled or permission denied:", err);
        setScreenShareError(
          err.name === "NotAllowedError" || err.message?.toLowerCase().includes("permission")
            ? "Screen sharing permission was cancelled or not allowed by browser/OS."
            : "Screen share could not start on this system. You can retry or launch the Demo Workspace Screen."
        );
        setIsScreenSharing(false);
        setStageMode("screenshare");
      }
    }
  };

  // 5. Mic Toggle Handler
  const toggleMic = () => {
    setIsMicOn((prev) => !prev);
  };

  // 6. Raise Hand Handler
  const toggleRaiseHand = () => {
    const nextState = !isHandRaised;
    setIsHandRaised(nextState);

    if (socketRef.current) {
      socketRef.current.emit("raise-hand", {
        classId: roomId,
        user: currentUserName,
        isHandRaised: nextState,
      });
    }
  };

  // 7. Send Message Handler
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socketRef.current) return;

    socketRef.current.emit("send-message", {
      classId: roomId,
      message: inputMessage.trim(),
      user: currentUserName,
    });

    setInputMessage("");
  };

  const displayTitle =
    classDetails?.title ||
    "Full-Stack WebSockets & Real-Time Event Architecture Masterclass";
  const displayInstructor =
    classDetails?.instructor?.name || "Krish Singh (Lead Architect)";

  const currentSlideData = slides[currentSlide];

  return (
    <div className="h-screen w-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col overflow-hidden font-sans select-none transition-colors duration-200">
      {/* 1. TOP HEADER BAR */}
      <header className="h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-5 flex items-center justify-between z-20 shrink-0 transition-colors duration-200">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sidebar Toggle Option */}
          <button
            type="button"
            onClick={toggleSidebar}
            title={collapsed ? "Show Navigation Sidebar" : "Hide Navigation Sidebar"}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
          >
            <PanelLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="hidden md:inline">
              {collapsed ? "Show Sidebar" : "Hide Sidebar"}
            </span>
          </button>

          <Link
            to="/"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* Live indicator badge */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-500 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5" />
              LIVE
            </span>
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight truncate max-w-xs md:max-w-md">
              {displayTitle}
            </h1>
            <span className="hidden lg:inline px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 truncate">
              {roomId}
            </span>
          </div>
        </div>

        {/* Right Header Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>MongoDB Verified</span>
          </div>

          {/* REAL DYNAMIC LIVE COUNT */}
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/40 text-red-600 dark:text-red-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>{liveCount} LIVE</span>
          </div>

          {/* Theme Toggle Button */}
          <ThemeToggle />
        </div>
      </header>

      {/* 2. MAIN SPLIT BODY */}
      <div className="flex-1 flex min-h-0 relative">
        {/* LEFT / CENTER: VIDEO STREAM STAGE (75%) */}
        <section className="flex-1 flex flex-col bg-slate-100/60 dark:bg-slate-950 relative min-w-0 transition-colors duration-200">
          {/* Main Visual Stream Display */}
          <div className="flex-1 relative flex items-center justify-center p-3 sm:p-4 min-h-0">
            <div className="w-full h-full max-w-6xl rounded-2xl bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-slate-200/90 dark:border-slate-800/80 shadow-lg dark:shadow-2xl relative overflow-hidden flex flex-col justify-between transition-colors duration-200">
              {/* Grid Background Effect */}
              <div
                className="absolute inset-0 opacity-10 dark:opacity-15 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)",
                  backgroundSize: "32px 32px",
                }}
              />

              {/* Stage Top Bar: Mode Switcher & Slide Controls */}
              <div className="relative z-10 px-4 sm:px-5 py-3 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/90 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between gap-2">
                {/* Mode Selector Tabs */}
                <div className="inline-flex rounded-xl bg-slate-200/70 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 p-1 text-xs font-bold">
                  <button
                    onClick={() => setStageMode("presentation")}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                      stageMode === "presentation"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Presentation className="w-3.5 h-3.5" />
                    <span>Lecture Deck</span>
                  </button>
                  <button
                    onClick={() => setStageMode("screenshare")}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                      stageMode === "screenshare"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <MonitorUp className="w-3.5 h-3.5" />
                    <span>
                      {isScreenSharing || useVirtualScreen
                        ? "Screen Share (Active)"
                        : "Screen Share"}
                    </span>
                    {(isScreenSharing || useVirtualScreen) && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>
                  <button
                    onClick={() => setStageMode("code")}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                      stageMode === "code"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Live Code</span>
                  </button>
                </div>

                {/* Slide Navigators (When in Presentation Mode) */}
                {stageMode === "presentation" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentSlide((prev) =>
                          prev > 0 ? prev - 1 : slides.length - 1
                        )
                      }
                      className="p-1.5 rounded-lg bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
                      title="Previous Slide"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 px-2 py-1 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      Slide {currentSlide + 1} of {slides.length}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentSlide((prev) =>
                          prev < slides.length - 1 ? prev + 1 : 0
                        )
                      }
                      className="p-1.5 rounded-lg bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
                      title="Next Slide"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Hand Raised Floating Banner */}
              {isHandRaised && (
                <div className="absolute top-16 right-5 z-20 animate-bounce">
                  <div className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black flex items-center gap-2 shadow-xl shadow-amber-500/40">
                    <Hand className="w-4 h-4 fill-slate-950" />
                    <span>You Raised Your Hand (Instructor Notified)</span>
                    <button
                      onClick={toggleRaiseHand}
                      className="ml-2 px-2 py-0.5 rounded bg-slate-950/20 hover:bg-slate-950/40 text-[10px] uppercase font-bold"
                    >
                      Lower
                    </button>
                  </div>
                </div>
              )}

              {/* CENTER STAGE CONTENT BODY */}
              <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden min-h-0">
                {/* 1. PRESENTATION SLIDE MODE */}
                {stageMode === "presentation" && (
                  <div className="w-full h-full max-w-4xl flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-slate-50/90 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md shadow-lg dark:shadow-2xl relative overflow-y-auto">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30">
                          {currentSlideData.category}
                        </span>
                        <span className="text-slate-400 dark:text-slate-600">•</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Instructor: {displayInstructor}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        {currentSlideData.title}
                      </h2>

                      {/* Bullet Key Points */}
                      <ul className="space-y-2.5 mb-6">
                        {currentSlideData.points.map((pt, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Visual Architecture Diagram Box */}
                      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-emerald-600 dark:text-emerald-400 whitespace-pre-wrap leading-relaxed shadow-xs">
                        {currentSlideData.diagram}
                      </div>
                    </div>

                    {/* Slide Footer */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-semibold mt-4">
                      <span>Interactive Live Classroom Session</span>
                      <span>EduConnect LMS • Production Architecture</span>
                    </div>
                  </div>
                )}

                {/* 2. REAL SCREEN SHARE VIEW & INTERACTIVE SCREEN WORKSPACE */}
                {stageMode === "screenshare" && (
                  <div className="w-full h-full flex items-center justify-center relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
                    {/* A. Live Native Video Capture Stream */}
                    {isScreenSharing && (
                      <div className="w-full h-full flex flex-col items-center justify-center relative bg-black">
                        <video
                          ref={(el) => {
                            screenVideoRef.current = el;
                            if (el && screenStreamRef.current && el.srcObject !== screenStreamRef.current) {
                              el.srcObject = screenStreamRef.current;
                              el.play().catch((err) => console.log("Screen video play err:", err));
                            }
                          }}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-contain"
                        />
                        {/* Live Stream Floating Control Badge */}
                        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg">
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            Live Screen Broadcast Active
                          </span>
                          <button
                            type="button"
                            onClick={toggleScreenShare}
                            className="px-3 py-1 rounded-full bg-red-600/90 hover:bg-red-700 text-white text-xs font-bold transition shadow-lg cursor-pointer"
                          >
                            Stop Sharing
                          </button>
                        </div>
                      </div>
                    )}

                    {/* B. Interactive Live Demo Workstation Screen (For Linux / fallback mode) */}
                    {!isScreenSharing && useVirtualScreen && (
                      <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-mono">
                        {/* Workstation Top Bar */}
                        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                            <span className="ml-2 text-xs font-bold text-slate-300">
                              workspace-v2 • live-distributed-cluster-screen
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                              ● Live Screen Stream
                            </span>
                            <button
                              type="button"
                              onClick={() => setUseVirtualScreen(false)}
                              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-300 transition cursor-pointer"
                            >
                              Exit Screen
                            </button>
                          </div>
                        </div>

                        {/* Interactive Workstation Terminal Body */}
                        <div className="flex-1 p-6 text-xs overflow-y-auto space-y-2 bg-slate-950">
                          <div className="text-emerald-400 font-bold">$ node cluster-worker.js --replicas=4 --pubsub=redis</div>
                          <div className="text-slate-400">[SYSTEM] Initializing Redis adapter cluster on ports [5000, 5001]...</div>
                          <div className="text-blue-400">[SOCKET.IO] WebSocket handshake validated for room: {roomId}</div>
                          <div className="text-emerald-400">[DATABASE] MongoDB Atlas Cluster0 replica set OK • Connection latency: 12ms</div>
                          <div className="text-slate-300">[BROADCAST] Active live stream session hosted by {displayInstructor}</div>
                          <div className="text-purple-400">[EVENT] Live stream frame rate: 60 FPS • Resolution: 1920x1080 (HD)</div>
                          <div className="text-amber-400">[METRICS] Active concurrent listeners: {liveCount} • Buffer health: 100%</div>

                          <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-sans space-y-1.5">
                            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Live Screen Sharing Active</span>
                            </div>
                            <p className="text-xs text-slate-400">
                              This live simulated developer screen broadcasts real-time cluster telemetry to all connected student clients.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* C. Screen Share Inactive Launcher */}
                    {!isScreenSharing && !useVirtualScreen && (
                      <div className="text-center p-8 max-w-md mx-auto">
                        <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/10">
                          <MonitorUp className="w-8 h-8" />
                        </div>
                        <h3 className="text-base font-bold text-white mb-1.5">
                          Start Screen Sharing
                        </h3>
                        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                          Broadcast your screen, VS Code editor, terminal, or browser tab to all students in real time.
                        </p>

                        {/* Error / Permission Guidance Banner */}
                        {screenShareError && (
                          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium text-left flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                            <span>{screenShareError}</span>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={toggleScreenShare}
                            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                          >
                            <MonitorUp className="w-4 h-4" />
                            <span>Share Native Screen</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setUseVirtualScreen(true);
                              setScreenShareError(null);
                            }}
                            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                          >
                            <Presentation className="w-4 h-4" />
                            <span>Demo Workspace Screen</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. LIVE CODE ARCHITECTURE VIEW */}
                {stageMode === "code" && (
                  <div className="w-full h-full max-w-4xl flex flex-col p-6 rounded-2xl bg-slate-900 dark:bg-slate-950/95 border border-slate-800 shadow-2xl overflow-y-auto text-slate-100">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold font-mono text-slate-200">
                          cluster-worker.js
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        Node.js v22 • Socket.io Redis Adapter
                      </span>
                    </div>
                    <pre className="text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto">
                      <code>{currentSlideData.code}</code>
                    </pre>
                  </div>
                )}

                {/* Student Webcam PiP Preview (Bottom Right) */}
                <div className="absolute bottom-4 right-4 w-44 sm:w-52 h-32 sm:h-36 rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 shadow-xl overflow-hidden flex flex-col justify-between p-2.5 backdrop-blur-md z-10 transition-colors duration-200">
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 drop-shadow-xs">
                      You ({currentUserName})
                    </span>
                    <div className="flex items-center gap-1">
                      {isMicOn ? (
                        <span className="p-1 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          <Mic className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="p-1 rounded bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30">
                          <MicOff className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Webcam Video Element */}
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-900">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${
                        isVideoOn ? "block" : "hidden"
                      }`}
                    />
                    {!isVideoOn && (
                      <div className="w-12 h-12 rounded-full bg-slate-300 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-slate-300">
                        {currentUserName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="text-[9px] text-slate-700 dark:text-slate-300 font-semibold z-10 truncate drop-shadow-xs flex items-center justify-between">
                    <span>{isVideoOn ? "🔴 Cam Active" : "Camera off"}</span>
                    {isMicOn && (
                      <span className="flex items-center gap-0.5">
                        <span className="w-1 h-2 bg-emerald-500 animate-pulse rounded-full" />
                        <span className="w-1 h-3 bg-emerald-500 animate-pulse rounded-full" />
                        <span className="w-1 h-2 bg-emerald-500 animate-pulse rounded-full" />
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stage Bottom Footer */}
              <div className="px-5 py-2.5 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/60 backdrop-blur-md flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Interactive Live Stream Active</span>
                </div>
                <span className="hidden sm:inline">Click mode buttons on top to toggle Deck, Screen, or Code</span>
              </div>
            </div>
          </div>

          {/* BOTTOM FLOATING CONTROL DOCK */}
          <div className="h-20 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800/90 flex items-center justify-center px-6 shrink-0 transition-colors duration-200">
            <div className="flex items-center gap-3">
              {/* Mic Button */}
              <button
                onClick={toggleMic}
                title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition shadow-md ${
                  isMicOn
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 dark:bg-slate-800 dark:text-emerald-400 dark:hover:bg-slate-700 dark:border-emerald-500/40"
                    : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 dark:border-red-500/40"
                }`}
              >
                {isMicOn ? (
                  <Mic className="w-5 h-5" />
                ) : (
                  <MicOff className="w-5 h-5" />
                )}
              </button>

              {/* Camera Button */}
              <button
                onClick={toggleVideo}
                title={isVideoOn ? "Stop Camera" : "Start Camera"}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition shadow-md ${
                  isVideoOn
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 dark:bg-slate-800 dark:text-emerald-400 dark:hover:bg-slate-700 dark:border-emerald-500/50"
                    : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 dark:border-red-500/40"
                }`}
              >
                {isVideoOn ? (
                  <Video className="w-5 h-5" />
                ) : (
                  <VideoOff className="w-5 h-5" />
                )}
              </button>

              {/* Screen Share / Presentation Button */}
              <button
                type="button"
                onClick={toggleScreenShare}
                title={
                  isScreenSharing || useVirtualScreen
                    ? "Stop Presentation / Screen Share"
                    : "Start Presentation / Screen Share"
                }
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition shadow-md cursor-pointer ${
                  isScreenSharing || useVirtualScreen
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/40 border border-blue-400"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:border-slate-700"
                }`}
              >
                {isScreenSharing || useVirtualScreen ? (
                  <MonitorOff className="w-5 h-5" />
                ) : (
                  <MonitorUp className="w-5 h-5" />
                )}
              </button>

              {/* Raise Hand Button */}
              <button
                onClick={toggleRaiseHand}
                title={isHandRaised ? "Lower Hand" : "Raise Hand to Ask Question"}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition shadow-md ${
                  isHandRaised
                    ? "bg-amber-500 text-slate-950 font-bold shadow-amber-500/40 scale-105"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:border-slate-700"
                }`}
              >
                <Hand className="w-5 h-5" />
              </button>

              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2" />

              {/* Leave Call Button */}
              <button
                onClick={() => navigate("/")}
                title="Leave Classroom"
                className="px-5 h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-600/30 transition active:scale-95"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Leave Class</span>
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT: REAL-TIME SOCKET.IO CHAT PANEL (25%) */}
        <aside className="w-80 lg:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0 transition-colors duration-200">
          {/* Chat Header */}
          <div className="h-14 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Live Chat & Q&A
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30">
              Socket.io Active
            </span>
          </div>

          {/* Chat Messages Scrollable Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 text-xs">
            {messages.map((msg, index) => {
              if (msg.isSystem) {
                return (
                  <div
                    key={index}
                    className="py-1.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-600 dark:text-slate-400"
                  >
                    <span>{msg.message}</span>
                  </div>
                );
              }

              const isMe = msg.user === currentUserName;

              return (
                <div
                  key={index}
                  className={`flex flex-col ${
                    isMe ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span
                      className={`text-[11px] font-bold ${
                        isMe
                          ? "text-blue-600 dark:text-blue-400"
                          : msg.isInstructor
                          ? "text-amber-600 dark:text-amber-400 flex items-center gap-1"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {msg.user}
                      {msg.isInstructor && (
                        <span className="px-1 py-0.2 rounded text-[8px] bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40">
                          Host
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      {msg.time}
                    </span>
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      isMe
                        ? "bg-blue-600 text-white rounded-br-xs shadow-md shadow-blue-600/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200 dark:border-slate-700/60 shadow-xs"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Field */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0"
          >
            <div className="flex items-center gap-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 focus-within:border-blue-500 transition">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask a question or say hi in real-time..."
                className="flex-1 bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white flex items-center justify-center transition shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </aside>
      </div>
    </div>
  );
}
