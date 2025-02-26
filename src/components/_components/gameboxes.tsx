"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import styles from "@/styles/Loader.module.css";

interface GameBoxesProps {
  imgSrc: string;
}

function GameBoxes({ imgSrc }: GameBoxesProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    console.log("Submitted:", inputValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="mx-auto flex flex-col items-center justify-center">
      <img src={imgSrc} alt="Custom" className="w-40" />
      <Card className="mt-4 h-80 w-[90%] shadow-md">
        <div className="flex justify-center items-center h-full">
          <div className={styles["lds-ripple"]}>
            <div></div>
            <div></div>
          </div>
        </div>
      </Card>
      <Input
        className="h-15 mt-4 w-[90%] text-center font-semibold shadow-md"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button className="mt-6" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
}
export default GameBoxes;
