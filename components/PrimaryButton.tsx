import Link from "next/link";
import type { ReactNode } from "react";

type PrimaryButtonProps = {
  href: string;
  children: ReactNode;
  sparkle?: boolean;
};

export function PrimaryButton({
  href,
  children,
  sparkle = false,
}: PrimaryButtonProps) {
  return (
    <Link href={href} className="primary-button">
      <span>{children}</span>
      {sparkle ? <span aria-hidden="true" className="text-xl">✦</span> : null}
    </Link>
  );
}
