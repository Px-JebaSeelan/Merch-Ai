import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// Allow all origins to prevent CORS issues
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Merch AI Backend is running' });
});

// Generate image endpoint using Pollination's free Flux API
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || prompt.trim() === '') {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Enhance prompt for T-shirt design
        const enhancedPrompt = `${prompt}, T-shirt design, vector art style, clean white background, centered composition, isolated artwork, high quality, printable design, no text unless specified`;

        console.log('Generating design with prompt:', enhancedPrompt);

        // Use Pollination's free Flux API (no API key required)
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=512&height=512&model=flux&seed=${Date.now()}&nologo=true`;

        // Function to fetch with retry logic and backoff
        const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
            for (let i = 0; i < retries; i++) {
                try {
                    const response = await fetch(url, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                        }
                    });

                    if (response.ok) return response;

                    // If not ok, throw error to trigger retry (unless it's a 4xx error which likely won't change)
                    const text = await response.text();
                    const status = response.status;

                    // Don't retry client errors (except 429)
                    if (status >= 400 && status < 500 && status !== 429) {
                        throw new Error(`Client Error: ${status} ${response.statusText} - ${text}`);
                    }

                    console.log(`Attempt ${i + 1} failed with status ${status}. Retrying in ${delay}ms...`);
                    throw new Error(`Status ${status}: ${text}`);
                } catch (err) {
                    if (i === retries - 1) throw err; // Throw on last attempt

                    // Wait before retrying (exponential backoff)
                    await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
                }
            }
        };

        // Fetch the image from Pollinations with retry
        const response = await fetchWithRetry(imageUrl);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to generate image: ${response.status} ${response.statusText} - ${errorText}`);
        }

        // Convert to base64
        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const dataUrl = `data:image/jpeg;base64,${base64}`;

        console.log('Image generated successfully');

        res.json({
            success: true,
            image: dataUrl,
            prompt: enhancedPrompt
        });

    } catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({
            error: 'Failed to generate image',
            details: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Merch AI Backend running on http://localhost:${PORT}`);
});
