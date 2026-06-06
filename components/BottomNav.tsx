"use client";

import { TabBar } from "antd-mobile";
import styles from "./BottomNav.module.css";

const navItems = [
  { key: "home", label: "首页", icon: "home" },
  { key: "note", label: "记录", icon: "note" },
  { key: "meter", label: "语气仪表盘", icon: "meter" },
  { key: "user", label: "我的", icon: "user" },
];

export function BottomNav() {
  return (
    <nav className={styles.nav}>
      <TabBar activeKey="home" className={styles.tabBar}>
        {navItems.map((item) => (
          <TabBar.Item
            key={item.key}
            icon={<span className={`nav-icon nav-icon-${item.icon}`} aria-hidden="true" />}
            title={item.label}
          />
        ))}
      </TabBar>
    </nav>
  );
}
