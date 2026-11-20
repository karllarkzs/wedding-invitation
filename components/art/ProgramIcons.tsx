import type { ProgramIcon as IconName } from "@/config/wedding.config";

/** Small original line icons for the program timeline. */
export function ProgramIcon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name]}
    </svg>
  );
}

const ICONS: Record<IconName, React.ReactNode> = {
  rings: (
    <>
      <circle cx="9.3" cy="14.4" r="5.3" />
      <circle cx="14.8" cy="14.4" r="5.3" />
      <path d="M7.8 7.6 9.3 5.6l1.5 2-1.5 1.4Z" />
    </>
  ),
  camera: (
    <>
      <rect x="3.5" y="7.5" width="17" height="11.5" rx="2.2" />
      <circle cx="12" cy="13.2" r="3.3" />
      <path d="m8.6 7.5 1.4-2.4h4l1.4 2.4" />
      <path d="M17.4 10.2h.01" />
    </>
  ),
  glass: (
    <>
      <path d="M6.2 3.8h5.4l-.5 6.1a2.2 2.2 0 0 1-4.4 0Z" />
      <path d="M8.9 12.1v7.4M6.6 20h4.6" />
      <path d="M13.2 6.2h5.2l-.6 5.4a2 2 0 0 1-4 0Z" />
      <path d="M15.8 13.6v5.9M13.6 20h4.4" />
    </>
  ),
  dinner: (
    <>
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="3.6" />
      <path d="M3 5v4.2a1.2 1.2 0 0 0 2.4 0V5M4.2 10.4V19" />
      <path d="M20.6 19V4.8c-1.4.6-2.3 2.5-2.3 4.9 0 1.8.9 2.6 2.3 2.7" />
    </>
  ),
  dance: (
    <>
      <path d="M9 17.6V6.6l9.4-2.1v11" />
      <circle cx="7" cy="17.6" r="2" />
      <circle cx="16.4" cy="15.5" r="2" />
      <path d="M9 9.8l9.4-2.1" />
    </>
  ),
  sparkle: (
    <>
      <path d="M11 3c.5 4.8 3 7.3 7.8 7.8-4.8.5-7.3 3-7.8 7.8-.5-4.8-3-7.3-7.8-7.8C8 10.3 10.5 7.8 11 3Z" />
      <path d="M18.6 15.2c.2 1.7 1.1 2.6 2.8 2.8-1.7.2-2.6 1.1-2.8 2.8-.2-1.7-1.1-2.6-2.8-2.8 1.7-.2 2.6-1.1 2.8-2.8Z" />
    </>
  ),
};
