"use client";

import { useState, useCallback, useEffect } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import MainCard from "@/components/custom/dashboard/main-card";
import GenderCard from "@/components/custom/dashboard/gender-card";
import { EducationCard } from "@/components/custom/dashboard/education-card";
import CityCard from "@/components/custom/dashboard/city-card";
import AgeCard from "@/components/custom/dashboard/age-card";
import { sideCards } from "@/constants/data";
import type { Election, VoteResult } from "@/lib/definitions";
import useReactQueryNext from "@/hooks/useReactQueryNext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { truncateText } from "@/lib/functions";
import { Suspense } from "react";

const ResultsContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const electionId = searchParams.get("electionId");

  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    data: elections,
    isLoading: isElectionsLoading,
    refetch,
    refetchWithoutCache,
  } = useReactQueryNext<Election[]>("elections", "/api/election");

  const {
    data: mainCardData,
    isLoading: isMainCardLoading,
    refetchNext: refetchNextMainCard,
  } = useReactQueryNext<VoteResult>("main-card", "/api/dashboard", {
    manual: true,
  });

  const currentElection = elections?.find(
    (election) => election.id === electionId
  );

  const fetchVoteData = useCallback((newElectionId: string) => {
    refetchNextMainCard(`?electionId=${newElectionId}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (elections && elections.length > 0 && !electionId) {
      const firstElection = elections[0];
      router.push(`/results?electionId=${firstElection.id}`);
      setIsLoading(false);
    } else if (electionId) {
      fetchVoteData(electionId);
      setIsLoading(false);
    }
  }, [elections, electionId, router, fetchVoteData]);

  const toggleExpand = (title: string) => {
    setExpandedCard((prev) => (prev === title ? null : title));
  };

  const renderCard = (cardType: string) => {
    const baseProps = {
      title: cardType,
      description: sideCards.find((card) => card.title === cardType)
        ?.description,
      expanded: expandedCard === cardType,
      onToggle: () => toggleExpand(cardType),
      fullWidth: expandedCard === cardType,
      isMainCard: cardType === "Main",
    };

    switch (cardType) {
      case "Main":
        return (
          <MainCard
            voteResult={mainCardData}
            isLoading={isMainCardLoading}
            {...baseProps}
            title='Candidate Votes'
            description={`${currentElection?.description || "Presidential"}`}
            // electionType={currentElection?.description || "Presidential"}
          />
        );
      case "Gender":
        return <GenderCard {...baseProps} />;
      case "Education":
        return <EducationCard {...baseProps} />;
      case "Age":
        return <AgeCard {...baseProps} />;
      case "Cities":
        return <CityCard {...baseProps} />;
      default:
        return null;
    }
  };

  return (
    <div className='bg-background min-h-screen pt-16 flex flex-col'>
      <header className='bg-background border-b border-border px-4 sm:px-6 py-4'>
        <div className='mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0'>
          <h1 className='text-2xl font-semibold text-foreground'>
            Election Dashboard
          </h1>
          <div className='flex items-center space-x-4'>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  title={currentElection?.description}
                  variant='outline'
                  role='combobox'
                  aria-expanded={open}
                  className='w-[250px] justify-between'
                  disabled={isElectionsLoading || isLoading}>
                  {isElectionsLoading || isLoading ? (
                    <Loader2 className='mx-auto h-4 w-4 animate-spin text-gray-500' />
                  ) : (
                    <span className='truncate'>
                      {currentElection
                        ? truncateText(currentElection.description, 30)
                        : "Select election..."}
                    </span>
                  )}
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-[250px] p-0'>
                <Command>
                  <CommandInput placeholder='Search election...' />
                  <CommandList>
                    <CommandEmpty>No election found.</CommandEmpty>
                    <CommandGroup>
                      {elections?.map((election) => (
                        <CommandItem
                          key={election.id}
                          value={election.description}
                          onSelect={() => {
                            router.push(`/results?electionId=${election.id}`);
                            setOpen(false);
                          }}
                          className='flex items-center justify-between'>
                          {election.description}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4 shrink-0",
                              election.id === electionId
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>
      <div className='flex flex-1 p-4 sm:p-6 lg:px-5 mx-auto w-full'>
        {expandedCard ? (
          <div className='w-full'>{renderCard(expandedCard)}</div>
        ) : (
          <div className='grid grid-cols-1 gap-5 w-full lg:grid-cols-4 xl:grid-cols-5 lg:gap-6'>
            <div className='w-full lg:col-span-3 xl:col-span-3 lg:h-full'>
              {renderCard("Main")}
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-5 lg:col-span-1 xl:col-span-2 lg:h-full lg:overflow-y-auto'>
              {sideCards.map((card) => (
                <div key={card.title} className='w-full'>
                  {renderCard(card.title)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Modify the main Page component
const Page: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
};

export default Page;
