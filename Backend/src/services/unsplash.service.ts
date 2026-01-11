import axios from 'axios';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { config } from '../config/config';

dotenv.config();

/**
 * Fetches a high-quality existing image URL from Unsplash for a given place name.
 * Uses the Unsplash Search API.
 * @param query The name of the place to search for (e.g., "Paris", "Kyoto").
 * @returns A string URL of the image, or undefined if not found.
 */
export const fetchUnsplashImage = async (query: string): Promise<string | undefined> => {
    try {
        const accessKey = config.UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_ACCESS_KEY;

        if (!accessKey) {
            console.error(chalk.red("Unsplash API Key is missing! Please set UNSPLASH_ACCESS_KEY in .env"));
            return undefined;
        }

        const endpoint = `https://api.unsplash.com/search/photos`;

        const params = {
            query: query,
            per_page: 1,
            orientation: 'landscape',
            client_id: accessKey
        };

        const response = await axios.get(endpoint, { params });

        const results = response.data?.results;

        if (!results || results.length === 0) {
            console.log(chalk.yellow(`No image found on Unsplash for ${query}`));
            return undefined;
        }

        const imageUrl = results[0].urls?.regular;

        if (imageUrl) {
            console.log(chalk.green(`Image fetched from Unsplash for ${query}`));
            return imageUrl;
        } else {
            return undefined;
        }

    } catch (error) {
        console.error(chalk.red(`Error fetching Unsplash image for ${query}:`, error instanceof Error ? error.message : error));
        return undefined;
    }
};
