import React, { useEffect } from "react";
import { TrendingUp } from "lucide-react";
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

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as CandidateData;
    return (
      <div className='bg-white dark:bg-gray-800 bg-opacity-95 p-3 shadow-lg rounded-lg font-sans'>
        <p className='font-bold text-base mb-1' style={{ color: data.color }}>
          {data.candidate}
        </p>
        <p className='text-gray-700 dark:text-gray-300 text-sm mb-1'>
          Party: <span className='font-semibold'>{data.party}</span>
        </p>
        <p className='text-gray-700 dark:text-gray-300 text-sm'>
          Votes: <span className='font-semibold'>{data.votes}</span>
        </p>
      </div>
    );
  }

  return null;
};

interface CandidateData {
  candidate: string;
  party: string;
  votes: number;
  color: string;
}

interface MainCardProps extends BaseCardProps {
  electionType: string;
  candidateVotes: CandidateData[];
  chartConfig: any;
}

function formatYAxis(value: number): string {
  return value >= 1000
    ? `${Math.round(value / 1000)}k`
    : value.toLocaleString();
}

const MainCard: React.FC<MainCardProps> = (props) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const { theme } = useTheme();

  const topCandidates = isMobile
    ? props.candidateVotes.sort((a, b) => b.votes - a.votes).slice(0, 5)
    : props.candidateVotes;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      "--chart-height",
      props.expanded || isLargeScreen ? "550px" : "350px"
    );
  }, [props.expanded, isLargeScreen]);

  const footerContent = (
    <div className='ml-auto text-right'>
      <div className='flex items-center justify-end space-x-2'>
        <TrendingUp className='h-4 w-4 text-green-500' />
        <span>Voter turnout increased by 7.8% this election</span>
      </div>
      <div className='mt-1'>
        Total votes:{" "}
        {props.candidateVotes
          .reduce((sum, candidate) => sum + candidate.votes, 0)
          .toLocaleString()}
      </div>
    </div>
  );

  const getGradientId = (candidate: string) =>
    `gradient-${candidate.replace(/\s+/g, "-")}`;

  return (
    <BaseCard {...props} isMainCard={true} footerContent={footerContent}>
      {isMobile && (
        <div className='text-sm text-gray-500 dark:text-gray-400 mb-2 text-center'>
          Showing top 5 candidates
        </div>
      )}
      <div
        className='w-full transition-[height] duration-300 ease-in-out'
        style={{ height: "var(--chart-height, 300px)" }}>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={topCandidates}
            layout='horizontal'
            margin={{
              left: 20,
              right: 20,
              top: isMobile ? 20 : isLargeScreen ? 40 : 30,
              bottom: 20,
            }}>
            <CartesianGrid strokeDasharray='3 3' vertical={false} />
            <XAxis
              dataKey='candidate'
              type='category'
              axisLine={false}
              tickLine={false}
              tick={({ x, y, payload }) => (
                <g transform={`translate(${x},${y})`}>
                  <text
                    x={0}
                    y={0}
                    dy={16}
                    textAnchor='middle'
                    fill={theme === "dark" ? "#D1D5DB" : "#111827"}
                    className='text-[10px] sm:text-xs font-bold'>
                    {payload.value.split(" ")[0]}
                  </text>
                  {!isMobile && (
                    <text
                      x={0}
                      y={18}
                      dy={16}
                      textAnchor='middle'
                      fill={theme === "dark" ? "#9CA3AF" : "#4B5563"}
                      fontSize={10}
                      fontWeight='medium'>
                      {
                        topCandidates.find((c) => c.candidate === payload.value)
                          ?.party
                      }
                    </text>
                  )}
                </g>
              )}
              height={isMobile ? 40 : 60}
              interval={0}
            />
            <YAxis
              hide={isMobile}
              type='number'
              axisLine={false}
              tickLine={false}
              tick={{
                fill: theme === "dark" ? "#9CA3AF" : "#4B5563",
                fontSize: 12,
              }}
              tickFormatter={formatYAxis}
            />
            <Tooltip content={<CustomTooltip />} />
            <defs>
              {topCandidates.map((entry) => (
                <linearGradient
                  key={`gradient-${entry.candidate}`}
                  id={getGradientId(entry.candidate)}
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'>
                  <stop offset='5%' stopColor={entry.color} stopOpacity={0.8} />
                  <stop
                    offset='95%'
                    stopColor={entry.color}
                    stopOpacity={0.3}
                  />
                </linearGradient>
              ))}
            </defs>
            <Bar dataKey='votes' radius={[4, 4, 0, 0]}>
              {topCandidates.map((entry) => (
                <Cell
                  key={`cell-${entry.candidate}`}
                  fill={
                    theme === "dark"
                      ? `url(#${getGradientId(entry.candidate)})`
                      : entry.color
                  }
                />
              ))}
              <LabelList
                dataKey='votes'
                position='top'
                fill={theme === "dark" ? "#FFFFFF" : "#111827"}
                fontSize={12}
                fontWeight='bold'
                formatter={(value: number) => value.toLocaleString()}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </BaseCard>
  );
};

export default MainCard;
