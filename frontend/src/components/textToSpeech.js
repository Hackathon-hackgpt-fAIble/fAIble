import axios from 'axios';

// Define a function called textToSpeech that takes in a string called inputText as its argument.
const textToSpeech = async (inputText) => {
  // Set the API key for ElevenLabs API. 
  // Do not use directly. Use environment variables.
  const API_KEY = process.env.REACT_APP_ELEVENLABS_API_KEY;
  // Set the ID of the voice to be used.
  const VOICE_ID = 'FYbK7gdCEVUP6mN9pKYN';

  // Set options for the API request.
  const options = {
    method: 'POST',
    url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    headers: {
      accept: 'audio/mpeg', // Set the expected response type to audio/mpeg.
      'content-type': 'application/json', // Set the content type to application/json.
      'xi-api-key': `${API_KEY}`, // Set the API key in the headers.
    },
    data: {
      text: inputText, // Pass in the inputText as the text to be converted to speech.
    },
    responseType: 'arraybuffer', // Set the responseType to arraybuffer to receive binary data as response.
  };

  // Send the API request using Axios and wait for the response.
  const speechDetails = await axios.request(options);

  // Return the binary audio data received from the API response.
  return speechDetails.data;
};

// Export the textToSpeech function as the default export of this module.
export default textToSpeech;

/*const sampleText = "This is a test text.";
textToSpeech(sampleText)
  .then((audioData) => {
    console.log("Audio data:", audioData);
  })
  .catch((error) => {
    console.error("Error generating audio:", error);
  });*/
