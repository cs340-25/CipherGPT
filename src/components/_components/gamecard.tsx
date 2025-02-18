"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface RepeatableCardProps {
  imageSrc: string;
  label: string;
  link: string;
  bgColor: string; // Parent will always pass a background color
}

const RepeatableCard: React.FC<RepeatableCardProps> = ({ imageSrc, label, link, bgColor }) => {
  const router = useRouter();

  const handlePlay = () => {
    router.push(link);
  };

  return (
    <Card className="flex flex-col items-center justify-center w-80 h-80 shadow-md">
      <Card className={`flex h-80 w-80 flex-col items-center justify-center`} style={{ backgroundColor: bgColor }}>
        <img src={imageSrc} alt={label} className="mx-auto w-40" />
        <p className="text-2xl font-bold">{label}</p>
      </Card>
      <Button className="my-4 px-12 py-8" variant="default" onClick={handlePlay}>
        <h2 className="text-2xl font-bold">PLAY</h2>
      </Button>
    </Card>
  );
};

export default RepeatableCard;