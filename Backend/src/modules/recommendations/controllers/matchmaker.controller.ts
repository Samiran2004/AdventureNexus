import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { groqGeneratedData } from "../../../shared/services/groq.service";
import { fetchUnsplashImage } from "../../../shared/services/unsplash.service";
import { fetchWikipediaImage } from "../../../shared/services/wikipedia.service";
import logger from "../../../shared/utils/logger";

const matchmakerController = async (req: Request, res: Response) => {
    try {
        const { vibe, budget, travelers, duration } = req.body;

        if (!vibe || !budget || !travelers || !duration) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Missing required preferences (vibe, budget, travelers, duration)"
            });
        }

        const prompt = `
You are the ultimate AdventureNexus AI Travel Matchmaker.
Based on the user's travel preferences below, recommend exactly 3 stunning travel destinations that match their vibe.

User Preferences:
- Vibe / Atmosphere: ${vibe}
- Budget Category: ${budget}
- Travel Companion Style: ${travelers}
- Target Duration: ${duration}

For each recommended destination, provide a detailed profile including:
1. "name": Destination name (e.g., "Kyoto, Japan")
2. "country": Country name
3. "continent": Continent name
4. "description": A highly engaging, customized 2-sentence description explaining why this is their absolute perfect match.
5. "price": A realistic standard budget price in USD for the entire duration (e.g., 1200)
6. "duration": e.g., "5 days"
7. "category": Beach / Adventure / Cultural / Luxury / Nature
8. "tags": Array of 3 strings (e.g. ["Zen", "Temples", "Gardens"])
9. "highlights": Array of 4 major landmarks/activities (e.g. ["Fushimi Inari Shrine", "Arashiyama Bamboo Grove", "Gion District", "Kinkaku-ji"])
10. "includes": Array of 3 items included in this vibe (e.g. ["Boutique Ryokan", "Traditional Tea Ceremony", "Rail Pass"])

Respond ONLY with a valid JSON object containing a key "recommendations" which is an array of these 3 destination objects. No other introductory or trailing text. Do not put markdown blocks like \`\`\`json \`\`\`.
`;

        const generatedData = await groqGeneratedData(prompt);
        let recommendations = [];

        try {
            const startIndex = generatedData.indexOf("{");
            const endIndex = generatedData.lastIndexOf("}");
            if (startIndex !== -1 && endIndex !== -1) {
                const cleanString = generatedData.substring(startIndex, endIndex + 1);
                const parsed = JSON.parse(cleanString);
                recommendations = parsed.recommendations || [];
            }
        } catch (parseError) {
            logger.error("Matchmaker: JSON parsing failed, parsing fallback pattern", parseError);
        }

        // Strategy: Fetch Unsplash/Wikipedia images for each recommended destination
        const enrichedRecommendations = await Promise.all(
            recommendations.map(async (dest: any, idx: number) => {
                const searchQuery = dest.name || `${vibe} destination`;
                let imageUrl = "";

                try {
                    imageUrl = await fetchWikipediaImage(searchQuery);
                    if (!imageUrl) {
                        imageUrl = await fetchUnsplashImage(searchQuery);
                    }
                } catch (imgError) {
                    logger.error(`Matchmaker image fetch failed for ${searchQuery}`, imgError);
                }

                if (!imageUrl) {
                    const fallbackPics = [
                        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop"
                    ];
                    imageUrl = fallbackPics[idx % fallbackPics.length];
                }

                return {
                    id: `ai-${Date.now()}-${idx}`,
                    name: dest.name || searchQuery,
                    country: dest.country || "Unknown Country",
                    continent: dest.continent || "Unknown Continent",
                    rating: parseFloat((4.5 + Math.random() * 0.5).toFixed(1)),
                    reviews: Math.floor(100 + Math.random() * 900),
                    price: dest.price || 1500,
                    duration: dest.duration || `${duration}`,
                    image: imageUrl,
                    category: dest.category || vibe,
                    description: dest.description || "An absolute dream travel spot matched by our AdventureNexus AI matchmaker.",
                    tags: dest.tags || [vibe, travelers],
                    trending: Math.random() > 0.4,
                    highlights: dest.highlights || ["Local Sightseeing", "Authentic Cuisines", "Scenic Photo spots"],
                    includes: dest.includes || ["Hotel stay", "Airport transfers", "Custom guide tour"],
                    gallery: [
                        imageUrl,
                        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800"
                    ]
                };
            })
        );

        return res.status(StatusCodes.OK).json({
            status: "Success",
            data: enrichedRecommendations
        });

    } catch (error: any) {
        logger.error(`Matchmaker Controller failed: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: "Matchmaker recommendation failed"
        });
    }
};

export default matchmakerController;
