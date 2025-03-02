"use client";

import { useState, useEffect } from "react";
import { Globe, Timer, Send, X } from "lucide-react";
import Dialog from "./ui/Dialog";

export default function GameContainer({ username, highScore, setHighScore }) {
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [funFact, setFunFact] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [inviteImage, setInviteImage] = useState("");

  const randomizeOptions = (options) => {
    const randomizedOptions = options.sort(() => Math.random() - 0.5);
    return randomizedOptions;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/random_city");
      const data = await response.json();
      setDestination(data);
      setSelectedOption("");
      setIsCorrect(null);
      setFunFact("");

      await fetchRandomOptions(data);
    } catch (error) {
      console.error("Error fetching destination:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const savedHighScore = localStorage.getItem("globetrotterHighScore");
    if (savedHighScore) {
      setHighScore(Number.parseInt(savedHighScore));
    }

    // const savedUsername = localStorage.getItem("globetrotterUsername");
    // if (savedUsername) {
    //   setUsername(savedUsername);
    // }
  }, []);

  const fetchRandomOptions = async (city) => {
    setLoading(true);
    try {
      const response = await fetch("/api/city_choices", {
        method: "POST",
        headers: {
          "Content-Type": "application-json",
        },
        body: JSON.stringify({ id: city.id }),
      });
      const data = await response.json();
      console.log("fdata", data);

      setOptions(randomizeOptions([...data, city.city]));
    } catch (error) {
      console.error("Error fetching options:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    console.log("selectedOption", selectedOption);

    const correct = selectedOption === destination.city;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }

    const randomFact =
      destination.fun_facts[
        Math.floor(Math.random() * destination.fun_facts.length)
      ];
    setFunFact(randomFact);

    const currentTotal = score.correct + (correct ? 1 : 0);
    if (currentTotal > highScore) {
      setHighScore(currentTotal);
      localStorage.setItem("globetrotterHighScore", currentTotal.toString());
    }
  };

  const handleNext = () => {
    fetchData();
  };

  const InviteAFriend = () => {
    console.log("invite");
    setShowPopup(true);
  };

  useEffect(() => {
    const fetchImage = async () => {
      const image = await generateInviteImage();
      if (image) {
        setInviteImage(image);
      }
    };

    if (showPopup) {
      fetchImage();
    }
  }, [showPopup]);

  const generateInviteImage = async () => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=travel&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const data = await response.json();
      const imageUrl = `${data.urls.raw}&w=600&h=400&fit=crop`;
      return imageUrl;
    } catch (error) {
      console.error("Error fetching Unsplash image:", error);
      return;
    }
  };

  const shareOnWhatsApp = () => {
    const inviteImg = inviteImage;
    const inviteLink = `${window.location.origin}/game?inviter=${username}`;
    const message = `🌍 ${username} challenges you to a globe-trotting adventure!\nHigh Score: ${score.correct}\nPlay now: ${inviteLink}`;

    const finalMessage = inviteImg
      ? ` Preview: ${inviteImg}\n ${message}\n`
      : message;

    window.open(`https://wa.me/?text=${encodeURIComponent(finalMessage)}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Globe className="animate-spin h-12 w-12 text-blue-500" />
        <span className="ml-3 text-xl">Loading your adventure...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-secondary rounded-lg shadow-lg overflow-hidden">
      <div className="bg-secondary border-b px-4 py-3 flex justify-between items-center">
        <div>
          <span className="text-green-600 font-bold">✓ {score.correct}</span> |
          <span className="text-red-600 font-bold"> ✗ {score.incorrect}</span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <Timer className="w-5 h-5" />
          <p>12:20</p>
        </div>

        <div>
          <span className="font-bold">High Score:</span> {highScore}
        </div>

        <button
          onClick={InviteAFriend}
          type="button"
          className="bg-yellow-400 py-1 px-2 rounded-lg cursor-pointer flex gap-1 justify-center items-center hover:bg-yellow-500"
        >
          Challenge
          <Send className="w-5 h-5" />
        </button>
      </div>

      {showPopup && inviteImage && (
        <Dialog open={showPopup} onOpenChange={setShowPopup}>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Challenge a Friend</h2>
                <button onClick={() => setShowPopup(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p>Invite your friends to beat your score!</p>
              {inviteImage && (
                <img
                  src={inviteImage}
                  alt="Invite Preview"
                  className="w-full rounded-lg my-4"
                />
              )}
              <button
                onClick={shareOnWhatsApp}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Share on WhatsApp
              </button>
            </div>
          </div>
        </Dialog>
      )}

      <div className="px-6 py-4 flex flex-col justify-center items-center">
        <div className="mb-4 w-full">
          <h2 className="text-xl font-bold mb-2">Where am I?</h2>
          <div className="bg-gray-400 p-4 rounded-lg">
            {destination.clues.map((clue, index) => (
              <div key={index} className="mb-2">
                <span className="font-bold">Clue {index + 1}: </span>
                <span className="">{clue}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4 w-full">
          <h3 className="text-xl font-bold mb-2">Select your answer:</h3>
          <div className="grid grid-cols-2 gap-3">
            {options.map((option, index) => (
              <button
                key={index}
                className={`p-2 rounded-lg border-2 transition-all ${
                  selectedOption === option
                    ? "border-accent bg-blue-50"
                    : "border-background hover:border-accent"
                }`}
                onClick={() => {
                  setSelectedOption(option);
                }}
                disabled={isCorrect !== null}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {isCorrect === null ? (
          <button
            className="px-8 bg-accent text-white py-2 rounded-lg font-bold transition-colors disabled:bg-gray-400"
            onClick={handleSubmit}
            disabled={!selectedOption}
          >
            Submit
          </button>
        ) : (
          <div className="w-full flex flex-col items-center">
            <div
              className={`w-full px-4 py-3 rounded-lg mb-4 ${
                isCorrect
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <div className="text-lg font-bold mb-2">
                {isCorrect
                  ? "🎉 Correct! Well done!"
                  : "😢 Oops! That's not right."}
              </div>
              <div>
                <span className="font-bold italic">Fun Fact: </span>
                <span className="text-sm italic">{funFact}</span>
              </div>
            </div>
            <button
              className="px-8 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition-colors"
              onClick={handleNext}
            >
              Next Destination
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
