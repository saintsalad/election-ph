"use client";

import ElectionBanner from "@/components/custom/election-banner";
import { UserInfoDialog } from "@/components/custom/user-info-dialog";
import type { ElectionWithVoteStatus, UserResponse } from "@/lib/definitions";
import { useAuthStore } from "@/lib/store";
import axios from "axios";
import { useQuery } from "react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { VoteIcon } from "lucide-react";
import useReactQueryNext from "@/hooks/useReactQueryNext";
import { useState } from "react";

function useElections() {
  return useReactQueryNext<ElectionWithVoteStatus[]>(
    "elections",
    "/api/election"
  );
}

function useUserInfo(userId: string) {
  return useReactQueryNext<UserResponse>(
    `user-info-${userId}`,
    "/api/user/info"
  );
}

export default function Vote() {
  const { user } = useAuthStore();
  const {
    data: elections,
    refetchWithoutCache: refetchElections,
    isLoading: isElectionsLoading,
  } = useElections();
  const {
    data: userInfo,
    isLoading: isUserInfoLoading,
    refetchWithoutCache: refetchUserInfo,
  } = useUserInfo(user?.uid || "");
  const [showUserInfoDialog, setShowUserInfoDialog] = useState(false);

  // const showUserInfoDialog =
  //   !isUserInfoLoading && userInfo && !userInfo.dateUpdated;

  const handleUserInfoSubmit = () => {
    // TODO: Implement the logic to update user info
    refetchUserInfo();
    refetchElections();
  };

  return (
    <div className='container mx-auto px-4 pt-24 sm:px-6 lg:px-8'>
      <header className='mb-12 text-center'>
        <h1 className='flex items-center justify-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
          <VoteIcon className='mr-3 h-8 w-8 text-blue-600 dark:text-blue-400' />
          <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400'>
            Available Elections
          </span>
        </h1>
        <p className='mt-3 text-lg text-gray-600 dark:text-gray-300'>
          Cast your vote in the ongoing elections
        </p>
      </header>

      <UserInfoDialog
        isOpen={showUserInfoDialog}
        onClose={() => setShowUserInfoDialog(false)}
        onSubmit={handleUserInfoSubmit}
      />

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {!isElectionsLoading &&
          elections?.map((item) => (
            <ElectionBanner
              key={item.id}
              userId={user?.uid || ""}
              election={item}
              hasUserInfo={!!userInfo?.dateUpdated}
              openUserInfoDialog={() => setShowUserInfoDialog(true)}
            />
          ))}

        {isElectionsLoading && (
          <>
            {[...Array(3)].map((_, index) => (
              <ElectionSkeleton key={index} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function ElectionSkeleton() {
  return (
    <div className='rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 p-4 shadow-sm'>
      <Skeleton className='h-32 w-full mb-4' />
      <Skeleton className='h-4 w-3/4 mb-2' />
      <Skeleton className='h-4 w-1/2' />
    </div>
  );
}
