"use client";
import RepeatableCard from "@/components/_components/gamecard";
import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRankingStar } from "@fortawesome/free-solid-svg-icons";
import Router from "next/router";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex h-screen flex-col">
      {" "}
      {/* Changed min-h-screen to h-screen */}
      <div className="mr-[20%] flex flex-row items-center justify-end pt-24">
        {" "}
        {/* Aligned items vertically */}
        {/* Container for the top right icon and text */}
        
      </div>
      <div className="flex flex-grow flex-col items-center justify-center py-2">
        {" "}
        {/* Added flex-grow */}
        <div className="flex flex-col items-center justify-end space-y-4">
          {/* The icon is now outside this div */}
        </div>
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
    </div>
  );
}
