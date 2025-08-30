import { RoomCanvas } from "@/components/RoomCanvas";

export default async function canvasPage({ params }: { params: Promise<{ roomid: string }> }) {
  const { roomid } = await params; 
  const roomId = parseInt(roomid, 10);

  return <RoomCanvas roomId={roomId} />;
}
