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
  Card as UICard,
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
import {
  Card,
  CardContent as UICardContent,
  CardDescription as UICardDescription,
  CardFooter as UICardFooter,
  CardHeader as UICardHeader,
  CardTitle as UICardTitle,
} from "@/components/ui/card";

interface BaseCardProps {
  title: string;
  description?: string;
  expanded: boolean;
  onToggle: () => void;
  fullWidth: boolean;
  isMainCard?: boolean;
  footerContent?: React.ReactNode;
}

const BaseCard: React.FC<BaseCardProps & { children?: React.ReactNode }> = ({
  title,
  description,
  expanded,
  onToggle,
  fullWidth,
  isMainCard = false,
  footerContent,
  children,
}) => {
  const [isExpanding, setIsExpanding] = useState(false);

  useEffect(() => {
    if (expanded) {
      setIsExpanding(true);
      const timer = setTimeout(() => setIsExpanding(false), 300);
      return () => clearTimeout(timer);
    }
  }, [expanded]);

  const showFooter = isMainCard || expanded;

  return (
    <Card
      className={`overflow-hidden ${
        fullWidth ? "w-full h-full" : "w-full"
      } transition-all duration-300 ${
        isExpanding ? "animate-in zoom-in-95" : ""
      } flex flex-col lg:h-full`}>
      <CardHeader className='relative flex-shrink-0'>
        <div className='flex justify-between items-center'>
          <CardTitle>{title}</CardTitle>
          <button
            onClick={onToggle}
            className='text-gray-500 hover:text-gray-700 transition-colors duration-200'>
            {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
        {expanded && description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className='flex-grow overflow-auto'>{children}</CardContent>
      {showFooter && (
        <CardFooter className='text-sm text-muted-foreground flex-shrink-0'>
          {footerContent}
        </CardFooter>
      )}
    </Card>
  );
};

interface CandidateData {
  candidate: string;
  party: string;
  votes: number;
  color: string;
}

const MainCard: React.FC<
  BaseCardProps & {
    electionType: string;
    candidateVotes: CandidateData[];
    chartConfig: any;
  }
> = (props) => {
  const [chartDimensions, setChartDimensions] = useState({
    width: 0,
    height: 0,
  });
  const chartContainerRef = useRef<HTMLDivElement>(null);

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

    // Ensure dimensions are updated on mount
    window.addEventListener("resize", updateDimensions);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const formatYAxis = (value: number) => {
    return value.toLocaleString();
  };

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

  return (
    <BaseCard {...props} isMainCard={true} footerContent={footerContent}>
      <div
        ref={chartContainerRef}
        className='w-full h-full flex-grow min-h-[300px]'>
        {chartDimensions.width > 0 && chartDimensions.height > 0 && (
          <ResponsiveContainer width='100%' height='100%' minHeight={300}>
            <BarChart
              data={props.candidateVotes}
              layout='horizontal'
              margin={{
                left: 20,
                right: 20,
                top: 40,
                bottom: 20, // Reduced from 40 to 20
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
                      fill='#111827'
                      fontSize={14}
                      fontWeight='bold'>
                      {payload.value}
                    </text>
                    <text
                      x={0}
                      y={18} // Reduced from 22 to 18
                      dy={16}
                      textAnchor='middle'
                      fill='#4B5563'
                      fontSize={12}
                      fontWeight='medium'>
                      {
                        props.candidateVotes.find(
                          (c) => c.candidate === payload.value
                        )?.party
                      }
                    </text>
                  </g>
                )}
                height={60} // Reduced from 80 to 60
              />
              <YAxis
                type='number'
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#4B5563", fontSize: 12 }}
                tickFormatter={formatYAxis}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey='votes' radius={[4, 4, 0, 0]}>
                {props.candidateVotes.map((entry) => (
                  <Cell key={`cell-${entry.candidate}`} fill={entry.color} />
                ))}
                <LabelList
                  dataKey='votes'
                  position='top'
                  fill='#111827'
                  fontSize={14}
                  fontWeight='bold'
                  formatter={(value: number) => value.toLocaleString()}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </BaseCard>
  );
};

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as CandidateData;
    return (
      <div className='bg-white bg-opacity-95 p-3 shadow-lg rounded-lg font-sans'>
        <p className='font-bold text-base mb-1' style={{ color: data.color }}>
          {data.candidate}
        </p>
        <p className='text-gray-700 text-sm mb-1'>
          Party: <span className='font-semibold'>{data.party}</span>
        </p>
        <p className='text-gray-700 text-sm'>
          Votes: <span className='font-semibold'>{data.votes}</span>
        </p>
      </div>
    );
  }

  return null;
};

const GenderCard: React.FC<BaseCardProps> = (props) => {
  const [chartDimensions, setChartDimensions] = useState({
    width: 0,
    height: 0,
  });
  const chartContainerRef = useRef<HTMLDivElement>(null);

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

    // Ensure dimensions are updated on mount
    window.addEventListener("resize", updateDimensions);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const genderData = [
    { gender: "Male", voters: 450000, color: "#3B82F6" },
    { gender: "Female", voters: 420000, color: "#EC4899" },
    { gender: "Others", voters: 30000, color: "#10B981" },
  ];

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
        Total of{" "}
        <strong>
          {genderData
            .reduce((sum, item) => sum + item.voters, 0)
            .toLocaleString()}
        </strong>{" "}
        voters
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
        fill='inherit'
        fontSize={13}
        fontWeight='bold'
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline='central'>
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className='bg-white bg-opacity-95 p-3 shadow-lg rounded-lg font-sans'>
          <p className='font-bold text-base mb-1' style={{ color: data.color }}>
            {data.gender}
          </p>
          <p className='text-gray-700 text-sm mb-1'>
            Voters:{" "}
            <span className='font-semibold'>
              {data.voters.toLocaleString()}
            </span>
          </p>
          <p className='text-gray-700 text-sm'>
            Percentage:{" "}
            <span className='font-semibold'>{data.extraInfo.Percentage}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <BaseCard {...props} footerContent={footerContent}>
      <div className='w-full h-full flex flex-col'>
        <div ref={chartContainerRef} className='w-full flex-grow min-h-[230px]'>
          {chartDimensions.width > 0 && chartDimensions.height > 0 && (
            <ResponsiveContainer width='100%' height='100%' minHeight={230}>
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={genderData.map((gd) => ({
                    ...gd,
                    label: gd.gender,
                    value: gd.voters,
                    extraInfo: {
                      Percentage: `${(
                        (gd.voters /
                          genderData.reduce(
                            (sum, item) => sum + item.voters,
                            0
                          )) *
                        100
                      ).toFixed(2)}%`,
                    },
                  }))}
                  dataKey='value'
                  nameKey='gender'
                  cx='50%'
                  cy='50%'
                  outerRadius={
                    Math.min(chartDimensions.width, chartDimensions.height) *
                    0.35
                  }
                  labelLine={false}
                  label={renderCustomizedLabel}
                  strokeWidth={0}>
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
                className='w-3 h-3 mr-1'
                style={{ backgroundColor: entry.color }}></div>
              <span className='text-sm font-medium'>{entry.gender}</span>
            </div>
          ))}
        </div>
      </div>
    </BaseCard>
  );
};

const EducationCard: React.FC<BaseCardProps> = (props) => {
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

  return (
    <BaseCard {...props} footerContent={footerContent}>
      {/* Add education-specific content here */}
    </BaseCard>
  );
};

const AgeCard: React.FC<BaseCardProps> = (props) => {
  const footerContent = (
    <div className='ml-auto text-right'>
      <div className='flex items-center justify-end space-x-2'>
        <TrendingUp className='h-4 w-4 text-green-500' />
        <span>Youth voter turnout increased by 6.5%</span>
      </div>
      <div className='mt-1'>Largest voting bloc: Ages 35-44</div>
    </div>
  );

  return (
    <BaseCard {...props} footerContent={footerContent}>
      {/* Add age-specific content here */}
    </BaseCard>
  );
};

const CitiesCard: React.FC<BaseCardProps> = (props) => {
  const footerContent = (
    <div className='ml-auto text-right'>
      <div className='flex items-center justify-end space-x-2'>
        <TrendingUp className='h-4 w-4 text-green-500' />
        <span>Urban voter participation up 5.1%</span>
      </div>
      <div className='mt-1'>Highest turnout: New York City</div>
    </div>
  );

  return (
    <BaseCard {...props} footerContent={footerContent}>
      {/* Add cities-specific content here */}
    </BaseCard>
  );
};

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
      candidate: "John Smith",
      party: "Democratic",
      votes: 186000,
      color: "#3B82F6",
    },
    {
      candidate: "Emily Johnson",
      party: "Republican",
      votes: 305000,
      color: "#EF4444",
    },
    {
      candidate: "Michael Lee",
      party: "Independent",
      votes: 237000,
      color: "#10B981",
    },
    {
      candidate: "Sarah Williams",
      party: "Green",
      votes: 173000,
      color: "#F59E0B",
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
        return <CitiesCard {...baseProps} />;
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
