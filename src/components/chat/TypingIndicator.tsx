export default function TypingIndicator() {
  return (
    <div className="inline-flex items-center gap-1 px-3 py-2.5 bg-[#152219] rounded-xl">
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[#3d5548]" />
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[#3d5548]" />
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[#3d5548]" />
    </div>
  );
}
