import type { ReactNode } from "react";

type MobileShellProps = {
  children: ReactNode;
  className?: string;
};

export function MobileShell({ children, className = "" }: MobileShellProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,#ffffff_0,#f3efff_34%,#eef2ff_100%)] px-4 py-5 text-[#182039]">
      <section className={`mobile-shell ${className}`}>{children}</section>
    </main>
  );
}
