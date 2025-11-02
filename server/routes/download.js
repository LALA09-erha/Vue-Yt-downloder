const express = require('express');
const router = express.Router();
const axios = require('axios');

// Validasi URL YouTube
function isValidYouTubeUrl(url) {
    const patterns = [
        /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
        /^(https?:\/\/)?(www\.)?(youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /^(https?:\/\/)?(www\.)?(youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /^(https?:\/\/)?(www\.)?(youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
    ];

    return patterns.some(pattern => pattern.test(url));
}

// Extract video ID
function extractVideoId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

// Get video info
router.get('/info', async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'URL YouTube diperlukan'
            });
        }

        if (!isValidYouTubeUrl(url)) {
            return res.status(400).json({
                success: false,
                error: 'URL YouTube tidak valid'
            });
        }

        const videoId = extractVideoId(url);
        if (!videoId) {
            return res.status(400).json({
                success: false,
                error: 'Tidak dapat mengekstrak ID video dari URL'
            });
        }

        // Return basic info dengan external service links
        res.json({
            success: true,
            data: {
                title: 'YouTube Video - Klik download untuk membuka service external',
                duration: 'Unknown',
                thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                author: 'YouTube',
                videoId: videoId,
                formats: [
                    { quality: '360p', container: 'mp4', itag: '360p', type: 'video' },
                    { quality: '720p', container: 'mp4', itag: '720p', type: 'video' },
                    { quality: '1080p', container: 'mp4', itag: '1080p', type: 'video' },
                    { quality: 'audio', container: 'mp3', itag: 'audio', type: 'audio' }
                ]
            }
        });

    } catch (error) {
        console.error('Error getting video info:', error);
        res.status(500).json({
            success: false,
            error: 'Gagal mendapatkan informasi video'
        });
    }
});

// Download video - redirect ke external service
router.get('/video', async (req, res) => {
    try {
        const { url, quality = '720p', filename = 'video' } = req.query;

        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'URL YouTube diperlukan'
            });
        }

        const videoId = extractVideoId(url);
        if (!videoId) {
            return res.status(400).json({
                success: false,
                error: 'Tidak dapat mengekstrak ID video'
            });
        }

        const safeFilename = filename.replace(/[^a-zA-Z0-9\-\_]/g, '_');

        // Gunakan service external yang reliable
        const downloadUrl = `https://ssyoutube.com/watch?v=${videoId}`;

        res.json({
            success: true,
            data: {
                filename: `${safeFilename}.mp4`,
                download_url: downloadUrl,
                external_service: true,
                message: 'Membuka service download external...'
            },
            redirect_url: downloadUrl
        });

    } catch (error) {
        console.error('Download route error:', error);
        res.status(500).json({
            success: false,
            error: 'Terjadi kesalahan: ' + error.message
        });
    }
});

// Download audio - redirect ke external service
router.get('/audio', async (req, res) => {
    try {
        const { url, filename = 'audio' } = req.query;

        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'URL YouTube diperlukan'
            });
        }

        const videoId = extractVideoId(url);
        if (!videoId) {
            return res.status(400).json({
                success: false,
                error: 'Tidak dapat mengekstrak ID video'
            });
        }

        const safeFilename = filename.replace(/[^a-zA-Z0-9\-\_]/g, '_');

        // Gunakan service external untuk audio
        const downloadUrl = `https://ytmp3.cc/en13/?q=https://www.youtube.com/watch?v=${videoId}`;

        res.json({
            success: true,
            data: {
                filename: `${safeFilename}.mp3`,
                download_url: downloadUrl,
                external_service: true,
                message: 'Membuka service MP3 converter...'
            },
            redirect_url: downloadUrl
        });

    } catch (error) {
        console.error('Audio download route error:', error);
        res.status(500).json({
            success: false,
            error: 'Terjadi kesalahan: ' + error.message
        });
    }
});

// Direct download endpoint
router.get('/direct/:videoId', (req, res) => {
    const { videoId } = req.params;
    const downloadUrl = `https://ssyoutube.com/watch?v=${videoId}`;
    res.redirect(downloadUrl);
});

module.exports = router;