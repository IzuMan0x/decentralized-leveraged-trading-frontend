"use client";
import React from "react";
import { useState, useEffect } from "react";

const words = [
  "Hello and Weclome!!",
  "To BetterTrade.me",
  "A decentralized leveraged trading Dapp",
];
let i = 0;
let j = 0;
let currentWordVar = "";
let isDeleteVar = false;

function TypeWriter() {
  const [currentWord, setCurrentWord] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  let timer;

  function type() {
    setCurrentWord(words[i]);
    if (isDeleteVar) {
      setCurrentWord((prev) => {
        currentWordVar = prev.substring(0, j + 1);
        return prev.substring(0, j - 1);
      });
      j--;
      if (j == 0) {
        isDeleteVar = false;
        setIsDeleting(false);
        i++;
        if (i == words.length) {
          i = 0;
        }
      }
    } else {
      setCurrentWord((prev) => {
        currentWordVar = prev.substring(0, j + 1);
        return prev.substring(0, j + 1);
      });

      j++;
      if (j === words[i].length) {
        isDeleteVar = true;
        setIsDeleting(true);
      }
    }
    timer = setTimeout(type, 200);
  }

  useEffect(() => {
    type();
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 text-2xl">
      {currentWord}
    </div>
  );
}

export default TypeWriter;
