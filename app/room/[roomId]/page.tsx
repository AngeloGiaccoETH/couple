import dynamic from 'next/dynamic';

const DynamicRoom = dynamic(() => import('@/components/Room'), { ssr: false });

export default function RoomPage({ params }: { params: { roomId: string } }) {
  return <DynamicRoom roomId={params.roomId} />;
}