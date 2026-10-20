import Reveal, { Words } from "./Reveal";

export function Eyebrow({ children, tone = "light" }: { n?: string; children: React.ReactNode; tone?: "light" | "dark" }) {
  return (
    <p
      className={`inline-flex items-center text-xs font-bold uppercase tracking-[0.18em] ${
        tone === "dark" ? "text-lime" : "text-green-700"
      }`}
    >
      {children}
    </p>
  );
}

export function SectionHead({
  eyebrow,
  title,
  sub,
  tone = "light",
  center = false,
}: {
  n?: string;
  eyebrow: string;
  title: string;
  sub?: string;
  tone?: "light" | "dark";
  center?: boolean;
}) {
  return (
    <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      <Reveal>
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      </Reveal>
      <h2 className={`mt-3 text-[clamp(1.75rem,3.4vw,2.6rem)] ${tone === "dark" ? "text-white" : "text-blue-950"}`}>
        <Words text={title} />
      </h2>
      {sub && (
        <Reveal delay={0.15}>
          <p className={`mt-3 max-w-xl text-base leading-relaxed sm:text-lg ${center ? "mx-auto" : ""} ${tone === "dark" ? "text-white/75" : "text-muted"}`}>{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

/** Header for inner pages: a soft blue-and-green wash with the title rising into place. */
export function PageHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <header className="mesh relative overflow-hidden border-b border-line">
      <div aria-hidden className="dot-faint absolute inset-0 [mask-image:linear-gradient(90deg,transparent,#000_70%)]" />
      <div className="relative mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <Reveal><Eyebrow>{eyebrow}</Eyebrow></Reveal>
        <h1 className="mt-3 max-w-4xl text-[clamp(2rem,4.4vw,3.2rem)] text-blue-950">
          <Words text={title} immediate />
        </h1>
        {sub && (
          <Reveal delay={0.25}>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{sub}</p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
