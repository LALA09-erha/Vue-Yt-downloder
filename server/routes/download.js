const express = require('express');
const router = express.Router();
const ytdl = require('@distube/ytdl-core');
const youtubedl = require('youtube-dl-exec');
const fs = require('fs');
const path = require('path');

// Validasi URL YouTube
function isValidYouTubeUrl(url) {
    return ytdl.validateURL(url);
}

// Dapatkan informasi video
router.get('/info', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url || !isValidYouTubeUrl(url)) {
            return res.status(400).json({ success: false, error: 'URL YouTube tidak valid' });
        }

        const info = await ytdl.getInfo(url);

        const formats = info.formats.map(f => ({
            quality: f.qualityLabel || f.audioBitrate + 'kbps',
            mimeType: f.mimeType,
            container: f.container,
            type: f.hasVideo ? (f.hasAudio ? 'video+audio' : 'video') : 'audio',
            url: f.url
        }));

        res.json({
            success: true,
            data: {
                title: info.videoDetails.title,
                author: info.videoDetails.author.name,
                duration: info.videoDetails.lengthSeconds,
                thumbnail: info.videoDetails.thumbnails.pop().url,
                formats
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Gagal mendapatkan info video' });
    }
});

router.get('/video', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send('Missing URL');

    try {
        const info = await youtubedl(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true
        });

        res.json({
            title: info.title,
            formats: info.formats.map(f => ({
                quality: f.format_note,
                ext: f.ext,
                url: f.url
            }))
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Download audio (MP3)
router.get('/audio', async (req, res) => {
    try {
        const { url, filename = 'audio' } = req.query;

        if (!url || !isValidYouTubeUrl(url)) {
            return res.status(400).json({ success: false, error: 'URL tidak valid' });
        }

        const safeFilename = filename.replace(/[^a-zA-Z0-9-_]/g, '_');
        const outputFile = `${safeFilename}.mp3`;

        res.header('Content-Disposition', `attachment; filename="${outputFile}"`);

        // Hanya audio
        ytdl(url, { filter: 'audioonly', quality: 'highestaudio' }).pipe(res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Gagal mendownload audio' });
    }
});

module.exports = router;
