import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaPlay, FaStop, FaPause, FaVolumeUp, FaVolumeMute, FaForward } from "react-icons/fa";

const HearStory = () => {
    const navigate = useNavigate();
    const [isMuted, setIsMuted] = useState(false);

    // Placeholder array for your sound clips
    const soundClips = ["clip1", "clip2", "clip3"]; 
    const [currentClipIndex, setCurrentClipIndex] = useState(0);

    // Get the selected story from the previous page
    const location = useLocation();
    const selectedStory = location.state.story;

    const handleHome = () => {
        navigate("/");
    };

    const handleMute = () => {
        setIsMuted(!isMuted);
    };

    const handlePlay = () => {
        // Add your play logic here
    };

    const handlePause = () => {
        // Add your pause logic here
    };

    const handleStop = () => {
        // Add your stop logic here
    };

    const handleNext = () => {
        setCurrentClipIndex((currentClipIndex + 1) % soundClips.length);
    };

    return (
        <>
            <h1 className="top-0 flex justify-center p-3 font-serif text-6xl font-bold tracking-wider text-white cursor-pointer"
            onClick={handleHome}>fAIble</h1>
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-2xl font-bold text-white">{soundClips[currentClipIndex]}</p>
                <div className="flex justify-center mt-4">
                    <button onClick={handleMute} className="p-2 text-white">
                        {isMuted ? <FaVolumeMute size={32} /> : <FaVolumeUp size={32} />}
                    </button>
                    <button onClick={handlePlay} className="p-2 text-white"><FaPlay size={32} /></button>
                    <button onClick={handlePause} className="p-2 text-white"><FaPause size={32} /></button>
                    <button onClick={handleStop} className="p-2 text-white"><FaStop size={32} /></button>
                    <button onClick={handleNext} className="p-2 text-white"><FaForward size={32} /></button>
                </div>
            </div>
        </>
    );
}

export default HearStory;
