"use client";

import ElectionBanner from "@/components/custom/election-banner";
import { UserInfoDialog } from "@/components/custom/user-info-dialog";
import type { ElectionWithVoteStatus, UserResponse } from "@/lib/definitions";
import { useAuthStore } from "@/lib/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

function useElections() {
  return useQuery<ElectionWithVoteStatus[]>(`elections`, async () => {
    const { data } = await axios.get<ElectionWithVoteStatus[]>(`/api/election`);
    return data;
  });
}

function useUserInfo() {
  return useQuery<UserResponse>(`userInfo`, async () => {
    const { data } = await axios.get<UserResponse>(`/api/user/info`);
    return data;
  });
}

export default function Vote() {
  const { user } = useAuthStore();
  const [showUserInfoDialog, setShowUserInfoDialog] = useState(false);

  const { data: elections, isLoading: isElectionsLoading } = useElections();
  const {
    data: userInfo,
    isLoading: isUserInfoLoading,
    refetch: refetchUserInfo,
  } = useUserInfo();

  const handleUserInfoSubmit = () => {
    // TODO: Implement the logic to update user info
    refetchUserInfo();
  };

  useEffect(() => {
    if (!isUserInfoLoading && userInfo) {
      setShowUserInfoDialog(!userInfo.dateUpdated);
    }
  }, [userInfo, isUserInfoLoading]);

  return (
    <div className='w-full pt-20'>
      <UserInfoDialog
        isOpen={showUserInfoDialog}
        onClose={() => setShowUserInfoDialog(false)}
        onSubmit={handleUserInfoSubmit}
      />

      <div className='px-4 pt-5 grid grid-cols-1 gap-6 lg:px-0'>
        {!isElectionsLoading &&
          elections?.map((item, i) => (
            <ElectionBanner
              key={item.id}
              userId={user?.uid || ""}
              election={item}
            />
          ))}

        {isElectionsLoading && (
          <div className='grid grid-cols-1 gap-6'>
            {[...Array(3)].map((_, index) => (
              <div key={index} className='animate-pulse'>
                <div className='bg-gray-200 h-32 rounded-lg mb-2' />
                <div className='bg-gray-200 h-4 w-3/4 rounded mb-2' />
                <div className='bg-gray-200 h-4 w-1/2 rounded' />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
