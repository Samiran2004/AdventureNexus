import axios from 'axios';
import chalk from 'chalk';

/**
 * Fetches a valid existing image URL from Wikipedia for a given place name.
 * Uses the MediaWiki Action API with fuzzy search.
 * @param query The name of the place to search for (e.g., "Paris", "Kyoto").
 * @returns A string URL of the image, or undefined if not found.
 */
export const fetchWikipediaImage = async (query: string): Promise<string | undefined> => {
    try {
        // Wikipedia API endpoint
        const endpoint = `https://en.wikipedia.org/w/api.php`;

        // Parameters for the query
        // generator=search: Search for a page title matching the query
        // gsrsearch: The search query string
        // gsrlimit=1: Only return the top match
        // prop=pageimages: Get image information for that match
        // format=json: Return JSON format
        // pithumbsize=1000: Request a thumbnail of 1000px width (high quality)
        const params = {
            action: 'query',
            generator: 'search',
            gsrsearch: query,
            gsrlimit: 1,
            prop: 'pageimages',
            format: 'json',
            pithumbsize: 1000,
            origin: '*' // Required for CORS
        };

        const response = await axios.get(endpoint, {
            params,
            headers: {
                'User-Agent': 'AdventureNexus/1.0 (https://adventure-nexus.com; contact@adventure-nexus.com)'
            }
        });

        const pages = response.data?.query?.pages;

        if (!pages) return undefined;

        // The API returns pages keyed by page ID. We just take the first one.
        const pageId = Object.keys(pages)[0];
        if (pageId === '-1') return undefined; // Page not found

        const page = pages[pageId];
        const imageUrl = page.thumbnail?.source;

        if (imageUrl) {
            console.log(chalk.green(`Image fetched from Wikipedia for ${query}`));
            return imageUrl;
        } else {
            console.log(chalk.yellow(`No image found on Wikipedia for ${query}`));
            return undefined;
        }

    } catch (error) {
        console.error(chalk.red(`Error fetching Wikipedia image for ${query}:`, error instanceof Error ? error.message : error));
        return undefined;
    }
};
