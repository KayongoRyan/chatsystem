import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CallInterfaceProps {
  recipientName: string;
  recipientAvatar: string;
  callStatus: 'ringing' | 'active' | 'ended';
  callType: 'audio' | 'video';
  onEndCall: () => void;
  onToggleMic: (enabled: boolean) => void;
  onToggleVideo: (enabled: boolean) => void;
}

export function CallInterface({
  recipientName,
  recipientAvatar,
  callStatus,
  callType,
  onEndCall,
  onToggleMic,
  onToggleVideo,
}: CallInterfaceProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(callType === 'video');
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (callStatus === 'active') {
      const interval = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleMic = () => {
    setIsMuted(!isMuted);
    onToggleMic(!isMuted);
  };

  const handleToggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    onToggleVideo(!videoEnabled);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50 p-4">
      {/* Remote Video */}
      {callType === 'video' && (
        <div className="relative w-full max-w-2xl aspect-video bg-black rounded-lg overflow-hidden mb-6">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {!videoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <Avatar className="w-24 h-24">
                <AvatarImage src={recipientAvatar} />
                <AvatarFallback>{recipientName[0]}</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      )}

      {/* Call Info */}
      <div className="text-center mb-6">
        {callStatus === 'ringing' && (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">{recipientName}</h2>
            <p className="text-gray-400 animate-pulse">Calling...</p>
          </>
        )}
        {callStatus === 'active' && (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">{recipientName}</h2>
            <p className="text-green-400 font-semibold">{formatDuration(duration)}</p>
          </>
        )}
      </div>

      {/* Local Video Preview (small window) */}
      {callType === 'video' && (
        <div className="absolute bottom-32 right-4 w-32 h-40 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4 items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleMic}
          className={`rounded-full h-12 w-12 ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          {isMuted ? (
            <MicOff className="w-5 h-5 text-white" />
          ) : (
            <Mic className="w-5 h-5 text-white" />
          )}
        </Button>

        {callType === 'video' && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleVideo}
            className={`rounded-full h-12 w-12 ${!videoEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {videoEnabled ? (
              <Video className="w-5 h-5 text-white" />
            ) : (
              <VideoOff className="w-5 h-5 text-white" />
            )}
          </Button>
        )}

        <Button
          onClick={onEndCall}
          className="rounded-full h-12 w-12 bg-red-500 hover:bg-red-600"
          size="icon"
        >
          <PhoneOff className="w-5 h-5 text-white" />
        </Button>
      </div>

      {/* Incoming Call State */}
      {callStatus === 'ringing' && (
        <div className="flex gap-4 mt-8">
          <Button
            onClick={onEndCall}
            variant="destructive"
            className="rounded-full px-6 gap-2"
          >
            <PhoneOff className="w-4 h-4" /> Decline
          </Button>
          <Button
            className="rounded-full px-6 gap-2 bg-green-500 hover:bg-green-600"
          >
            <Phone className="w-4 h-4" /> Accept
          </Button>
        </div>
      )}
    </div>
  );
}
