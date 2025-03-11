"use client";

import GameBoxes from "@/components/_components/gameboxes";

export default function Page() {
  return (
    <GameBoxes 
      imgSrc="/ascii.png"
      systemMessage="You are to only communicate using ASCII art. Every response should be a creative ASCII art representation. Do not use regular text in responses."
    />
  )}