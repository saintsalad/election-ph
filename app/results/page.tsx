"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, Line, LineChart, Pie, PieChart } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const Results: React.FC = () => {
  // Sample data - replace with actual election data
  const voteShareData = [
    { name: "Party A", value: 35 },
    { name: "Party B", value: 30 },
    { name: "Party C", value: 25 },
    { name: "Others", value: 10 },
  ];

  const seatDistributionData = [
    { name: "Party A", seats: 150 },
    { name: "Party B", seats: 120 },
    { name: "Party C", seats: 80 },
    { name: "Others", seats: 50 },
  ];

  const voterTurnoutData = [
    { year: "2010", turnout: 62 },
    { year: "2014", turnout: 66 },
    { year: "2018", turnout: 68 },
    { year: "2022", turnout: 71 },
  ];

  const chartConfig: ChartConfig = {
    value: {
      label: "Vote Share",
      color: "#2563eb",
    },
    seats: {
      label: "Seats",
      color: "#60a5fa",
    },
    turnout: {
      label: "Turnout",
      color: "#34d399",
    },
  };

  return (
    <div className='container mx-auto py-11 pt-20'>
      <h1 className='text-3xl font-bold mb-2 mt-5'>Election Dashboard</h1>

      <div
        className='bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6'
        role='alert'>
        <p className='font-bold'>Maintenance Notice</p>
        <p>
          This page is currently under maintenance. Some features may be
          unavailable.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Vote Share</CardTitle>
          </CardHeader>
          <CardContent className='h-[300px]'>
            <ChartContainer
              config={chartConfig}
              className='min-h-[200px] w-full'>
              <PieChart data={voteShareData}>
                <Pie
                  dataKey='value'
                  nameKey='name'
                  outerRadius={80}
                  label={(entry) => entry.name}
                  fill='var(--color-value)'
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seat Distribution</CardTitle>
          </CardHeader>
          <CardContent className='h-[300px]'>
            <ChartContainer
              config={chartConfig}
              className='min-h-[200px] w-full'>
              <BarChart data={seatDistributionData}>
                <Bar dataKey='seats' fill='var(--color-seats)' radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Voter Turnout Trend</CardTitle>
          </CardHeader>
          <CardContent className='h-[300px]'>
            <ChartContainer
              config={chartConfig}
              className='min-h-[200px] w-full'>
              <LineChart data={voterTurnoutData}>
                <Line
                  type='monotone'
                  dataKey='turnout'
                  stroke='var(--color-turnout)'
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='list-disc list-inside'>
              <li>Total Registered Voters: 10,000,000</li>
              <li>Votes Cast: 7,100,000</li>
              <li>Voter Turnout: 71%</li>
              <li>Invalid Votes: 50,000</li>
              <li>Winning Party: Party A</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Results;
