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

  useEffect(() => {
    function type() {
      //currentWord = words[i];
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

        console.log(j);
        console.log("the current word length is;", currentWordVar.length);
        j++;
        if (j === words[i].length) {
          //isDeleting = true;

          isDeleteVar = true;
          setIsDeleting(true);
        }
      }
      setTimeout(type, 200);
    }
    type();
  }, []);
  return <div className="text-white text-2xl">{currentWord}</div>;
}

export default TypeWriter;
