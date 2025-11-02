const express = require('express');
const cors = require('cors');
const path = require('path');
const downloadRoutes = require('./routes/download');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/download', downloadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'YouTube Downloader API is running',
        timestamp: new Date().toISOString()
    });
});

// Serve static files from client dist in production
if (process.env.NODE_ENV === 'production') {
    const clientDistPath = path.join(__dirname, '../client/dist');

    // Serve static files
    app.use(express.static(clientDistPath));

    // Serve frontend for all other routes (SPA support)
    app.get('*', (req, res) => {
        res.sendFile(path.join(clientDistPath, 'index.html'));
    });
} else {
    // Development mode - just API
    app.get('/', (req, res) => {
        res.json({
            message: 'YouTube Downloader API is running in development mode',
            endpoints: {
                health: '/api/health',
                videoInfo: '/api/download/info?url=YOUTUBE_URL',
                downloadVideo: '/api/download/video?url=YOUTUBE_URL&quality=720p',
                downloadAudio: '/api/download/audio?url=YOUTUBE_URL'
            }
        });
    });
}

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'API endpoint not found'
    });
});

const PORT = process.env.PORT || 3000;

// Export for Vercel
module.exports = app;

// Only listen if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🔗 API: http://localhost:${PORT}/api`);
    });
}