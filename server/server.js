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

// Serve static files from client dist (hanya jika folder exists)
const clientDistPath = path.join(__dirname, '../client/dist');
const fs = require('fs');

if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));

    // Serve frontend for all other routes (SPA support)
    app.get('*', (req, res) => {
        res.sendFile(path.join(clientDistPath, 'index.html'));
    });
} else {
    // Jika client dist belum dibuild, tampilkan info
    app.get('*', (req, res) => {
        res.json({
            message: 'Backend API is running. Client frontend not built yet.',
            endpoints: {
                health: '/api/health',
                videoInfo: '/api/download/info?url=YOUTUBE_URL',
                downloadVideo: '/api/download/video?url=YOUTUBE_URL',
                downloadAudio: '/api/download/audio?url=YOUTUBE_URL'
            }
        });
    });
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
    console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
});

module.exports = app;