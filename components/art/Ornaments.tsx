/** Gold hairline flourish with a tiny leaf-and-diamond center. */
export function Flourish({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 16" aria-hidden="true" className={`h-4 w-40 ${className}`}>
      <g fill="none" stroke="#B49867" strokeWidth="0.8" strokeLinecap="round">
        <path d="M4 8H62" strokeOpacity="0.7" />
        <path d="M98 8H156" strokeOpacity="0.7" />
        <path d="M66 8c4-4.2 8.4-4.2 11.2 0-2.8 4.2-7.2 4.2-11.2 0Z" />
        <path d="M94 8c-4-4.2-8.4-4.2-11.2 0 2.8 4.2 7.2 4.2 11.2 0Z" />
      </g>
      <path d="M80 4.6 83.4 8 80 11.4 76.6 8Z" fill="#B49867" />
    </svg>
  );
}

/** A faint seaside wave line — the reception is by the sea. */
export function WaveDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`mx-auto flex w-full max-w-[320px] items-center justify-center px-4 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 320 28" className="h-7 w-full overflow-visible">
        <path
          d="M2 14c13.3 0 13.3-8 26.7-8s13.3 8 26.6 8 13.4-8 26.7-8 13.3 8 26.7 8 13.3-8 26.6-8 13.4 8 26.7 8 13.3-8 26.7-8 13.3 8 26.6 8 13.4-8 26.7-8 13.3 8 26.7 8 13.3-8 26.6-8 13.4 8 26.7 8"
          fill="none"
          stroke="#B49867"
          strokeOpacity="0.55"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <path
          d="M30 21c11.3 0 11.3-5 22.6-5s11.4 5 22.7 5 11.3-5 22.7-5 11.3 5 22.6 5 11.4-5 22.7-5 11.3 5 22.7 5 11.3-5 22.6-5 11.4 5 22.7 5 11.3-5 22.7-5 11.3 5 22.6 5 11.4-5 22.7-5"
          fill="none"
          stroke="#8E9C8A"
          strokeOpacity="0.4"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
