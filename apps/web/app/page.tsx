import Link from "next/link";

export default function Page() {
  return (
    <section className="max-w-5xl mx-auto text-center space-y-6 pt-16">
      <h1 className="text-5xl font-extrabold">Feel it fully. Heal it safely. Learn your patterns.</h1>
      <p className="text-white/80 text-lg">A simple space for emotional recovery and clarity.</p>
      <div className="flex items-center justify-center gap-3">
        <Link href="/space-garden" className="btn btn-primary no-underline">Open Your Gentle Space</Link>
        <Link href="/check-in" className="btn btn-ghost no-underline">Daily Check-In</Link>
      </div>
    </section>
  );
}
