import { NavItem } from "@/lib/definitions";

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/master/",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Election",
    href: "/master/election",
    icon: "user",
    label: "Election",
  },
  {
    title: "Candidate",
    href: "/master/candidate",
    icon: "employee",
    label: "Candidate",
  },
];
