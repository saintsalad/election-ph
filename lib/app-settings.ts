import { NavigationProps } from "@/lib/definitions";

export const navigation: NavigationProps[] = [
  {
    route: "/",
    label: "Home",
    isFullWidth: true,
  },
  {
    route: "#",
    label: "Election",
    isFullWidth: false,
    children: [
      {
        route: "/vote",
        label: "Vote",
        isFullWidth: false,
      },
      {
        route: "/candidates",
        label: "Candidates",
        isFullWidth: false,
      },
      {
        route: "/results",
        label: "Results",
        isFullWidth: false,
      },
    ],
  },
  {
    route: "/community",
    label: "Community",
    isFullWidth: false,
  },
  {
    route: "/faq",
    label: "FAQ",
    isHidden: true,
    isFullWidth: false,
  },
  {
    route: "/about",
    label: "About",
    isFullWidth: false,
  },
  {
    route: "/logout",
    label: "Logout",
    isFullWidth: true,
  },
  {
    route: "/profile",
    label: "Profile",
    isFullWidth: false,
    isHidden: true,
  },
  {
    route: "/settings",
    label: "Settings",
    isFullWidth: false,
    isHidden: true,
  },
];
