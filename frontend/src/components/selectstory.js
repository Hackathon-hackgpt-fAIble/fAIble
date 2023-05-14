import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SelectStory = () => {
    const navigate = useNavigate();

    // Placeholder array for your stories
    const stories = ["Story1", "Story2", "Story3"]; 
    const [selectedStory, setSelectedStory] = useState();

    const handleHome = () => {
        navigate("/");
    };

    const handleStorySelection = (story) => {
        setSelectedStory(story);
        navigate('/hearstory', { state: { story } });
    };

    return (
        <>
            <h1 className="top-0 flex justify-center p-3 font-serif text-6xl font-bold tracking-wider text-white cursor-pointer"
            onClick={handleHome}>fAIble</h1>
            <div className="flex flex-row flex-wrap justify-center pt-10">
                {stories.map((story, index) => (
                    <button 
                        key={index} 
                        onClick={() => handleStorySelection(story)} 
                        className="flex items-center justify-center w-64 mx-2 my-2 text-4xl text-white bg-blue-600 rounded-md h-96 hover:bg-purple-600"
                    >
                        {story}
                    </button>
                ))}
            </div>
        </>
    );
}

export default SelectStory;
