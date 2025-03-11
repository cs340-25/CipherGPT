"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import styles from "@/styles/Loader.module.css";
import {marked} from "marked";

interface GameBoxesProps {
  imgSrc: string;
  systemMessage?: string;
}

function GameBoxes({ imgSrc, systemMessage }: GameBoxesProps) {
  const [inputValue, setInputValue] = useState("");
  const [messageList, setMessageList] = useState([
    { role: "system", content: systemMessage || "You are a helpful assistant." },
  ]);
  const [output, setOutput] = useState("");

  const handleSubmit = async () => {
    console.log("Processing message");
    const newMessage = { role: "user", content: inputValue };
    
    // Create new message list with current message
    const updatedMessageList = [...messageList, newMessage];
    
    // Clear input first
    setInputValue("");
    // Update message list
    setMessageList(updatedMessageList);

    try {
      let endpoint = "http://127.0.0.1:1234/v1/chat/completions";

      const data = {
        model: "gemma-2-2b-it",
        messages: updatedMessageList, // Use the updated message list directly
        temperature: 0.7,
        max_tokens: 100,
        stream: false,
      };

      const request = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const response = await request.json();
      
      if (!response || !response.choices || response.choices.length === 0 || !response.choices[0].message) {
        console.error("Invalid response from LLM:", response);
        return;
      }

      const repliedMessage = response.choices[0].message.content;
      console.log("AI Response:", repliedMessage);

      setOutput(marked.parse(repliedMessage));
      setMessageList([...updatedMessageList, { role: "assistant", content: repliedMessage }]);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
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
      <div id="output" dangerouslySetInnerHTML={{ __html: output }}></div>
    </div>
  );
}

export default GameBoxes;
