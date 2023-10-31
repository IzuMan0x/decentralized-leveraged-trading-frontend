"use client";
import React from "react";
import NavBar from "../../components/NavBar";

//This page is not active right now
function Contact({ Component, pageProps }) {
  return (
    <div className=" bg-black h-full w-full overflow-hidden overflow-y-hidden">
      <div className="w-screen h-screen">
        <div>
          <NavBar />
        </div>
      </div>
    </div>
  );
}

export default Contact;
