import React, { useState } from "react";
import { useNavigate} from "react-router-dom";

const TellStoryCont = () => {
    const [input, setInput] = useState("");
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };
    const handleBack = () => {
        navigate("/tellstory");
    };

    const handleHome = () => {
        navigate("/");
    };

    const handleRegenerate = () => {
        // Add your regeneration logic here
    };

    const handleApprove = () => {
        // Add your approval logic here
    };

    return (
        <>
            <h1 className="top-0 flex justify-center p-3 font-serif text-6xl font-bold tracking-wider text-white cursor-pointer"
            onClick={handleHome}>fAIble</h1>
            <div className="items-center pt-10">
                <div className="max-w-screen-md mx-auto text-white rounded-lg">
                    <p className="mb-4 text-2xl font-bold">Adjust the story the way you like</p>
                    <textarea 
                        className="w-full p-2 text-black rounded-md resize-none h-[80vh] max-h-[80vh] sm:h-[70vh] sm:max-h-[70vh] lg:h-[60vh] lg:max-h-[60vh]"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Type your story adjustments here..."
                    />
                    <div className="flex justify-between mt-4">
                        <button className="px-20 py-3 text-white bg-blue-600 rounded-md hover:bg-purple-600" onClick={handleBack}>Back</button>
                        <button className="px-20 py-3 text-white bg-blue-600 rounded-md hover:bg-purple-600" onClick={handleRegenerate}>Regenerate</button>
                        <button className="px-20 py-3 text-white bg-blue-600 rounded-md hover:bg-purple-600" onClick={handleApprove}>Approve</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TellStoryCont;
