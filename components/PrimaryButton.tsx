"use client";

import { Button } from "antd-mobile";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import styles from "./PrimaryButton.module.css";

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
  const router = useRouter();

  return (
    <Button
      className={`primary-button ${styles.button}`}
      onClick={() => router.push(href)}
    >
      <span>{children}</span>
      {sparkle ? (
        <span aria-hidden="true" className={styles.sparkle} />
      ) : null}
    </Button>
  );
}
