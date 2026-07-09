/**
 * TypingIndicator — três pontos pulsantes, estilo iMessage/ChatGPT.
 */
export function TypingIndicator() {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-white border border-emerald-100 shadow-sm">
      <span className="block w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="block w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="block w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
      <span className="sr-only">Tutor está digitando…</span>
    </div>
  );
}
