'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CreateRoom() {
  const [roomCode, setRoomCode] = useState('');
  const router = useRouter();

  const handleCreateRoom = () => {
    // In a real app, you'd generate a unique room code here
    const generatedRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(generatedRoomCode);
    router.push(`/room/${generatedRoomCode}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
      <h1 className="text-3xl font-bold mb-8 text-white">Create a Room</h1>
      <Button onClick={handleCreateRoom} className="mb-4">Generate Room Code</Button>
      {roomCode && (
        <div className="text-white text-xl">
          Your room code is: <span className="font-bold">{roomCode}</span>
        </div>
      )}
    </div>
  );
}