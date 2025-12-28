import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
            return callback(null, true);
        }
        return callback(null, true); // Allow all for now during development
    },
    credentials: true
}));
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

        // Fetch the image from Pollinations
        const response = await fetch(imageUrl);

        if (!response.ok) {
            throw new Error(`Failed to generate image: ${response.statusText}`);
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
