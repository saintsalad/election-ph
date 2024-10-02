"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const chartConfig: ChartConfig = {
  partyA: { label: "Party A", color: "hsl(var(--chart-1))" },
  partyB: { label: "Party B", color: "hsl(var(--chart-2))" },
  partyC: { label: "Party C", color: "hsl(var(--chart-3))" },
  partyD: { label: "Party D", color: "hsl(var(--chart-4))" },
  partyE: { label: "Party E", color: "hsl(var(--chart-5))" },
  newYork: { label: "New York", color: "hsl(var(--chart-1))" },
  losAngeles: { label: "Los Angeles", color: "hsl(var(--chart-2))" },
  chicago: { label: "Chicago", color: "hsl(var(--chart-3))" },
  houston: { label: "Houston", color: "hsl(var(--chart-4))" },
  others: { label: "Others", color: "hsl(var(--chart-5))" },
  votes: { label: "Votes", color: "hsl(var(--primary))" },
};

const Results: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState("2022");
  const [selectedParty, setSelectedParty] = useState("All");

  // Updated sample data for presidential candidates
  const candidateData = [
    { name: "John Smith", votes: 15234567, party: "PartyA" },
    { name: "Emily Johnson", votes: 14876543, party: "PartyB" },
    { name: "Michael Lee", votes: 10543210, party: "PartyC" },
    { name: "Sarah Williams", votes: 8765432, party: "PartyD" },
    { name: "David Brown", votes: 6543210, party: "PartyE" },
  ];

  const citiesData = [
    { name: "New York", value: 25 },
    { name: "Los Angeles", value: 20 },
    { name: "Chicago", value: 15 },
    { name: "Houston", value: 12 },
    { name: "Others", value: 28 },
  ];

  const genderData = [
    { name: "Male", value: 52 },
    { name: "Female", value: 47 },
    { name: "Other", value: 1 },
  ];

  const educationData = [
    { name: "High School", value: 30 },
    { name: "Bachelor's", value: 40 },
    { name: "Master's", value: 20 },
    { name: "PhD", value: 10 },
  ];

  // New data for age distribution
  const ageData = [
    { age: "18-24", value: 15 },
    { age: "25-34", value: 25 },
    { age: "35-44", value: 30 },
    { age: "45-54", value: 20 },
    { age: "55+", value: 10 },
  ];

  return (
    <div className='container mx-auto py-8 px-4'>
      <h1 className='text-4xl font-bold mb-8'>Election Dashboard</h1>

      <div className='flex flex-wrap gap-4 mb-8'>
        <Select onValueChange={setSelectedYear} defaultValue={selectedYear}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select Year' />
          </SelectTrigger>
          <SelectContent>
            {["2022", "2018", "2014"].map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedParty} defaultValue={selectedParty}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select Party' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='All'>All Parties</SelectItem>
            {["PartyA", "PartyB", "PartyC"].map((party) => (
              <SelectItem key={party} value={party}>
                {party}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        <ChartCard
          title='Presidential Candidate Votes'
          className='col-span-full'>
          <ResponsiveContainer width='100%' height={400}>
            <BarChart data={candidateData} layout='vertical'>
              <XAxis type='number' />
              <YAxis type='category' dataKey='name' width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey='votes' name='Votes'>
                {candidateData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      chartConfig[
                        `party${entry.party.slice(-1)}` as keyof ChartConfig
                      ]?.color || chartConfig.votes.color
                    }
                  />
                ))}
                <LabelList
                  dataKey='votes'
                  position='inside'
                  formatter={(value: number) => value.toLocaleString()}
                  style={{
                    fill: "white",
                    textAnchor: "start",
                    fontSize: "12px",
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title='Gender Distribution'>
          <PieChartComponent data={genderData} />
        </ChartCard>

        <ChartCard title='Top Cities'>
          <BarChartComponent data={citiesData} />
        </ChartCard>

        <ChartCard title='Educational Attainment'>
          <PieChartComponent data={educationData} />
        </ChartCard>

        <ChartCard title='Age Distribution'>
          <BarChartComponent data={ageData} dataKey='age' />
        </ChartCard>
      </div>
    </div>
  );
};

const ChartCard: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className }) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className='h-[300px]'>
      <ChartContainer config={chartConfig} className='h-full'>
        {children}
      </ChartContainer>
    </CardContent>
  </Card>
);

const PieChartComponent: React.FC<{ data: any[] }> = ({ data }) => (
  <PieChart width={400} height={300}>
    <Pie
      data={data}
      dataKey='value'
      nameKey='name'
      cx='50%'
      cy='50%'
      outerRadius={80}
      label={renderCustomizedLabel}>
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip content={<CustomTooltip />} />
    <Legend />
  </PieChart>
);

const BarChartComponent: React.FC<{ data: any[]; dataKey?: string }> = ({
  data,
  dataKey = "name",
}) => (
  <BarChart width={400} height={300} data={data} layout='vertical'>
    <XAxis type='number' />
    <YAxis type='category' dataKey={dataKey} width={50} />
    <Tooltip content={<CustomTooltip />} />
    <Legend />
    <Bar dataKey='value' name='Percentage'>
      {data.map((entry, index) => (
        <Cell
          key={`cell-${index}`}
          fill={
            chartConfig[
              entry[dataKey].toLowerCase().replace(" ", "") as keyof ChartConfig
            ]?.color || chartConfig.others.color
          }
        />
      ))}
      <LabelList
        dataKey='value'
        position='inside'
        formatter={(value: number) => `${value}%`}
        style={{ fill: "white", textAnchor: "start", fontSize: "12px" }}
      />
    </Bar>
  </BarChart>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-white p-2 border border-gray-300 rounded shadow'>
        <p className='font-bold'>{label}</p>
        <p>{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill='white'
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline='central'>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default Results;
