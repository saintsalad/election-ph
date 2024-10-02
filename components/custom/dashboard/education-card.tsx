import React, { useState, useEffect, useRef } from "react";
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

interface EducationData {
  level: string;
  voters: number;
  color: string;
  percentage?: number; // We'll calculate this
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

export const EducationCard: React.FC<BaseCardProps> = (props) => {
  const [chartDimensions, setChartDimensions] = useState({
    width: 0,
    height: 0,
  });
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const { theme } = useTheme();

  const educationData: EducationData[] = [
    { level: "High School or Less", voters: 150000, color: "#60A5FA" },
    { level: "Some College", voters: 75000, color: "#8B5CF6" },
    { level: "College Degree", voters: 200000, color: "#34D399" },
    { level: "Advanced Degree", voters: 150000, color: "#F59E0B" },
  ];

  // Calculate total voters and percentages
  const totalVoters = educationData.reduce((sum, item) => sum + item.voters, 0);
  educationData.forEach((item) => {
    item.percentage = (item.voters / totalVoters) * 100;
  });

  useEffect(() => {
    function updateDimensions() {
      if (chartContainerRef.current) {
        const { width, height } =
          chartContainerRef.current.getBoundingClientRect();
        setChartDimensions({ width, height });
      }
    }

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
    }

    window.addEventListener("resize", updateDimensions);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const footerContent = (
    <div className='ml-auto text-right'>
      <div className='flex items-center justify-end space-x-2'>
        <TrendingUp className='h-4 w-4 text-green-500' />
        <span>College graduates&apos; turnout up by 4.2%</span>
      </div>
      <div className='mt-1'>
        Highest education level: Bachelor&apos;s degree
      </div>
    </div>
  );

  const getGradientId = (level: string) =>
    `education-gradient-${level.replace(/\s+/g, "-").toLowerCase()}`;

  const getBarSize = () => (isMobile ? 20 : isTablet ? 30 : 40);

  return (
    <BaseCard {...props} footerContent={footerContent}>
      <div
        ref={chartContainerRef}
        className='w-full h-full flex-grow min-h-[250px]'>
        {chartDimensions.width > 0 && chartDimensions.height > 0 && (
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
        )}
      </div>
    </BaseCard>
  );
};
