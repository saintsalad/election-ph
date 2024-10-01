"use client";

import { useEffect, useState, useRef } from "react";
import {
  Maximize2,
  Minimize2,
  Settings,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Bar,
  BarChart,
  Cell,
  XAxis,
  YAxis,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Pie,
  PieChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TooltipProps } from "recharts";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import BaseCard, {
  BaseCardProps,
} from "@/components/custom/dashboard/base-card";
import MainCard from "@/components/custom/dashboard/main-card";
import GenderCard from "@/components/custom/dashboard/gender-card";
import { EducationCard } from "@/components/custom/dashboard/education-card";
import CityCard from "@/components/custom/dashboard/city-card";

const Page: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [visibleCards, setVisibleCards] = useState<string[]>([
    "Gender",
    "Education",
    "Age",
    "Cities",
  ]);
  const [electionType, setElectionType] = useState("Presidential");

  const toggleExpand = (title: string) => {
    setExpandedCard((prev) => (prev === title ? null : title));
  };

  const toggleCardVisibility = (title: string) => {
    setVisibleCards((prev) =>
      prev.includes(title)
        ? prev.filter((card) => card !== title)
        : [...prev, title]
    );
  };

  const sideCards = [
    {
      title: "Gender",
      description:
        "Analysis of voting patterns and preferences based on gender demographics in the election.",
    },
    {
      title: "Education",
      description:
        "Breakdown of voter turnout and political leanings across different educational backgrounds.",
    },
    {
      title: "Age",
      description:
        "Examination of how age groups influence voting behavior and election outcomes.",
    },
    {
      title: "Cities",
      description:
        "Comparison of election results and voter engagement across various urban centers.",
    },
  ];

  const electionTypes = ["Presidential", "Congressional", "State", "Local"];

  const candidateVotes = [
    {
      candidate: "Eren Yeager",
      party: "Scout Regiment",
      votes: 173000,
      color: "#2C3E50",
    },
    {
      candidate: "Mikasa Ackerman",
      party: "Survey Corps",
      votes: 186000,
      color: "#E74C3C",
    },
    {
      candidate: "Armin Arlert",
      party: "Colossal Titan",
      votes: 305000,
      color: "#F1C40F",
    },
    {
      candidate: "Levi Ackerman",
      party: "Special Operations",
      votes: 237000,
      color: "#3498DB",
    },
    {
      candidate: "Historia Reiss",
      party: "Royal Government",
      votes: 173000,
      color: "#9B59B6",
    },
    {
      candidate: "Reiner Braun",
      party: "Warrior Unit",
      votes: 30500,
      color: "#D35400",
    },
    {
      candidate: "Annie Leonhart",
      party: "Military Police",
      votes: 2222,
      color: "#1ABC9C",
    },
    {
      candidate: "Hange Zoë",
      party: "Research Corps",
      votes: 46465,
      color: "#27AE60",
    },
  ];

  const chartConfig = candidateVotes.reduce((config, candidate) => {
    config[candidate.candidate] = {
      label: candidate.candidate,
      color: candidate.color,
    };
    return config as ChartConfig;
  }, {} as ChartConfig);

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
            {...baseProps}
            title='Candidate Votes'
            description={`${electionType} Election Results`}
            electionType={electionType}
            candidateVotes={candidateVotes}
            chartConfig={chartConfig}
          />
        );
      case "Gender":
        return <GenderCard {...baseProps} />;
      case "Education":
        return <EducationCard {...baseProps} />;
      case "Age":
        return <GenderCard {...baseProps} />;
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='w-[200px] justify-between'>
                  {electionType} Election{" "}
                  <ChevronDown className='ml-2 h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-[200px]'>
                {electionTypes.map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onSelect={() => setElectionType(type)}>
                    {type} Election
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='icon'>
                  <Settings className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Customize View</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sideCards.map((card) => (
                  <DropdownMenuCheckboxItem
                    key={card.title}
                    checked={visibleCards.includes(card.title)}
                    onCheckedChange={() => toggleCardVisibility(card.title)}>
                    {card.title}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
              {sideCards
                .filter((card) => visibleCards.includes(card.title))
                .map((card) => (
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

export default Page;
