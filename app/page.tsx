import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
      <h1 className="text-4xl font-bold mb-8 text-white">Couple's Quiz Game</h1>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/create-room">Create Room</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/join-room">Join Room</Link>
        </Button>
      </div>
    </div>
  );
}