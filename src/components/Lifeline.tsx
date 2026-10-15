/**
 * A heartbeat trace with a glowing pulse that travels along it, forever.
 * The path has pathLength=1 so the "comet" dash can be animated in CSS.
 */
const PATH =
  "M0 40 H120 L134 40 L146 14 L162 68 L176 26 L184 40 H340 L354 40 L366 18 L382 62 L394 30 L402 40 H560 L574 40 L586 8 L604 72 L618 24 L628 40 H800 L814 40 L826 16 L842 64 L854 28 L862 40 H1000 L1014 40 L1026 12 L1042 68 L1056 26 L1064 40 H1200";

export default function Lifeline({ className = "", pulse = "#198754" }: { className?: string; pulse?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 1200 80" preserveAspectRatio="none" className={className} fill="none">
      <path d={PATH} pathLength={1} stroke="currentColor" strokeOpacity={0.18} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path
        d={PATH}
        pathLength={1}
        stroke={pulse}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        className="comet"
      />
    </svg>
  );
}
