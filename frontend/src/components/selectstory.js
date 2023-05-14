import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import { supabase } from '../utils/supabaseClient'; // import Supabase client

const SelectStory = ({supabase}) => {
    const navigate = useNavigate();
    const [stories, setStories] = useState([]); 

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        let { data: stories, error } = await supabase
            .from('stories') // replace 'stories' with your actual table name
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3);

        if (error) console.log("error", error);
        else setStories(stories);
    };

    const handleHome = () => {
        navigate("/");
    };

    const handleStorySelection = (story) => {
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
                        {story.title} {/* replace 'title' with the actual column name for the story title in your table */}
                    </button>
                ))}
            </div>
        </>
    );
}

export default SelectStory;