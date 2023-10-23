import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import howitworks from "../public/howitworks.jpg";
import YouTube from "react-youtube";

const Home = () => {
  const [isPaused, setIsPaused] = useState(false);
  const videoElement = useRef(null);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
    },
  };

  useEffect(() => {
    const handleVideoState = () => {
      if (videoElement.current && videoElement.current.target && videoElement.current.target.getCurrentTime) {
        const elapsed_seconds = videoElement.current.target.getCurrentTime();

        // calculations
        const elapsed_milliseconds = Math.floor(elapsed_seconds * 1000);
        const ms = elapsed_milliseconds % 1000;
        const min = Math.floor(elapsed_milliseconds / 60000);
        const seconds = Math.floor((elapsed_milliseconds - min * 60000) / 1000);

        const formattedCurrentTime =
          min.toString().padStart(2, "0") +
          ":" +
          seconds.toString().padStart(2, "0") +
          ":" +
          ms.toString().padStart(3, "0");

        console.log(formattedCurrentTime);

        // verify video status
        const playerState = videoElement.current.target.playerInfo.playerState;
        if (playerState === 1) {
          console.log("the video is running");
        } else if (playerState === 2) {
          console.log("the video is paused");
        }
      }
    };

    const interval = setInterval(handleVideoState, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const _onReady = event => {
    videoElement.current = event;
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-2">
      <div className="App text-center">
        <h1 className="mt-6 text-lg mb-6">Hello ETHGlobal Team</h1>
        <YouTube className="border-2" videoId={"g77W6JcpifI"} opts={opts} onReady={_onReady} />
        {/* <button onClick={togglePause}>{isPaused ? "Play" : "Pause"}</button> */}
      </div>
      <div className="mt-8">
        <h1 className="text-lg text-center">How it works:</h1>
        <Image src={howitworks} alt="Description of the image" width={645} height={645} />
      </div>
    </div>
  );
};

export default Home;
