"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import styles from "@/styles/Loader.module.css";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface LLMResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface GameBoxesProps {
  imgSrc: string;
}

const ANIMALS = [
  "Zebra",
  "Snake",
  "Elephant",
  "Salamander",
  "Peacock",
  "Cat",
  "Pigeon",
  "Alligator",
  "Frog",
  "Turtle"
];


const PLACES = [
  "Knoxville, TN",
  "New York City, NY",
  "Los Angeles, CA",
  "Nashville, TN" ,
  "Rome, Italy", 
  "Miami, FL",  
  "Detroit, MI"
];

const PEOPLE = [  
  "Donald Trump",
  "Tiger Woods",
  "Justin Bieber",
  "Jack Black",
  "Al Capone",
  "Napoleon Bonaparte",
];

const SPORTS = [  
  "Football",
  "Basketball",
  "Wrestling",
  "Lacrosse",
  "Baseball",
  "Hockey", 
  "Soccer",
  "Volleyball",
  "Golf"
];


const CARMAKERS = [
  "Subaru",
  "Ford",
  "Cadillac",
  "Mercedes Benz",
  "Ram",
  "Jeep",
  "Honda"
];

const CATEGORIES = {
  ANIMALS,
  PLACES,
  PEOPLE,
  SPORTS,
  CARMAKERS
};


function GameBoxes({ imgSrc }: GameBoxesProps) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [score, setScore] = useState(0);
  const [currentAnimal, setCurrentAnimal] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageListRef = useRef<Message[]>([]);

  const getRandomAnimal = (): string => {
    const index = Math.floor(Math.random() * ANIMALS.length);
    return ANIMALS[index]!;
  };

  const initializeGame = () => {
    const animal = getRandomAnimal();
    setCurrentAnimal(animal);
    messageListRef.current = [
      { 
        role: "system", 
        content: `You are an interface in a trivia game where the player needs to guess the correct animal. You are to only communicate with emojis and emoticons, nothing else. You are to use no words under no circumstances.` 
      },
      {
        role: "system",
        content: "With concurrent guesses from the player, you will try to provide them with different guesses as to what the animal is."
      },
      {
        role: "system",
        content: `in your responses, you are not allowed to use animal emojis or any emoji that specifically shows the answer in one emoji, and will instead need to use their attributes in order to get the message across, The current animal to describe is: ${animal}, in the first clue exclusively include emojis for the color of the animal, emojis for where it lives, and emojis for other main traits it has`
      }

    ];
    setMessages([]);
    void handleResponse();
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [messages]);

  const addMessage = (content: string, isUser: boolean) => {
    const newMessage: Message = {
      role: isUser ? "user" : "assistant",
      content: content
    };
    setMessages(prev => [...prev, newMessage]);
    messageListRef.current.push(newMessage);
  };

  const postData = async (): Promise<LLMResponse | null> => {
    try {
      const endpoint = "http://127.0.0.1:1234/v1/chat/completions";
      const data = {
        model: "gemma-2-2b-it",
        messages: messageListRef.current,
        temperature: 0.7,
        max_tokens: 200,
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

      const response = (await request.json()) as LLMResponse;
      console.log("Raw LLM response:", response);
      return response;
    } catch (error) {
      console.error("Error posting data:", error);
      return null;
    }
  };

  const handleResponse = async () => {
    try {
      const reply = await postData();

      if (!reply?.choices?.[0]?.message?.content) {
        console.error("Invalid response from LLM:", reply);
        addMessage("❌", false);
        return;
      }

      const repliedMessage = reply.choices[0].message.content;
      console.log("AI Response:", repliedMessage);
      addMessage(repliedMessage, false);
    } catch (error) {
      console.error("Error handling response:", error);
      addMessage("❌", false);
    }
  };

  const checkGuess = (guess: string) => {
    //search guess for answer
    if (guess.toLowerCase() === currentAnimal.toLowerCase()) {
      setScore(prev => prev + 1);
      addMessage("🎉 Correct! Starting new round...", false);
      setTimeout(() => {
        initializeGame();
      }, 1500);
      return true;
    }
    return false;
  };

  const processNewMessage = () => {
    const input = inputValue.trim();
    if (!input) return;

    setInputValue("");
    addMessage(input, true);
    
    if (!checkGuess(input)) {
      void handleResponse();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      processNewMessage();
    }
  };

  return (
    <div className="mx-auto flex flex-col items-center min-h-screen bg-white px-4 py-4">
      <div className="text-center w-full max-w-xl mb-4">
        <h1 className="text-4xl font-bold text-[#8A2BE2] mb-1">Emoji Trivia</h1>
        <p className="text-gray-600 text-lg">Guess the animal based on the AI response</p>
      </div>
      <div className="flex gap-6 w-full max-w-3xl">
        <Card className="h-[calc(100vh-140px)] flex-1 shadow-lg overflow-hidden flex flex-col bg-white">
          <div className="flex-1 overflow-auto p-4 space-y-2">
            {messages.map((message, index) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={index}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`
                      max-w-[70%] px-4 py-2 
                      ${isUser ? "bg-[#8A2BE2] text-white" : "bg-[#F0F0F0] text-black"}
                      rounded-[20px]
                    `}
                  >
                    <div className="whitespace-pre-wrap break-words text-lg">
                      {message.content}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-[#F8F9FB] border-t border-gray-100">
            <div className="flex gap-2 items-center">
              <Input
                ref={inputRef}
                className="h-12 text-left bg-white border-gray-200 rounded-full px-6 text-lg"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your guess here..."
              />
              <Button 
                onClick={processNewMessage}
                disabled={!inputValue.trim()}
                className="h-12 rounded-full px-6 min-w-[100px] bg-[#8A2BE2] hover:bg-[#7B1FA2] text-white font-medium text-lg"
              >
                Send
              </Button>
            </div>
          </div>
        </Card>
        <Card className="w-48 h-[calc(100vh-140px)] p-4 flex flex-col items-center bg-white shadow-lg">
          <h2 className="text-2xl font-bold text-[#8A2BE2] mb-4">Score</h2>
          <div className="text-6xl font-bold text-gray-800">{score}</div>
        </Card>
      </div>
    </div>
  );
}

export default GameBoxes;
