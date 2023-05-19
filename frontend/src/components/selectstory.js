import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import textToSpeech from "../textToSpeech";

const SelectStory = ({ supabase }) => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      let { data: stories, error } = await supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) console.log("error", error);
      else setStories(stories);
    };

    fetchStories();
  }, []);

  const handleHome = () => {
    navigate("/");
  };

  const handleStorySelection = async (story) => {
    try {
      const audioData = await textToSpeech(story.content);
      const audioUrl = URL.createObjectURL(new Blob([audioData], {
        type: "audio/mpeg",
      }));

      navigate("/hearstory", {
        state: {
          story,
          audioUrl,
        },
      });
    } catch (error) {
      console.error("Error generating audio:", error);
    }
  };

  const getRandomColor = () => {
    const colors = ["#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6", "#E6B333", "#3366E6", "#999966"];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  return (
    <>
      <h1
        className="top-0 flex justify-center p-3 font-serif text-6xl font-bold tracking-wider text-white cursor-pointer"
        onClick={handleHome}
      >
        fAIble
      </h1>
      <div className="flex flex-row flex-wrap justify-center pt-10">
        {stories.map((story, index) => (
          <button
            key={index}
            onClick={() => handleStorySelection(story)}
            className="flex items-center justify-center w-64 mx-2 my-2 bg-blue-600 rounded-md h-96 hover:bg-purple-600"
            style={{ backgroundColor: getRandomColor() }}
          >
            <FaPlay size={48} color="#FFFFFF" />
          </button>
        ))}
      </div>
    </>
  );
};

export default SelectStory;
