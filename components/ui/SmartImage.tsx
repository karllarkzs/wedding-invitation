"use client";

import Image from "next/image";
import { useState } from "react";
import { EmbossedPlaceholder } from "./EmbossedPlaceholder";

type Props = {
  src: string;
  alt: string;
  /** Whether the file exists in /public (checked on the server). */
  available: boolean;
  sizes: string;
  placeholderLabel: string;
  placeholderScript?: string;
  placeholderSublabel?: string;
  /** Extra classes for the placeholder (e.g. "rounded-[50%]" for an oval frame). */
  placeholderClassName?: string;
  preload?: boolean;
  className?: string;
};

/**
 * next/image that falls back to an embossed-paper placeholder when the photo
 * is missing — either detected on the server, or if it fails to load.
 * The parent must be `relative` with a fixed aspect ratio.
 */
export function SmartImage({
  src,
  alt,
  available,
  sizes,
  placeholderLabel,
  placeholderScript,
  placeholderSublabel = "Photo coming soon",
  placeholderClassName = "",
  preload,
  className = "",
}: Props) {
  const [failed, setFailed] = useState(false);

  if (!available || failed) {
    return (
      <EmbossedPlaceholder
        label={placeholderLabel}
        script={placeholderScript}
        sublabel={placeholderSublabel}
        className={`absolute inset-0 ${placeholderClassName}`}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      className={`object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
