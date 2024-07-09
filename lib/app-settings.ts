import { NavigationProps } from "@/lib/definitions";

export const navigation: NavigationProps[] = [
  {
    route: "/",
    label: "Home",
    icon: "LayoutDashboard",
  },
  {
    route: "/vote",
    label: "Vote",
    icon: "Fingerprint",
  },
  {
    route: "/candidate",
    label: "Candidates",
    icon: "Users",
  },
  {
    route: "/about",
    label: "About",
    icon: "BadgeInfo",
  },
];
