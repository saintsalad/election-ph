import { Icons } from "@/components/custom/icons";

export type Candidate = {
  id: number;
  name: string;
  party: string;
  image: string;
  shortDescription?: string;
  description?: string;
};

export type NavigationProps = {
  route: string;
  label: string;
  icon: string;
};

export type APIResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type Election = {
  id: string;
  electionType: string;
  votingType: "multiple" | "single";
  numberOfVotes: number;
  startDate: string;
  endDate: string;
  description: string;
  candidates: string[]; // candidate id
  status: "active" | "inactive";
};

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
