"use client";
import RepeatableCard from "@/components/_components/gamecard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="space-y-4 text-center">
        <h1 className="text-5xl font-bold">WELCOME TO CIPHERGPT</h1>
        <h2 className="text-3xl font-bold">PASS & PLAY</h2>
        <div className="flex flex-row items-center justify-center space-x-12">
          <RepeatableCard
            imageSrc="/phone-call.png"
            label="TELEPHONE"
            link="/telephone"
            bgColor="#ffafcc"
          />

          <RepeatableCard
            imageSrc="/emoji_group.png"
            label="EMOJI"
            link="/emoji"
            bgColor="#bde0fe"
          />

        </div>
        <h2 className="text-3xl font-bold">SOLO</h2>
        <div className="flex flex-row items-center justify-center space-x-12">
          <RepeatableCard
            imageSrc="/ascii.png"
            label="ASCII"
            link="/ascii"
            bgColor="#b4aafc"
          />

          <RepeatableCard
            imageSrc="/morse-code.png"
            label="MORSE CODE"
            link="/morse-code"
            bgColor="#b6e15d"
          />

        </div>
      </div>
    </div>
  );
}
