import { NextApiRequest, NextApiResponse } from 'next';
import openai from '../../../../openai';

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000; // Starting delay time in milliseconds

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const { weatherData } = req.body;

      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0.8,
        n: 1,
        stream: false,
        messages: [
          {
            role: 'system',
            content: `
              Pretend you're a weather news presenter presenting LIVE on television. Be energetic and full of charisma.
              Introduce yourself as Birhanu and say you are LIVE from BFAM headquarters. State the city you are providing a summary for.
              Then give a summary of today's weather only. Make it easy for the viewer to understand and know what to do to prepare
              for those weather conditions, such as wear SPF if the UV is high etc. Use the uv_index data provided to give UV advice. Provide a joke
              regarding the weather. Assume the data comes from your team at the news office and not the user.
            `,
          },
          {
            role: 'user',
            content: `
              Hi there, can I get a summary of today's weather? Use the following information to get the weather data:
              ${JSON.stringify(weatherData)}
            `,
          },
        ],
      });

      const { data } = response;
      return res.status(200).json(data.choices[0].message);
    } catch (error:any) {
      if (error.response?.status === 429) {
        // Exponential backoff
        const delay = BASE_DELAY_MS * 2 ** retries;
        await new Promise((resolve) => setTimeout(resolve, delay));
        retries++;
      } else {
        console.error('Error in getWeatherSummary API:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }

  return res.status(429).json({ error: 'Too Many Requests. Please try again later.' });
}
