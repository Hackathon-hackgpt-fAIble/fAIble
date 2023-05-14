import React from 'react';
import { useNavigate } from "react-router-dom";
import FaibleBook from '../assets/Faible-book.png';
import KidStory from '../assets/kidstory.png';
import Wizard from '../assets/wizard.png';

const HomePage = () => {
  const glowEffectStyle = {
    animation: 'glow 1s infinite',
    boxShadow: '0 0 10px #ffffff',
  };
  const navigate = useNavigate();

  const handleTellStory = () => {
    navigate("/tellstory");
  };
  const handleHearStory = () => {
    navigate("/selectstory");
  };

  return (

    <div className="flex flex-col items-center justify-center h-fit">
      <img
        src={FaibleBook}
        alt = '/'
        className="w-48 h-auto mb-5 sm:w-fit sm:h-auto" 
        
      />
        <h1 className="mb-5 text-2xl font-bold text-center text-white md:text-3xl lg:text-4xl">
            Storytelling AI-ssistant!
        </h1>

      <div className="flex flex-wrap justify-center">
        <button className="flex flex-col items-center justify-center object-fill w-48 mx-3 mb-4 overflow-hidden transition-transform duration-300 transform rounded-lg h-fit hover:scale-110"
        onClick={handleTellStory}>
          <img
            src={Wizard}
            alt="Button 1"
            className="w-full mx-3 hover:shadow-lg"
            style={glowEffectStyle}
          />
          <span className="m-2 font-bold text-center text-white">Tell a Story</span>

        </button>
        
        <button className="flex flex-col items-center justify-center object-fill w-48 mx-3 overflow-hidden transition-transform duration-300 transform rounded-lg h-fit hover:scale-110"
        onClick={handleHearStory}>
          <img
            src={KidStory}
            alt="Button 2"
            className="w-full mx-3 hover:shadow-lg" 
            style={glowEffectStyle}
          />
          <span className="m-2 font-bold text-center text-white">Hear a Story</span>
        </button>
      </div>
    </div>
  );
};

export default HomePage;