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
    icon: "vote",
    label: "Election",
  },
  {
    title: "Candidates",
    href: "/master/candidates",
    icon: "users",
    label: "Candidates",
  },
];

export type CandidateViewTab = {
  id?: string;
  value: string;
  label: string;
};

export const candidateViewTabs: CandidateViewTab[] = [
  {
    value: "rating",
    label: "Rating ✨",
  },
  {
    id: "biography",
    value: "bio",
    label: "Biography",
  },
  {
    id: "educAttainment",
    value: "educ-attainment",
    label: "Educational Attainment",
  },
  {
    id: "achievements",
    value: "achievements",
    label: "Achievements",
  },
  {
    id: "platformAndPolicy",
    value: "platform-policy",
    label: "Platform & Policy",
  },
];
