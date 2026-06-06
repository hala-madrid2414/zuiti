const navItems = [
  { label: "首页", icon: "home", active: true },
  { label: "记录", icon: "note" },
  { label: "语气仪表盘", icon: "meter" },
  { label: "我的", icon: "user" },
];

export function BottomNav() {
  return (
    <nav className="mt-auto grid grid-cols-4 border-t border-[#eef0fb] bg-white/80 px-2 pt-3">
      {navItems.map((item) => (
        <button
          key={item.label}
          type="button"
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            item.active ? "text-[#8875ff]" : "text-[#626b82]"
          }`}
        >
          <span className={`nav-icon nav-icon-${item.icon}`} aria-hidden="true" />
          {item.label}
        </button>
      ))}
    </nav>
  );
}
