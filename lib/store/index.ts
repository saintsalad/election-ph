// store.js
import { create } from "zustand";
import { User as FirebaseUser } from "firebase/auth";
import type { UserVotes } from "@/lib/definitions";

type AuthState = {
  user: FirebaseUser | null;
  loading: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setLoading: (loading: boolean) => void;
  userVotes: UserVotes[];
  setUserVotes: (vote: UserVotes | null) => void;
  hasUserVotedZ: (electionId: string) => boolean; // Function to check if user has voted
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  userVotes: [], // Initialize with an empty array
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setUserVotes: (vote) =>
    set((state) => ({
      userVotes: vote ? [...state.userVotes, vote] : state.userVotes, // Add the new vote to the array if it's not null
    })),
  hasUserVotedZ: (electionId) => {
    const state = get(); // Get the current state
    return state.userVotes.some(
      (vote: UserVotes) => vote.electionId === electionId
    );
  },
}));
