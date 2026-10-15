import Image from "next/image";
import { withBase } from "@/lib/base-path";

/** The hospital's official crest (supplied in the requirements form), background removed. */
export default function Logo({
  className = "h-12 w-12",
  priority = false,
  size = "md",
}: {
  className?: string;
  priority?: boolean;
  /** sm for icon-sized uses (nav, footer), md for medium, lg for hero-sized. */
  size?: "sm" | "md" | "lg";
}) {
  const src = withBase({ sm: "/logo-sm.webp", md: "/logo-md.webp", lg: "/logo-lg.webp" }[size]);
  return (
    <Image
      src={src}
      alt="Ramanand Hospital logo"
      width={size === "sm" ? 192 : size === "md" ? 384 : 640}
      height={size === "sm" ? 192 : size === "md" ? 384 : 640}
      sizes="(min-width: 1024px) 256px, 128px"
      priority={priority}
      className={`${className} object-contain`}
    />
  );
}
