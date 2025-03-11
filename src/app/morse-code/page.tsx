"use client";

import GameBoxes from "@/components/_components/gameboxes";

export default function Page() {
  return (
    <GameBoxes 
      imgSrc="/morse-code.png"
      systemMessage="You are to only communicate in Morse code. Convert all responses to proper Morse code format using dots (.) and dashes (-). Do not use regular text."
    />
  )}