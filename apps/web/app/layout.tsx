// app/layout.tsx (or wherever your RootLayout lives)
import "../styles/globals.css";
import Link from "next/link";

export const metadata = {
  title: "MEND — Gentle Space",
  description: "Feel it fully. Heal it safely. Learn your patterns.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="
            flex items-center justify-between
            px-4 py-2         /* mobile padding */
            sm:px-6 sm:py-4   /* from sm up, use original spacing */
          ">
          <Link href="/" className="font-extrabold text-2xl no-underline">
            MEND
          </Link>

          <div className="
              flex items-center
              space-x-2          /* mobile gap */
              sm:space-x-3       /* slightly larger gap at sm+ */
            ">
            <Link
              href="/space-garden"
              className="
                btn btn-ghost
                py-1 px-2         /* mobile: slim buttons */
                text-sm           /* mobile font-size */
                sm:py-3 sm:px-4   /* sm+: original btn padding */
                sm:text-base      /* sm+: original font-size */
                no-underline
              "
            >
              Gentle Space
            </Link>

            <Link
              href="/check-in"
              className="
                btn btn-ghost
                py-1 px-2
                text-sm
                sm:py-3 sm:px-4
                sm:text-base
                no-underline
              "
            >
              Daily Check-In
            </Link>
          </div>
        </nav>

        <main className="px-6 pb-16">{children}</main>
        <footer className="px-6 py-10 text-white/60">Made with care.</footer>
      </body>
    </html>
  );
}
