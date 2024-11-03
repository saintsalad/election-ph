"use client";

import { Breadcrumbs } from "@/components/custom/breadcrumbs";
import { Heading } from "@/components/custom/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, Vote, CheckCircle2, AlertTriangle } from "lucide-react";
import { formatCount } from "@/lib/utils";

// Chart configuration
const chartConfig = {
  voters: {
    label: "Registered Voters",
    color: "hsl(var(--chart-1))",
  },
  turnout: {
    label: "Voter Turnout",
    color: "hsl(var(--chart-2))",
  },
} as const;

// Sample data
const monthlyData = [
  { name: "Jan", voters: 32000, turnout: 0 },
  { name: "Feb", voters: 34500, turnout: 0 },
  { name: "Mar", voters: 38000, turnout: 0 },
  { name: "Apr", voters: 40000, turnout: 0 },
  { name: "May", voters: 42318, turnout: 88.5 },
];

const regionData = [
  { name: "NCR", value: 89 },
  { name: "Region III", value: 87 },
  { name: "Region IV-A", value: 85 },
  { name: "Region V", value: 83 },
  { name: "Region VII", value: 86 },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const breadcrumbItems = [{ title: "Dashboard", link: "/master" }];

// Add custom styles for charts
const chartStyles = {
  fontSize: "0.75rem", // 12px
  tickFontSize: "0.675rem", // ~11px
};

export default function Dashboard() {
  return (
    <div className='flex flex-col gap-5 px-8 pb-8'>
      <Heading
        title='Election Dashboard'
        description='Real-time election monitoring & analytics 🗳️'
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-min'>
        {/* Stats Cards Row */}
        <Card className='lg:col-span-1'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Registered Voters
            </CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatCount(4231891)}</div>
            <p className='text-xs text-muted-foreground'>
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card className='lg:col-span-1'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Voter Turnout</CardTitle>
            <Vote className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>88.5%</div>
            <p className='text-xs text-muted-foreground'>
              +5.2% from last election
            </p>
          </CardContent>
        </Card>

        <Card className='lg:col-span-1'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Verified Precincts
            </CardTitle>
            <CheckCircle2 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatCount(42350)}</div>
            <p className='text-xs text-muted-foreground'>
              98% of total precincts
            </p>
          </CardContent>
        </Card>

        <Card className='lg:col-span-1'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Reported Issues
            </CardTitle>
            <AlertTriangle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatCount(234)}</div>
            <p className='text-xs text-muted-foreground'>
              -12% from last election
            </p>
          </CardContent>
        </Card>

        {/* Charts with updated font sizes */}
        <Card className='lg:col-span-2 row-span-2'>
          <CardHeader>
            <CardTitle className='text-sm'>Voter Registration Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={350}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='name'
                  style={{ fontSize: chartStyles.tickFontSize }}
                  tick={{ fontSize: chartStyles.tickFontSize }}
                />
                <YAxis
                  style={{ fontSize: chartStyles.tickFontSize }}
                  tick={{ fontSize: chartStyles.tickFontSize }}
                />
                <Tooltip
                  contentStyle={{ fontSize: chartStyles.fontSize }}
                  labelStyle={{ fontSize: chartStyles.fontSize }}
                />
                <Line
                  type='monotone'
                  dataKey='voters'
                  stroke='hsl(var(--chart-1))'
                  strokeWidth={2}
                  name='Registered Voters'
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className='lg:col-span-2 row-span-2'>
          <CardHeader>
            <CardTitle className='text-sm'>
              Regional Turnout Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={350}>
              <PieChart>
                <Pie
                  data={regionData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  outerRadius={130}
                  fill='hsl(var(--chart-1))'
                  dataKey='value'
                  label={({ name, value }) => `${name}: ${value}%`}>
                  {regionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ fontSize: chartStyles.fontSize }}
                  labelStyle={{ fontSize: chartStyles.fontSize }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
