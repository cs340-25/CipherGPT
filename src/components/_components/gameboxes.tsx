"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import styles from "@/styles/Loader.module.css";
import { useRouter } from "next/navigation";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
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
  "Turtle",
];

const PEOPLE = [
  "George Washington",
  "Donald Trump",
  "Kobe Bryant",
  "Justin Bieber",
  "Taylor Swift",
  "Michelle Obama",
  "Christopher Columbus",
  "Marie Curie",
  "Helen Keller",
  "Napoleon Bonaparte",
  "Hammurabi",
  "Elvis Presley"
];

const SPORTS = [
  "Golf",
  "Wrestling",
  "Basketball",
  "Baseball",
  "Football",
  "Hockey",
  "Water Polo",
  "Soccer"
];

const CARMAKERS = [
  "Ford",
  "Subaru",
  "Jeep",
  "Mercedes Benz",
  "Ram",
  "Dodge",
  "Chrysler",
  "Cadillac",
  "Honda",
  "Volvo",
  "Kia",
  "Volkswagen"
];

const CATEGORIES: [string, string[]][] = [
  ["Carmakers" , CARMAKERS],
  ["Sports" , SPORTS],
  ["People", PEOPLE],
  ["Animals", ANIMALS]
];

function GameBoxes({ imgSrc }: GameBoxesProps) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [score, setScore] = useState(0);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentItem, setCurrentItem] = useState("");
  const [username, setUsername] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageListRef = useRef<Message[]>([]);
  const router = useRouter();

  const getRandomThing = (): [string, string] => {
    const tuple = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    if(tuple) {
      const [catname, catlist] = tuple;
      const thing = catlist[Math.floor(Math.random() * catlist.length)];
      if(thing) return [catname, thing];
      else return ["invalid", "invalid"];
    }
    else return ["invalid", "invalid"];
  };


  const initializeGame = () => {
    const toGuess: [string, string] = getRandomThing();
    setCurrentItem(toGuess[1]);
    setIncorrectGuesses(0);
    setGameOver(false);
    messageListRef.current = [
      /*
      {
        role: "system",
        content: `You are an interface in a trivia game where the player needs to guess the correct animal. You are to only communicate with emojis and emoticons, nothing else. You are to use no words under no circumstances.`,
      },
      */
      {
        role: "system",
        content: `You are playing a game where you must describe an item from the following category ${toGuess[0]} using only emojis. The current item to describe is ${toGuess[1]}. if there are any emojis directly associated with ${toGuess[1]}, your responses should NOT include those emojis. Your responses should include ONLY the emojis used to describe ${toGuess[1]}`
      },
      /*
      {
        role: "system",
        content:
          "With concurrent guesses from the player, you will try to provide them with different guesses as to what the animal is.",
      },
      {
        role: "system",
        content: `In your responses, you are not allowed to use animal emojis or any emoji that specifically shows the answer in one emoji, and will instead need to use their attributes in order to get the message across. The current animal to describe is: ${animal}. In the first clue exclusively include emojis for the color of the animal, emojis for where it lives, and emojis for other main traits it has.`,
      },*/
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
      content: content,
    };
    setMessages((prev) => [...prev, newMessage]);
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
        addMessage("❌", false);
        return;
      }

      const repliedMessage = reply.choices[0].message.content;
      addMessage(repliedMessage, false);
    } catch (error) {
      addMessage("❌", false);
    }
  };

  const checkGuess = (guess: string) => {
    if (guess.toLowerCase().includes(currentItem.toLowerCase())) {
      setScore((prev) => prev + 1);
      setIncorrectGuesses(0);
      addMessage("🎉 Correct! Starting new round...", false);
      setTimeout(() => {
        initializeGame();
      }, 1500);
      return true;
    }

    setIncorrectGuesses((prev) => {
      const newCount = prev + 1;
      if (newCount >= 3) setGameOver(true);
      return newCount;
    });

    return false;
  };

  const processNewMessage = () => {
    const input = inputValue.trim();
    if (!input || gameOver) return;

    setInputValue("");
    const newMessage : Message = {
      role : "system",
      content: `The user guessed ${input}. If that's incorrect try describing ${currentItem} with different emojis. Remember all of your responses should consist ENTIRELY of emojis and nothing else`
    }
    messageListRef.current.push(newMessage);
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

  const handleSubmitScore = () => {
    const name = prompt("Enter a username for the leaderboard:");
    if (!name) return;

    const submission = {
      username: name,
      score: score,
    };

    console.log("Score Submission:", JSON.stringify(submission, null, 2));
    // Go to home screen after short delay
    setTimeout(() => {
      router.push("/");
    }, 500);
  };

  return (
    <div className="relative mx-auto flex min-h-screen flex-col items-center bg-white px-4 py-4">
      {gameOver && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white">
          <h1 className="mb-6 text-5xl font-bold">Game Over 😢</h1>
          <p className="mb-8 text-xl">You made 3 incorrect guesses.</p>

          <Button
            className="rounded-full bg-[#8A2BE2] px-8 py-3 text-lg text-white hover:bg-[#7B1FA2]"
            onClick={initializeGame}
          >
            Restart Game
          </Button>
          <Button
            className="my-4 rounded-full px-8 py-3 text-lg text-black"
            variant="outline"
            onClick={handleSubmitScore}
          >
            Submit Score to Leaderboard
          </Button>
        </div>
      )}

      <div className="mb-4 w-full max-w-xl text-center">
        <h1 className="mb-1 text-4xl font-bold text-[#8A2BE2]">Emoji Trivia</h1>
        <p className="text-lg text-gray-600">
          Guess the animal based on the AI response
        </p>
      </div>

      <div className="flex w-full max-w-3xl gap-6">
        <Card className="flex h-[calc(100vh-140px)] flex-1 flex-col overflow-hidden bg-white shadow-lg">
          <div className="flex-1 space-y-2 overflow-auto p-4">
            {messages.map((message, index) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={index}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 ${
                      isUser
                        ? "bg-[#8A2BE2] text-white"
                        : "bg-[#F0F0F0] text-black"
                    } rounded-[20px]`}
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

          <div className="border-t border-gray-100 bg-[#F8F9FB] p-4">
            <div className="flex items-center gap-2">
              <Input
                ref={inputRef}
                className="h-12 rounded-full border-gray-200 bg-white px-6 text-left text-lg"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your guess here..."
                disabled={gameOver}
              />
              <Button
                onClick={processNewMessage}
                disabled={!inputValue.trim() || gameOver}
                className="h-12 min-w-[100px] rounded-full bg-[#8A2BE2] px-6 text-lg font-medium text-white hover:bg-[#7B1FA2]"
              >
                Guess
              </Button>
            </div>
          </div>
        </Card>

        <Card className="flex h-[calc(100vh-140px)] w-48 flex-col items-center bg-white p-4 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-[#8A2BE2]">Score</h2>
          <div className="mb-4 text-6xl font-bold text-gray-800">{score}</div>
          <h3 className="text-xl text-gray-500">Incorrect</h3>
          <div className="text-4xl text-red-500">{incorrectGuesses}</div>
        </Card>
      </div>
    </div>
  );
}

export default GameBoxes;
