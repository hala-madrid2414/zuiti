import Link from "next/link";
import { DecorativeIcon } from "./DecorativeIcon";
import type { IconKind } from "./content";
import styles from "./SceneCard.module.css";

type SceneCardProps = {
  title: string;
  href: string;
  icon: IconKind;
};

export function SceneCard({ title, href, icon }: SceneCardProps) {
  return (
    <Link href={href} className="scene-card">
      <span className={styles.title}>{title}</span>
      <DecorativeIcon kind={icon} size="lg" />
    </Link>
  );
}
