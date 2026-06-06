export type SceneKind = "student" | "work" | "social" | "formal";
export type IconKind =
  | SceneKind
  | "snail"
  | "hourglass"
  | "redirect"
  | "bell"
  | "translate"
  | "spark";

export const scenes = [
  {
    title: "学生沟通",
    href: "/input",
    icon: "student" as const,
  },
  {
    title: "职场沟通",
    href: "/input",
    icon: "work" as const,
  },
  {
    title: "社交沟通",
    href: "/input",
    icon: "social" as const,
  },
  {
    title: "正式事务",
    href: "/input",
    icon: "formal" as const,
  },
];

export const styles = [
  {
    title: "先别急",
    icon: "snail" as const,
    detail: "体面延期，争取时间。",
  },
  {
    title: "婉拒了当",
    icon: "hourglass" as const,
    detail: "优雅拒绝，不撕破脸。",
  },
  {
    title: "别甩给我",
    icon: "redirect" as const,
    detail: "划清边界，避免背锅。",
  },
  {
    title: "该交了吧",
    icon: "bell" as const,
    detail: "礼貌推进，让对方行动。",
  },
  {
    title: "翻译一下",
    icon: "translate" as const,
    detail: "识别潜台词，看懂真实意思。",
  },
  {
    title: "阴阳一下",
    icon: "spark" as const,
    detail: "阴阳怪气，但不直接翻车。",
  },
];

export const results = [
  {
    label: "微信短句版",
    tone: "lavender",
    text: "这件事我不太负责啦～\n建议找负责的同事确认一下哦！",
  },
  {
    label: "邮件正式版",
    tone: "blue",
    text: "你好，关于该事项我并非主要负责人，建议您联系相关负责人进行确认，谢谢！",
  },
  {
    label: "当面沟通版",
    tone: "pink",
    text: "我理解你着急想推进，不过这块确实不是我的方向，咱们一起找下负责的同事吧。",
  },
] as const;
