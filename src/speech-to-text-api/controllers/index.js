const axios = require("axios");

exports.transcriptAudio = async (audioData) => {
  try {
    const apiKey = process.env.NETX_PUBLIC_IBM_API_URL;
    const url = process.env.IBM_API_URL;

    const response = await axios.post(url, audioData, {
      headers: {
        Authorization: `Basic ${apiKey}`,
      },
    });

    const transcript = response.data.results[0].alternatives[0].transcript;

    return transcript;
  } catch (error) {
    console.error(error);

    return error;
  }
};
