import { Card } from '@/components/ui/card';

interface ScoreboardProps {
  scores: {
    player1: number;
    player2: number;
  };
}

export default function Scoreboard({ scores }: ScoreboardProps) {
  return (
    <Card className="w-full max-w-md p-4 mb-4 bg-white/90">
      <h2 className="text-xl font-semibold mb-2">Scoreboard</h2>
      <div className="flex justify-between">
        <div>
          <p className="font-medium">Player 1</p>
          <p className="text-2xl font-bold">{scores.player1}</p>
        </div>
        <div>
          <p className="font-medium">Player 2</p>
          <p className="text-2xl font-bold">{scores.player2}</p>
        </div>
      </div>
    </Card>
  );
}