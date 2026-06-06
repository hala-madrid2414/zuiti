import { DecorativeIcon } from "./DecorativeIcon";
import type { IconKind } from "./content";

type StyleCardProps = {
  title: string;
  detail: string;
  icon: IconKind;
  active?: boolean;
};

export function StyleCard({ title, detail, icon, active = false }: StyleCardProps) {
  return (
    <button type="button" className={`style-card group ${active ? "active" : ""}`}>
      <span className="text-[14px] font-black">{title}</span>
      <DecorativeIcon kind={icon} size="md" />
      <span className="style-tip">{detail}</span>
    </button>
  );
}
