export type Candidate = {
  id: number;
  name: string;
  party: string;
  image: string;
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
