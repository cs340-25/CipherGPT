import LeaderboardTable from "@/components/_components/leaderboard-table";
import {api} from "@/trpc/react"



export default function LeaderboardPage() {
  const {data} = api.leaderboard.getLeaderboard.useQuery(undefined, {
    enabled: true,
  });
  return (
    <div>
      Leaderboard
      <LeaderboardTable data={data} />
    </div>
  );
}
