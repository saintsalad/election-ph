import { Icons } from "@/components/custom/icons";
import { FieldValue } from "firebase/firestore";

export type UserResponse = {
  displayName: string;
  email: string;
  age?: number;
  gender?: string;
  education?: string;
  city?: string;
  dateUpdated?: string;
};

// export type Candidate = {
//   id: string;
//   name: string;
//   party: string;
//   image: string;
//   shortDescription?: string;
//   description?: string;
// };

export type CandidateNext = {
  id: string;
  displayName: string;
  party: string;
  displayPhoto: string;
  shortDescription: string;

  ballotNumber: number;
  coverPhoto: string;
  biography: string; //markedjs
  educAttainment: string; //markedjs
  achievements: string; //markedjs
  platformAndPolicy: string; //markedjs
  socialLinks: SocialLinks[] | [];
};

export type SocialLinks = {
  type: "facebook" | "x" | "instagram" | "custom";
  url: string;
};

export type NavigationProps = {
  route: string;
  label: string;
  // icon?: string;
  isHidden?: boolean;
  isFullWidth: boolean;
  children?: NavigationProps[];
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

export type ElectionWithVoteStatus = Election & {
  isVoted: boolean;
};
export type ElectionNext = Omit<ElectionWithVoteStatus, "candidates"> & {
  candidates: CandidateNext[];
};

export type Vote = {
  id: string;
  referenceId: string;
  electionId: string;
  userId: string;
  value: string | string[];
  dateCreated: FieldValue;
};

export type VoteRequest = {
  electionId: string;
  referenceId: string;
  value: string | string[]; //candidateId
};

export type VoteResponse = {
  dateCreated: string;
  electionId: string;
  referenceId: string;
  userId: string;
  type: "single" | "multiple";
};

export type UserVotes = {
  electionId: string;
  candidate: string | string[];
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

export type VoteReceiptProps = {
  referenceId: string;
  dateCreated: string;
  electionTitle: string;
  userId: string;
  voteId: string;
};

export type UserRating = {
  rate: number;
  candidateId: string;
  userId: string;
};

export type CandidateRating = {
  candidateId: string;
  averageRating: number;
  numberOfRatings: number;
};
