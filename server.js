import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());

app.get('/api/images', async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const apiKey = "jdjYu3svbYXrHxzzDYafetwBcqigutMV0BMRs3QnxOrThX7b0mfSGkiT";
        const url = "https://api.pexels.com/v1/search";

        const params = {
            query: query,
            per_page: 5
        };

        const response = await axios.get(url, { 
            params,
            headers: {
                Authorization: apiKey
            }
        });

        // Map the Pexels response to mimic the data structure our frontend expects
        const mappedData = response.data.photos?.map(photo => ({
            original: photo.src.large2x || photo.src.large, 
            image: photo.src.medium 
        })) || [];

        res.json({ image_results: mappedData });
    } catch (error) {
        console.error("Proxy error:", error.message);
        res.status(500).json({ error: 'Failed to fetch images', details: error.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`CORS Proxy server running on http://localhost:${PORT}`);
});
