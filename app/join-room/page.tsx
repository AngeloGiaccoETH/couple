'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState('');
  const router = useRouter();

  const handleJoinRoom = () => {
    if (roomCode) {
      router.push(`/room/${roomCode}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
      <h1 className="text-3xl font-bold mb-8 text-white">Join a Room</h1>
      <Input
        type="text"
        placeholder="Enter Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        className="mb-4 w-64"
      />
      <Button onClick={handleJoinRoom}>Join Room</Button>
    </div>
  );
}