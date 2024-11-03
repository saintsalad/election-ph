import React, { useState, useEffect, useMemo } from "react";
import { TrendingUp, Minus, AlertCircle, Loader } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { TooltipProps } from "recharts";
import { useTheme } from "next-themes";
import BaseCard, {
  BaseCardProps,
} from "@/components/custom/dashboard/base-card";
import { GenderData, GenderVoteResult } from "@/lib/definitions";
import { Skeleton } from "@/components/ui/skeleton";
import { analyzeGenderVotes } from "@/lib/functions";

interface GenderCardProps extends BaseCardProps {
  genderData: GenderVoteResult | undefined;
  isLoading: boolean;
  isError: boolean;
}

function NoDataState() {
  return (
    <div className='flex flex-col items-center justify-center h-[300px] text-gray-500 dark:text-gray-400'>
      <Minus className='w-12 h-12 mb-4' />
      <p>No gender data available</p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className='flex flex-col items-center justify-center h-[300px] text-gray-700 dark:text-gray-300'>
      <div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-full mb-4'>
        <AlertCircle className='w-8 h-8 text-red-500 dark:text-red-400' />
      </div>
      <h3 className='text-lg font-medium mb-2'>
        Unable to load gender distribution
      </h3>
      <p className='text-sm text-gray-500 dark:text-gray-400 text-center max-w-[250px]'>
        We&apos;re having trouble loading the gender data. Please try again
        later.
      </p>
    </div>
  );
}

const GenderCard: React.FC<GenderCardProps> = ({
  genderData,
  isLoading,
  isError = false,
  ...props
}) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const { theme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      "--chart-height",
      props.expanded ? "450px" : "230px"
    );
  }, [props.expanded]);

  const totalVoters = useMemo(
    () =>
      genderData?.voteResult.reduce(
        (sum: number, item: GenderData) => sum + item.votes,
        0
      ) || 0,
    [genderData]
  );

  const analysis = useMemo(() => analyzeGenderVotes(genderData), [genderData]);

  const footerContent = (
    <div className='ml-auto text-right'>
      <div className='flex items-center justify-end space-x-2'>
        {analysis.icon}
        <span className='text-sm font-medium'>{analysis.message}</span>
      </div>
      <div className='mt-1 text-xs text-gray-500'>
        Total votes: {genderData?.totalVotes.toLocaleString() ?? 0}
      </div>
    </div>
  );
  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, index } =
      props;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill={theme === "dark" ? "#FFFFFF" : "#111827"}
        fontSize={props.expanded ? 14 : 12}
        fontWeight='bold'
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline='central'>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as GenderData;
      return (
        <div className='bg-white dark:bg-gray-800 bg-opacity-95 p-3 shadow-lg rounded-lg font-sans'>
          <p className='font-bold text-base mb-1' style={{ color: data.color }}>
            {data.gender}
          </p>
          <p className='text-gray-700 dark:text-gray-300 text-sm mb-1'>
            Voters:{" "}
            <span className='font-semibold'>{data.votes.toLocaleString()}</span>
          </p>
          <p className='text-gray-700 dark:text-gray-300 text-sm'>
            Percentage:{" "}
            <span className='font-semibold'>
              {((data.votes / totalVoters) * 100).toFixed(2)}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const renderSkeleton = () => (
    <div className='space-y-6'>
      <div className='flex justify-center'>
        <Skeleton className='h-[230px] w-[230px] rounded-full' />
      </div>
      <div className='flex justify-center space-x-6'>
        {[...Array(3)].map((_, i) => (
          <div key={i} className='flex items-center space-x-2'>
            <Skeleton className='h-3 w-3 rounded-sm' />
            <Skeleton className='h-4 w-16' />
          </div>
        ))}
      </div>
      <div className='flex justify-end space-x-2'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-4 w-16' />
      </div>
    </div>
  );

  const renderContent = () => {
    if (isError) {
      return <ErrorState />;
    }

    if (isLoading) {
      return renderSkeleton();
    }

    if (!genderData || genderData.totalVotes === 0) {
      return <NoDataState />;
    }

    return (
      <div className='w-full flex flex-col items-center'>
        <div
          className={`transition-all duration-300 ease-in-out ${
            props.expanded ? "w-full h-[450px]" : "w-[230px] h-[230px]"
          }`}>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={genderData.voteResult}
                dataKey='votes'
                nameKey='gender'
                cx='50%'
                cy='50%'
                outerRadius={props.expanded ? "90%" : "85%"}
                labelLine={false}
                label={renderCustomizedLabel}
                onMouseEnter={onPieEnter}
                strokeWidth={2}
                stroke={theme === "dark" ? "#1F2937" : "#F3F4F6"}>
                {genderData.voteResult.map(
                  (entry: { color: string }, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={activeIndex === index ? 1 : 0.75}
                    />
                  )
                )}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className='flex justify-center mt-4 flex-wrap gap-4'>
          {genderData.voteResult.map((entry, index) => (
            <div
              key={`legend-${index}`}
              className='flex items-center space-x-2 min-w-[80px]'>
              <div
                className='w-3 h-3 rounded-sm'
                style={{ backgroundColor: entry.color }}
              />
              <span className='text-sm font-medium whitespace-nowrap'>
                {entry.gender}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <BaseCard {...props} footerContent={footerContent}>
      {renderContent()}
    </BaseCard>
  );
};

export default GenderCard;
