"use client";

import GameContainer from "@/components/GameContainer";
import Header from "@/components/Header";
import Username from "@/components/Username";
import { useEffect, useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("Traveller");
  const [highScore, setHighScore] = useState(0);
  const [isValidUsername, setIsValidUsername] = useState(true);

  return (
    <main className="flex flex-col items-center justify-center">
      <Header />
      {isValidUsername ? (
        <GameContainer
          username={username}
          highScore={highScore}
          setHighScore={setHighScore}
        />
      ) : (
        <Username username={username} setUsername={setUsername} setHi />
      )}
    </main>
  );
}
