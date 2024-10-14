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
  educationResult: EducationResult | undefined;
  isLoading: boolean;
}

export const EducationCard: React.FC<EducationCardProps> = ({
  isLoading = false,
  educationResult,
  ...props
}) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const { theme } = useTheme();

  const educationData = useMemo(() => {
    if (!educationResult) return [];
    return educationResult.educationData.map((item) => ({
      ...item,
      percentage: (item.voters / educationResult.totalVoters) * 100,
    }));
  }, [educationResult]);

  const footerContent = useMemo(() => {
    if (!educationResult) return null;
    return (
      <div className='ml-auto text-right'>
        <div className='flex items-center justify-end space-x-2'>
          <TrendingUp className='h-4 w-4 text-green-500' />
          <span>
            College graduates&apos; turnout{" "}
            {educationResult.collegeTurnoutChange > 0 ? "up" : "down"} by{" "}
            {Math.abs(educationResult.collegeTurnoutChange).toFixed(1)}%
          </span>
        </div>
        <div className='mt-1'>
          Highest education level: {educationResult.highestEducationLevel}
        </div>
      </div>
    );
  }, [educationResult]);

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
        <div className='flex flex-col items-center justify-center h-full'>
          <Loader className='w-8 h-8 text-gray-400 dark:text-gray-600 animate-spin mb-2' />
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Loading education data...
          </p>
        </div>
      );
    }

    if (!educationResult) {
      return (
        <div className='flex flex-col items-center justify-center h-full'>
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
            data={educationData}
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
              {educationData.map((entry) => (
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
              />
              <LabelList
                dataKey='percentage'
                position='right'
                fill={theme === "dark" ? "#D1D5DB" : "#111827"}
                fontSize={isMobile ? 10 : 10}
                fontWeight='bold'
                formatter={(value: number) => `${value.toFixed(1)}%`}
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
