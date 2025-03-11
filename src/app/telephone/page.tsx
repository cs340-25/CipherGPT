"use client";

import GameBoxes from "@/components/_components/gameboxes";

export default function Page() {
  return (
    <GameBoxes 
      imgSrc="/phone-call.png"
      systemMessage="You are playing the telephone game. For each message you receive, introduce small amusing changes while keeping the core meaning similar. Make it slightly more exaggerated or altered each time, as if the message was passed through multiple people."
    />
  )}