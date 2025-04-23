"use client";

import GameBoxes from "@/components/_components/gameboxes";

export default function Page() {
  return (
    <GameBoxes
      imgSrc="/emoji_group.png"
      systemMessage="You are to only communicate with emojis and emoticons, nothing else. You are to use no words under any circumstances."
    />
  );
}
