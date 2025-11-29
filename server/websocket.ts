import { Server as SocketIOServer, Socket } from "socket.io";
import { Server } from "http";

export function setupWebSocket(httpServer: Server) {
  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*" },
  });

  // Store active users
  const activeUsers = new Map<string, string>(); // userId -> socketId
  const activeCalls = new Map<string, any>(); // callId -> callData

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Register user
    socket.on("register", (userId: string) => {
      activeUsers.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
      io.emit("users-online", Array.from(activeUsers.keys()));
    });

    // Call initiation
    socket.on("call:initiate", (data: { from: string; to: string; callId: string; type: "audio" | "video" }) => {
      const recipientSocketId = activeUsers.get(data.to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("call:incoming", {
          from: data.from,
          callId: data.callId,
          type: data.type,
        });
        activeCalls.set(data.callId, { caller: data.from, recipient: data.to, status: "ringing" });
      }
    });

    // Call answered
    socket.on("call:answer", (data: { callId: string; answer: any }) => {
      const callData = activeCalls.get(data.callId);
      if (callData) {
        const callerSocketId = activeUsers.get(callData.caller);
        io.to(callerSocketId).emit("call:answered", {
          callId: data.callId,
          answer: data.answer,
        });
        activeCalls.set(data.callId, { ...callData, status: "active" });
      }
    });

    // WebRTC ICE candidates
    socket.on("call:ice-candidate", (data: { callId: string; candidate: any; to: string }) => {
      const recipientSocketId = activeUsers.get(data.to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("call:ice-candidate", {
          callId: data.callId,
          candidate: data.candidate,
        });
      }
    });

    // WebRTC offer
    socket.on("call:offer", (data: { callId: string; offer: any; to: string }) => {
      const recipientSocketId = activeUsers.get(data.to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("call:offer", {
          callId: data.callId,
          offer: data.offer,
        });
      }
    });

    // Call rejected
    socket.on("call:reject", (data: { callId: string; to: string }) => {
      const recipientSocketId = activeUsers.get(data.to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("call:rejected", { callId: data.callId });
      }
      activeCalls.delete(data.callId);
    });

    // Call ended
    socket.on("call:end", (data: { callId: string; to: string }) => {
      const recipientSocketId = activeUsers.get(data.to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("call:ended", { callId: data.callId });
      }
      activeCalls.delete(data.callId);
    });

    // Disconnect
    socket.on("disconnect", () => {
      let disconnectedUser: string | null = null;
      activeUsers.forEach((socketId, userId) => {
        if (socketId === socket.id) {
          disconnectedUser = userId;
          activeUsers.delete(userId);
        }
      });
      console.log(`User ${disconnectedUser} disconnected`);
      io.emit("users-online", Array.from(activeUsers.keys()));
    });
  });

  return io;
}
