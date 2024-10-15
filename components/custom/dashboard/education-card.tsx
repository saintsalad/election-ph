import React, { useEffect, useMemo } from "react";
import { TrendingUp, Loader2, FileX2, Loader } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
  TooltipProps,
} from "recharts";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useTheme } from "next-themes";
import BaseCard, {
  BaseCardProps,
} from "@/components/custom/dashboard/base-card";
import { Skeleton } from "@/components/ui/skeleton";
import { EducationVoteResult } from "@/lib/definitions";
import { analyzeEducationVotes } from "@/lib/functions";

interface EducationData {
  level: string;
  voters: number;
  color: string;
  percentage?: number;
}

interface EducationResult {
  educationData: EducationData[];
  totalVoters: number;
  highestEducationLevel: string;
  collegeTurnoutChange: number;
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as EducationData;
    return (
      <div className='bg-white dark:bg-gray-800 bg-opacity-95 p-3 shadow-lg rounded-lg font-sans'>
        <p className='font-bold text-base mb-1' style={{ color: data.color }}>
          {data.level}
        </p>
        <p className='text-gray-700 dark:text-gray-300 text-sm'>
          Percentage:{" "}
          <span className='font-semibold'>{data.percentage?.toFixed(1)}%</span>
        </p>
        <p className='text-gray-700 dark:text-gray-300 text-sm'>
          Voters:{" "}
          <span className='font-semibold'>{data.voters.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};

interface EducationCardProps extends BaseCardProps {
  educationData: EducationVoteResult | undefined;
  isLoading: boolean;
}

export const EducationCard: React.FC<EducationCardProps> = ({
  educationData,
  isLoading = false,
  ...props
}) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const { theme } = useTheme();

  const processedEducationData = useMemo(() => {
    if (!educationData) return [];
    return educationData.voteResult.map((item) => ({
      ...item,
      percentage: (item.voters / educationData.totalVoters) * 100,
    }));
  }, [educationData]);

  const analysis = useMemo(
    () => analyzeEducationVotes(educationData),
    [educationData]
  );

  const footerContent = (
    <div className='ml-auto text-right'>
      <div className='flex items-center justify-end space-x-2'>
        {analysis.icon}
        <span className='text-sm font-medium'>{analysis.message}</span>
      </div>
      <div className='mt-1 text-xs text-gray-500'>
        Total voters: {educationData?.totalVoters.toLocaleString() ?? 0}
      </div>
    </div>
  );

  const renderSkeleton = () => (
    <div className='space-y-4'>
      <Skeleton className='h-8 w-1/3' />
      <div className='space-y-2'>
        {[...Array(4)].map((_, index) => (
          <div key={index} className='flex items-center space-x-2'>
            <Skeleton className='h-6 w-1/4' />
            <Skeleton className='h-6 flex-grow' />
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='flex flex-col items-center justify-center h-full min-h-[250px]'>
          <Loader className='w-8 h-8 text-gray-400 dark:text-gray-600 animate-spin mb-2' />
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Loading education data...
          </p>
        </div>
      );
    }

    if (!educationData) {
      return (
        <div className='flex flex-col items-center justify-center h-full min-h-[250px]'>
          <FileX2 className='w-8 h-8 mb-2 text-gray-400 dark:text-gray-600' />
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            No education data available
          </p>
        </div>
      );
    }
    return (
      <div className='w-full h-full flex-grow min-h-[250px]'>
        <ResponsiveContainer width='100%' height='100%' minHeight={250}>
          <BarChart
            data={processedEducationData}
            layout='vertical'
            margin={{ top: 20, right: 50, left: 20, bottom: 20 }}>
            <CartesianGrid
              strokeDasharray='3 3'
              horizontal={false}
              vertical={true}
            />
            <XAxis
              type='number'
              axisLine={false}
              tickLine={false}
              tick={{
                fill: theme === "dark" ? "#D1D5DB" : "#111827",
                fontSize: isMobile ? 12 : 10,
              }}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis
              dataKey='level'
              type='category'
              axisLine={false}
              tickLine={false}
              tick={false}
              width={1}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey='percentage' radius={[0, 4, 4, 0]}>
              {processedEducationData.map((entry) => (
                <Cell key={`cell-${entry.level}`} fill={entry.color} />
              ))}
              <LabelList
                dataKey='level'
                position='insideLeft'
                fill={theme === "dark" ? "#FFFFFF" : "#111827"}
                fontSize={isMobile ? 10 : 10}
                fontWeight='bold'
                formatter={(value: string) =>
                  isMobile ? value.split(" ")[0] : value
                }
                offset={5}
              />
              <LabelList
                dataKey='percentage'
                position='right'
                fill={theme === "dark" ? "#D1D5DB" : "#111827"}
                fontSize={isMobile ? 10 : 10}
                fontWeight='bold'
                formatter={(value: number, entry: EducationData) => {
                  if (value === 0) return "";
                  return `${value.toFixed(1)}%`;
                }}
                offset={5}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <BaseCard {...props} footerContent={footerContent}>
      {renderContent()}
    </BaseCard>
  );
};

export default EducationCard;
