import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"; // Assuming your Shadcn UI table components are here


interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  createdAt: Date;
}

interface LeaderboardProps {
  data: LeaderboardEntry[];
}

const LeaderboardTable: React.FC<LeaderboardProps> = ({ data }) => {
  // Sort the data by score in descending order
  const sortedData = [...data].sort((a, b) => b.score - a.score);

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-4 text-center text-2xl font-semibold tracking-tight">
        Leaderboard
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead className="text-right">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((entry, index) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{entry.name}</TableCell>
              <TableCell className="text-right">{entry.score}</TableCell>
              <TableCell className="text-right">
                {entry.createdAt.toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;