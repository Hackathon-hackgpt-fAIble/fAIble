import React from 'react';
import FaibleBook from '../assets/Faible-book.png';
import KidStory from '../assets/kidstory.png';
import Wizard from '../assets/wizard.png';

const HomePage = () => {
  return (

    <div className="flex flex-col items-center justify-center h-fit">
      <img
        src={FaibleBook}
        alt = '/'
        className="mx-auto mb-2"
      />
        <h1 className="mb-5 text-2xl font-bold text-center text-white md:text-3xl lg:text-4xl">
            Storytelling AI-ssistant!
        </h1>
      <div className="flex">
        <button className="flex items-center justify-center w-48 h-48 mb-4 bg-blue-500 sm:mb-0 sm:mr-4">
          <img
            src={Wizard}
            alt="Button 1"
            className="w-32 pr-1"
          />
        </button>
        <button className="flex items-center justify-center w-48 h-48 bg-green-500">
          <img
            src={KidStory}
            alt="Button 2"
            className="w-32 pl-1"
          />
        </button>
      </div>
    </div>
  );
};

export default HomePage;