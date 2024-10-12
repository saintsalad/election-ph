import { VoteResult } from "@/lib/definitions";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import React from "react";

export function generateReferenceNumber() {
  // Get the current date
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2); // Get last 2 digits of the year
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
  const day = String(now.getDate()).padStart(2, "0");

  // Format the date as YYMMDD
  const formattedDate = `${year}${month}${day}`;

  // Generate a random number between 0 and 999999
  const randomNum = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");

  // Combine the formatted date and random number to form the reference number
  const referenceNumber = `${formattedDate}-${randomNum}`;

  return referenceNumber;
  // Example output: "240724-482938"
}

export function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

export function analyzeVotes(voteResult: VoteResult | undefined): {
  message: string;
  icon: React.ReactNode;
} {
  if (!voteResult || !voteResult.voteResults.length) {
    return {
      message: "No data available",
      icon: React.createElement(Minus, { className: "h-4 w-4 text-gray-500" }),
    };
  }

  const totalVotes = voteResult.totalVotes;
  const [first, second] = voteResult.voteResults
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 2);

  const margin = ((first.votes - second.votes) / totalVotes) * 100;

  if (margin > 10) {
    return {
      message: `${first.candidate}: Strong lead (+${margin.toFixed(1)}%)`,
      icon: React.createElement(TrendingUp, {
        className: "h-4 w-4 text-green-500",
      }),
    };
  } else if (margin < 2) {
    return {
      message: `Tight race: ${first.candidate} vs ${second.candidate}`,
      icon: React.createElement(Minus, {
        className: "h-4 w-4 text-yellow-500",
      }),
    };
  } else {
    return {
      message: `${first.candidate} leads by ${margin.toFixed(1)}%`,
      icon: React.createElement(TrendingUp, {
        className: "h-4 w-4 text-blue-500",
      }),
    };
  }
}
