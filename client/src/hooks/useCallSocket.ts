import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface CallData {
  callId: string;
  from: string;
  to: string;
  type: 'audio' | 'video';
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidate | null;
}

export function useCallSocket(userId: string | undefined) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [activeCall, setActiveCall] = useState<any>(null);

  useEffect(() => {
    if (!userId) return;

    // Connect to WebSocket
    const socket = io(window.location.origin, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
      socket.emit('register', userId);
    });

    socket.on('users-online', (users: string[]) => {
      setOnlineUsers(users.filter(u => u !== userId));
    });

    socket.on('call:incoming', (data: CallData) => {
      console.log('Incoming call from:', data.from);
      setIncomingCall(data);
    });

    socket.on('call:answered', (data: { callId: string; answer: RTCSessionDescriptionInit }) => {
      console.log('Call answered');
      setActiveCall((prev: any) => prev ? { ...prev, status: 'active', answer: data.answer } : null);
    });

    socket.on('call:rejected', (data: { callId: string }) => {
      console.log('Call rejected');
      setIncomingCall(null);
      setActiveCall(null);
    });

    socket.on('call:ended', (data: { callId: string }) => {
      console.log('Call ended');
      setActiveCall(null);
      setIncomingCall(null);
    });

    socket.on('call:offer', (data: { callId: string; offer: RTCSessionDescriptionInit }) => {
      setActiveCall((prev: any) => prev ? { ...prev, offer: data.offer } : null);
    });

    socket.on('call:ice-candidate', (data: { callId: string; candidate: RTCIceCandidate }) => {
      setActiveCall((prev: any) => prev ? { ...prev, candidate: data.candidate } : null);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const initiateCall = useCallback((recipientId: string, type: 'audio' | 'video' = 'audio') => {
    if (!socketRef.current) return;

    const callId = `call-${Date.now()}`;
    const callData = { callId, from: userId, to: recipientId, type, status: 'ringing' };
    
    setActiveCall(callData);
    socketRef.current.emit('call:initiate', { from: userId, to: recipientId, callId, type });
  }, [userId]);

  const answerCall = useCallback(() => {
    if (!socketRef.current || !incomingCall) return;

    setActiveCall({ ...incomingCall, status: 'active' });
    socketRef.current.emit('call:answer', { 
      callId: incomingCall.callId, 
      answer: {} 
    });
    setIncomingCall(null);
  }, [incomingCall]);

  const rejectCall = useCallback(() => {
    if (!socketRef.current || !incomingCall) return;

    socketRef.current.emit('call:reject', { 
      callId: incomingCall.callId, 
      to: incomingCall.from 
    });
    setIncomingCall(null);
  }, [incomingCall]);

  const endCall = useCallback(() => {
    if (!socketRef.current || !activeCall) return;

    socketRef.current.emit('call:end', { 
      callId: activeCall.callId, 
      to: activeCall.from === userId ? activeCall.to : activeCall.from 
    });
    setActiveCall(null);
  }, [activeCall, userId]);

  const sendOffer = useCallback((offer: RTCSessionDescriptionInit) => {
    if (!socketRef.current || !activeCall) return;

    socketRef.current.emit('call:offer', { 
      callId: activeCall.callId, 
      offer,
      to: activeCall.from === userId ? activeCall.to : activeCall.from 
    });
  }, [activeCall, userId]);

  const sendIceCandidate = useCallback((candidate: RTCIceCandidate) => {
    if (!socketRef.current || !activeCall) return;

    socketRef.current.emit('call:ice-candidate', { 
      callId: activeCall.callId, 
      candidate,
      to: activeCall.from === userId ? activeCall.to : activeCall.from 
    });
  }, [activeCall, userId]);

  return {
    isConnected,
    onlineUsers,
    incomingCall,
    activeCall,
    initiateCall,
    answerCall,
    rejectCall,
    endCall,
    sendOffer,
    sendIceCandidate,
  };
}
