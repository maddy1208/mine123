export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-5 glass-strong rounded-2xl px-16 py-12">
        {/* Dots spinner */}
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-gradient-primary animate-bounce [animation-delay:0ms]" />
          <span className="w-3 h-3 rounded-full bg-gradient-primary animate-bounce [animation-delay:150ms]" />
          <span className="w-3 h-3 rounded-full bg-gradient-primary animate-bounce [animation-delay:300ms]" />
        </div>

        {/* Label */}
        <p className="font-sans text-sm font-medium text-muted-foreground tracking-wide">
          Just a moment
        </p>
      </div>
    </div>
  );
}
