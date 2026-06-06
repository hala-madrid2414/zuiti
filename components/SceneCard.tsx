import Link from "next/link";
import { DecorativeIcon } from "./DecorativeIcon";
import type { IconKind } from "./content";

type SceneCardProps = {
  title: string;
  href: string;
  icon: IconKind;
};

export function SceneCard({ title, href, icon }: SceneCardProps) {
  return (
    <Link href={href} className="scene-card">
      <span className="text-[17px] font-black">{title}</span>
      <DecorativeIcon kind={icon} size="lg" />
    </Link>
  );
}
