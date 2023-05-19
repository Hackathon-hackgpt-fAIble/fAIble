import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaPlay, FaStop, FaPause, FaVolumeUp, FaVolumeMute, FaForward } from "react-icons/fa";
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import textToSpeech from '../textToSpeech';
import { createClient as supabaseCreateClient } from '@supabase/supabase-js'; // Rename the conflicting declaration



const HearStory = () => {
    const navigate = useNavigate();
    const [isMuted, setIsMuted] = useState(false);
    const [audioPlayer, setAudioPlayer] = useState(null);
    const [selectedStory, setSelectedStory] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const location = useLocation();
  
    const handleHome = () => {
      navigate("/");
    };
  
    useEffect(() => {
      const selectedStory = location.state.story;
      const audioUrl = location.state.audioUrl;
      setSelectedStory(selectedStory);
  
      const audio = new Audio(audioUrl);
      setAudioPlayer(audio);
    }, []);
  
    useEffect(() => {
      // Initialize the audio player
      if (audioPlayer) {
        audioPlayer.addEventListener("ended", handleStop);
        audioPlayer.addEventListener("timeupdate", handleTimeUpdate);
        audioPlayer.play();
      }
      return () => {
        if (audioPlayer) {
          audioPlayer.removeEventListener("ended", handleStop);
          audioPlayer.removeEventListener("timeupdate", handleTimeUpdate);
          audioPlayer.pause();
        }
      };
    }, [audioPlayer]);
  
    const handleMute = () => {
      setIsMuted(!isMuted);
      if (audioPlayer) {
        audioPlayer.muted = !isMuted;
      }
    };
  
    const handlePlay = () => {
      if (audioPlayer) {
        audioPlayer.play();
      }
    };
  
    const handlePause = () => {
      if (audioPlayer) {
        audioPlayer.pause();
      }
    };
  
    const handleStop = () => {
      if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
      }
    };
  
    const handleTimeUpdate = () => {
      if (audioPlayer) {
        setCurrentTime(audioPlayer.currentTime);
      }
    };
  
    const calculateTextColor = (text) => {
      // Implement your logic to calculate the text color based on the current time
      // For example, change color at specific time intervals or based on specific conditions
      if (currentTime > 30 && currentTime < 60) {
        return "red";
      } else if (currentTime > 60 && currentTime < 90) {
        return "white";
      }
      return "black";
    };
  
    return (
      <>
        <h1
          className="top-0 flex justify-center p-3 font-serif text-6xl font-bold tracking-wider text-white cursor-pointer"
          onClick={handleHome}
        >
          fAIble
        </h1>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p
            className="text-2xl font-bold"
            style={{ color: calculateTextColor(selectedStory?.title) }}
          >
            {selectedStory?.title}
          </p>
          <div className="max-w-xl px-4 py-2 mt-8 text-white rounded-md">
          {selectedStory?.content}
        </div>
          <div className="flex justify-center mt-4">
            <button onClick={handleMute} className="p-2 text-white">
            {isMuted ? <FaVolumeMute size={32} /> : <FaVolumeUp size={32} />}
          </button>
          <button onClick={handlePlay} className="p-2 text-white">
            <FaPlay size={32} />
          </button>
          <button onClick={handlePause} className="p-2 text-white">
            <FaPause size={32} />
          </button>
          <button onClick={handleStop} className="p-2 text-white">
            <FaStop size={32} />
          </button>
        </div>
        
      </div>
    </>
  );
};

export default HearStory;

