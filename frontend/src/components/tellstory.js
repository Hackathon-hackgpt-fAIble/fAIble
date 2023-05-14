import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

const TellStory = () => {
    const navigate = useNavigate();
    const handleHome = () => {
        navigate("/");
    };
    const handleCont = () => {
        navigate("/tellstorycont");
    };
    const [input, setInput] = useState("");
    const [otherLessonInput, setOtherLessonInput] = useState("");
    const [selectedLessons, setSelectedLessons] = useState({
        loyalty: false,
        integrity: false,
        acceptance: false,
        courage: false,
        bayesianStatistics: false,
        other: false,
    });

    const [otherBookStyleInput, setOtherBookStyleInput] = useState("");
    const [selectedBookStyle, setSelectedBookStyle] = useState({
        animals: false,
        fairyTale: false,
        other: false,
    });

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleLessonChange = (event) => {
        setSelectedLessons({ ...selectedLessons, [event.target.name]: event.target.checked });
    };

    const handleOtherLessonInputChange = (event) => {
        setOtherLessonInput(event.target.value);
    };

    const handleBookStyleChange = (event) => {
        setSelectedBookStyle({ ...selectedBookStyle, [event.target.name]: event.target.checked });
    };

    const handleOtherBookStyleInputChange = (event) => {
        setOtherBookStyleInput(event.target.value);
    };
    
      return (
        <>
        <h1 className="top-0 flex justify-center p-3 font-serif text-6xl font-bold tracking-wider text-white cursor-pointer"
        onClick={handleHome}>fAIble</h1>
        <div className="flex flex-col items-center pt10">
            <div className="text-white rounded-lg ">
            <p className="mb-4 text-2xl font-bold">What do you want a story about?</p>
                    <textarea 
                        className="w-full h-56 p-2 text-black rounded-md resize-none"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Type your story's theme here..."
                    />
                    <p className="mt-10 text-2xl font-bold">What Lesson do you want this teach? </p>
                    <div className="flex flex-wrap items-center justify-start">
                        {['loyalty', 'integrity', 'acceptance', 'courage', 'bayesian statistics'].map((lesson, index) => (
                            <label key={index} className="flex items-center mt-2 mr-4 text-2xl">
                                <input 
                                    type="checkbox" 
                                    className="mr-2 bg-purple-300"
                                    
                                    name={lesson}
                                    checked={selectedLessons[lesson]}
                                    onChange={handleLessonChange}
                                />
                                {lesson}
                            </label>
                        ))}
                        <label className="flex items-center mt-2 mr-4 text-2xl">
                            <input 
                                type="checkbox" 
                                className="mr-2"
                                name="other"
                                checked={selectedLessons.other}
                                onChange={handleLessonChange}
                            />
                            Other
                        </label>
                        {selectedLessons.other &&
                            <input 
                                type="text" 
                                className="w-full h-10 p-2 mt-2 text-xl text-black rounded-md" 
                                value={otherLessonInput} 
                                onChange={handleOtherLessonInputChange} 
                                placeholder="Type your own lesson here..."
                            />
                        }
                    </div>
                    <p className="mt-10 text-2xl font-bold">Select Book Style</p>
                    <div className="flex flex-wrap items-center justify-start">
                    {['animals', 'fairy tale'].map((style, index) => (
                            <label key={index} className="flex items-center mt-2 mr-4 text-2xl">
                                <input 
                                    type="checkbox" 
                                    className="mr-2"
                                    name={style}
                                    checked={selectedBookStyle[style]}
                                    onChange={handleBookStyleChange}
                                />
                                {style}
                            </label>
                        ))}
                        <label className="flex items-center mt-2 mr-4 text-2xl">
                            <input 
                                type="checkbox" 
                                className="mr-2"
                                name="other"
                                checked={selectedBookStyle.other}
                                onChange={handleBookStyleChange}
                            />
                            Other
                        </label>
                        {selectedBookStyle.other &&
                            <input 
                                type="text" 
                                className="w-full h-10 p-2 mt-2 text-xl text-black rounded-md" 
                                value={otherBookStyleInput} 
                                onChange={handleOtherBookStyleInputChange} 
                                placeholder="Type your own book style here..."
                            />
                        }
                    </div>
                    <button className="w-full py-2 mt-4 text-2xl text-white bg-blue-600 rounded-md hover:bg-purple-600" 
                    onClick={handleCont}>Continue</button>
                </div>
            </div>
        </>
      );
    }
    
    export default TellStory;