import Link from "next/link";

type TopBarProps = {
  title?: string;
  backHref?: string;
};

export function TopBar({ title, backHref }: TopBarProps) {
  return (
    <header className="space-y-5">
      <div className="flex h-5 items-center justify-between text-[13px] font-black text-[#15192d]">
        <span>9:41</span>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="signal-bars">
            <i />
            <i />
            <i />
          </span>
          <span className="wifi-mark" />
          <span className="battery-mark" />
        </div>
      </div>

      {title ? (
        <div className="grid grid-cols-[32px_1fr_32px] items-center">
          {backHref ? (
            <Link
              href={backHref}
              className="flex size-8 items-center justify-start text-3xl leading-none text-[#15192d]"
              aria-label="返回"
            >
              ‹
            </Link>
          ) : (
            <span />
          )}
          <h1 className="text-center text-[18px] font-black tracking-[-0.01em]">
            {title}
          </h1>
          <span />
        </div>
      ) : null}
    </header>
  );
}
