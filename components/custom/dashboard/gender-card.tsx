import React, { useState, useEffect, useRef } from "react";
import { TrendingUp } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { TooltipProps } from "recharts";
import { useTheme } from "next-themes";
import BaseCard, {
  BaseCardProps,
} from "@/components/custom/dashboard/base-card";

interface GenderData {
  gender: string;
  voters: number;
  color: string;
}

const GenderCard: React.FC<BaseCardProps> = (props) => {
  const [chartDimensions, setChartDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const updateDimensions = () => {
      if (chartContainerRef.current) {
        const { width, height } =
          chartContainerRef.current.getBoundingClientRect();
        setChartDimensions({ width, height });
      }
    };

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

  const genderData: GenderData[] = [
    { gender: "Male", voters: 450000, color: "#3B82F6" },
    { gender: "Female", voters: 420000, color: "#EC4899" },
    { gender: "Others", voters: 30000, color: "#10B981" },
  ];

  const totalVoters = genderData.reduce((sum, item) => sum + item.voters, 0);

  const footerContent = (
    <div className='w-full flex flex-col items-end justify-end text-sm text-muted-foreground'>
      <div className='flex items-center space-x-2'>
        <TrendingUp className='h-4 w-4 text-green-500' />
        <span>
          <strong>Female</strong> voters increased by <strong>3.5%</strong> this
          election
        </span>
      </div>
      <div className='mt-1'>
        Total of <strong>{totalVoters.toLocaleString()}</strong> voters
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
        fontSize={13}
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
            <span className='font-semibold'>
              {data.voters.toLocaleString()}
            </span>
          </p>
          <p className='text-gray-700 dark:text-gray-300 text-sm'>
            Percentage:{" "}
            <span className='font-semibold'>
              {((data.voters / totalVoters) * 100).toFixed(2)}%
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

  return (
    <BaseCard {...props} footerContent={footerContent}>
      <div className='main w-full h-full flex flex-col'>
        <div ref={chartContainerRef} className='w-full flex-grow min-h-[230px]'>
          {chartDimensions.width > 0 && chartDimensions.height > 0 && (
            <ResponsiveContainer width='100%' height='100%' minHeight={230}>
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={genderData}
                  dataKey='voters'
                  nameKey='gender'
                  cx='50%'
                  cy='50%'
                  outerRadius={
                    Math.min(chartDimensions.width, chartDimensions.height) *
                    0.35
                  }
                  labelLine={false}
                  label={renderCustomizedLabel}
                  onMouseEnter={onPieEnter}
                  strokeWidth={2} // Increased stroke width
                  stroke={theme === "dark" ? "#1F2937" : "#F3F4F6"} // Matching background color
                >
                  {genderData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={activeIndex === index ? 1 : 0.75}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className='flex justify-center mt-4'>
          {genderData.map((entry, index) => (
            <div key={`legend-${index}`} className='flex items-center mx-2'>
              <div
                className='w-3 h-3 mr-1 rounded-sm'
                style={{ backgroundColor: entry.color }}
              />
              <span className='text-sm font-medium'>{entry.gender}</span>
            </div>
          ))}
        </div>
      </div>
    </BaseCard>
  );
};

export default GenderCard;
