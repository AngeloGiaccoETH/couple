'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import io from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Scoreboard from '@/components/Scoreboard';

const topics = ['Movies', 'Music', 'Sports', 'History', 'Science'];
const questions = [
  {
    question: 'What is your favorite color?',
    options: ['Red', 'Blue', 'Green', 'Yellow'],
  },
  {
    question: 'What is your ideal vacation?',
    options: ['Beach', 'Mountains', 'City', 'Countryside'],
  },
  // Add more questions here
];

let socket;

export default function Room({ roomId }: { roomId: string }) {
  const [currentRound, setCurrentRound] = useState(1);
  const [currentTopic, setCurrentTopic] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [player1Answers, setPlayer1Answers] = useState<string[]>([]);
  const [player2Answers, setPlayer2Answers] = useState<string[]>([]);
  const [player1Guesses, setPlayer1Guesses] = useState<string[]>([]);
  const [player2Guesses, setPlayer2Guesses] = useState<string[]>([]);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [gamePhase, setGamePhase] = useState<'waiting' | 'topic' | 'answer' | 'guess' | 'results'>('waiting');
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const router = useRouter();

  useEffect(() => {
    socketInitializer();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const socketInitializer = async () => {
    await fetch('/api/socket');
    socket = io();

    socket.on('connect', () => {
      console.log('Connected to socket');
      socket.emit('joinRoom', roomId);
    });

    socket.on('startGame', () => {
      setGamePhase('topic');
    });
  };

  const handleTopicSelect = (topic: string) => {
    setCurrentTopic(topic);
    setGamePhase('answer');
  };

  const handleAnswer = (answer: string) => {
    if (currentPlayer === 1) {
      setPlayer1Answers([...player1Answers, answer]);
    } else {
      setPlayer2Answers([...player2Answers, answer]);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentQuestionIndex(0);
      setGamePhase('guess');
    }
  };

  const handleGuess = (guess: string) => {
    if (currentPlayer === 1) {
      setPlayer1Guesses([...player1Guesses, guess]);
    } else {
      setPlayer2Guesses([...player2Guesses, guess]);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setGamePhase('results');
      calculateScores();
    }
  };

  const calculateScores = () => {
    let player1Score = scores.player1;
    let player2Score = scores.player2;

    for (let i = 0; i < questions.length; i++) {
      if (player1Guesses[i] === player2Answers[i]) player1Score++;
      if (player2Guesses[i] === player1Answers[i]) player2Score++;
    }

    setScores({ player1: player1Score, player2: player2Score });
  };

  const startNewRound = () => {
    setCurrentRound(currentRound + 1);
    setCurrentTopic('');
    setCurrentQuestionIndex(0);
    setPlayer1Answers([]);
    setPlayer2Answers([]);
    setPlayer1Guesses([]);
    setPlayer2Guesses([]);
    setGamePhase('topic');
    setCurrentPlayer(currentRound % 2 === 0 ? 1 : 2);
  };

  if (gamePhase === 'waiting') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 p-4">
        <Card className="w-full max-w-md p-6 mb-4">
          <h2 className="text-2xl font-semibold mb-4">Waiting for other player...</h2>
          <p>Room ID: {roomId}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 p-4">
      <h1 className="text-3xl font-bold mb-8 text-white">Room: {roomId}</h1>
      <Scoreboard scores={scores} />
      <Card className="w-full max-w-md p-6 mb-4">
        <h2 className="text-2xl font-semibold mb-4">Round {currentRound}</h2>
        {gamePhase === 'topic' && (
          <>
            <h3 className="text-xl mb-4">Player {currentPlayer}, choose a topic:</h3>
            <div className="grid grid-cols-2 gap-4">
              {topics.map((topic) => (
                <Button key={topic} onClick={() => handleTopicSelect(topic)}>
                  {topic}
                </Button>
              ))}
            </div>
          </>
        )}
        {gamePhase === 'answer' && (
          <>
            <h3 className="text-xl mb-4">
              Player {currentPlayer}, answer the question:
            </h3>
            <p className="mb-4">{questions[currentQuestionIndex].question}</p>
            <RadioGroup onValueChange={handleAnswer}>
              {questions[currentQuestionIndex].options.map((option) => (
                <div className="flex items-center space-x-2" key={option}>
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </>
        )}
        {gamePhase === 'guess' && (
          <>
            <h3 className="text-xl mb-4">
              Player {currentPlayer}, guess your partner's answer:
            </h3>
            <p className="mb-4">{questions[currentQuestionIndex].question}</p>
            <RadioGroup onValueChange={handleGuess}>
              {questions[currentQuestionIndex].options.map((option) => (
                <div className="flex items-center space-x-2" key={option}>
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </>
        )}
        {gamePhase === 'results' && (
          <>
            <h3 className="text-xl mb-4">Round Results:</h3>
            <p>Player 1 Score: {scores.player1}</p>
            <p>Player 2 Score: {scores.player2}</p>
            <Button onClick={startNewRound} className="mt-4">
              Start Next Round
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}