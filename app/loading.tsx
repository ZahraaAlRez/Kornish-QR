export default function Loading() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 bg-cream px-8">
      <div className="h-16 w-16 animate-shimmer rounded-full bg-navy/10" />
      <div className="h-6 w-40 animate-shimmer rounded-full bg-navy/10" />
      <div className="h-3 w-28 animate-shimmer rounded-full bg-navy/10" />
    </div>
  );
}
