"use client";
import RepeatableCard from "@/components/_components/gamecard";
import { Card } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="space-y-4 text-center">
        <h1 className="text-5xl font-bold">WELCOME TO CIPHERGPT</h1>
        <h2 className="text-3xl font-bold">EMOJI TRIVIA</h2>
        <div className="flex flex-row items-center justify-center">
          <RepeatableCard
            imageSrc="/emoji_group.png"
            label="EMOJI"
            link="/emoji"
            bgColor="#bde0fe"
          />
        </div>
      </div>
    </div>
  );
}
