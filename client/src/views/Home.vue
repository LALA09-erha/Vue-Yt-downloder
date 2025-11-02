<template>
  <div class="home">
    <div class="hero-section">
      <h1 class="hero-title">Download Video YouTube dengan Mudah</h1>
      <p class="hero-subtitle">Cukup paste link YouTube dan pilih kualitas yang diinginkan</p>
    </div>
    
    <div class="download-section">
      <div class="card">
        <div class="card-header">
          <h2>Download Video</h2>
        </div>
        
        <div class="card-body">
          <form @submit.prevent="handleGetInfo" class="download-form">
            <div class="form-group">
              <label for="youtube-url" class="form-label">URL YouTube</label>
              <input
                id="youtube-url"
                v-model="youtubeUrl"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                class="form-input"
                required
              />
              <div class="form-hint">
                Contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ
              </div>
            </div>
            
            <!-- Custom Filename Input -->
            <div class="form-group" v-if="videoInfo">
              <label for="custom-filename" class="form-label">Nama File (Opsional)</label>
              <input
                id="custom-filename"
                v-model="customFilename"
                type="text"
                placeholder="nama-file-saya"
                class="form-input"
              />
              <div class="form-hint">
                File akan disimpan sebagai: {{ customFilename || defaultFilename }}.mp4
              </div>
            </div>
            
            <button
              type="submit"
              :disabled="isLoading || !youtubeUrl"
              class="info-btn"
              :class="{ 'loading': isLoading }"
            >
              <span v-if="!isLoading">Dapatkan Info Video</span>
              <span v-else class="loading-text">
                <span class="spinner"></span>
                Memproses...
              </span>
            </button>
          </form>
          
          <!-- Video Info Section -->
          <div v-if="videoInfo" class="video-info-section">
            <div class="video-details">
              <div class="video-thumbnail">
                <img :src="videoInfo.thumbnail" :alt="videoInfo.title" />
              </div>
              <div class="video-meta">
                <h3 class="video-title">{{ videoInfo.title }}</h3>
                <p class="video-author">Oleh: {{ videoInfo.author }}</p>
                <p class="video-duration">Durasi: {{ formatDuration(videoInfo.duration) }}</p>
                <p class="file-info">File: {{ customFilename || defaultFilename }}.mp4</p>
              </div>
            </div>
            
            <!-- Download Options -->
            <div class="download-options">
              <h4>Pilihan Download</h4>
              
              <!-- Download Location Info -->
              <div class="location-info">
                <p>📁 File akan didownload ke folder <strong>"Downloads"</strong> browser Anda</p>
              </div>
              
              <!-- Video Quality Options -->
              <div class="option-group">
                <h5>Video</h5>
                <div class="quality-buttons">
                  <button
                    v-for="format in availableVideoFormats"
                    :key="format.itag"
                    @click="startVideoDownload(format.quality)"
                    class="quality-btn"
                    :disabled="isLoading"
                  >
                    {{ format.quality }} ({{ format.container }})
                  </button>
                </div>
              </div>
              
              <!-- Audio Only Option -->
              <div class="option-group">
                <h5>Audio</h5>
                <button
                  @click="startAudioDownload"
                  class="audio-btn"
                  :disabled="isLoading"
                >
                  Download MP3
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </div>
      </div>
      
      <!-- Download History -->
      <div v-if="downloadHistory.length > 0" class="history-section">
        <h3>Riwayat Download Terbaru</h3>
        <div class="history-list">
          <div
            v-for="download in downloadHistory"
            :key="download.id"
            class="history-item"
          >
            <div class="history-info">
              <div class="history-title">{{ download.filename }}</div>
              <div class="history-details">
                <span class="type-badge" :class="download.type">
                  {{ download.type === 'audio' ? 'MP3' : download.quality }}
                </span>
                <span class="file-size" v-if="download.size">{{ download.size }}</span>
                <span class="history-time">{{ formatTime(download.timestamp) }}</span>
              </div>
            </div>
            <div class="history-status" :class="download.status">
              {{ download.status === 'completed' ? 'Selesai' : 'Gagal' }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- External Services Section -->
    <div class="services-section">
      <h3>💡 Alternative Download Methods</h3>
      <p class="services-description">Jika download di atas tidak bekerja, coba service alternatif berikut:</p>
      <div class="services-grid">
        <div class="service-card" v-for="service in externalServices" :key="service.name">
          <h4>{{ service.name }}</h4>
          <p>{{ service.description }}</p>
          <button 
            @click="openExternalService(service.url)"
            class="service-btn"
          >
            Buka {{ service.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Download Guide Section -->
    <div class="guide-section">
      <h2>📋 Panduan Download</h2>
      <div class="guide-steps">
        <div class="guide-step">
          <div class="step-icon">1</div>
          <div class="step-content">
            <h3>Paste URL YouTube</h3>
            <p>Salin URL dari video YouTube yang ingin didownload</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-icon">2</div>
          <div class="step-content">
            <h3>Dapatkan Info Video</h3>
            <p>Sistem akan menampilkan informasi dan kualitas yang tersedia</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-icon">3</div>
          <div class="step-content">
            <h3>Pilih Kualitas & Download</h3>
            <p>Pilih kualitas video atau audio, file akan otomatis terdownload</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-icon">4</div>
          <div class="step-content">
            <h3>Cek Folder Downloads</h3>
            <p>File akan tersimpan di folder <strong>Downloads</strong> browser Anda</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Features Section -->
    <div class="features-section">
      <h2>Fitur Unggulan</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>Cepat</h3>
          <p>Download video YouTube dengan kecepatan tinggi</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <h3>Berbagai Kualitas</h3>
          <p>Pilih kualitas video sesuai kebutuhan Anda</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎵</div>
          <h3>MP3 Support</h3>
          <p>Download audio saja dalam format MP3</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔒</div>
          <h3>Aman</h3>
          <p>Tidak menyimpan data pribadi Anda</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'HomePage',
  data() {
    return {
      youtubeUrl: '',
      customFilename: '',
      externalServices: [
        {
          name: 'YT5s',
          url: 'https://yt5s.io/',
          description: 'Download video dan audio YouTube'
        },
        {
          name: 'Y2Mate', 
          url: 'https://y2mate.com/',
          description: 'YouTube video downloader'
        },
        {
          name: 'YTMP3',
          url: 'https://ytmp3.cc/',
          description: 'YouTube to MP3 converter'
        },
        {
          name: 'SaveTube',
          url: 'https://savetube.su/',
          description: 'YouTube video downloader'
        }
      ]
    };
  },
  computed: {
    ...mapGetters(['isLoading', 'error', 'videoInfo', 'downloadHistory']),
    
    availableVideoFormats() {
      if (!this.videoInfo?.formats) return [];
      return this.videoInfo.formats.filter(format => 
        format.quality && format.quality !== 'unknown' && format.type === 'video'
      ).slice(0, 5); // Limit to 5 formats
    },
    
    defaultFilename() {
      if (!this.videoInfo) return 'video-youtube';
      return this.videoInfo.title
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);
    }
  },
  methods: {
    ...mapActions(['getVideoInfo', 'downloadVideo']),
    
    async handleGetInfo() {
      try {
        await this.getVideoInfo(this.youtubeUrl);
        this.customFilename = '';
      } catch (error) {
        console.error('Failed to get video info:', error);
        this.showNotification('Gagal mendapatkan info video: ' + error.message, 'error');
      }
    },
    
    // METHOD UNTUK DOWNLOAD VIDEO - NAMA BERBEDA
    async startVideoDownload(quality) {
      try {
        console.log('Starting video download with quality:', quality);
        const filename = this.customFilename || this.defaultFilename;
        
        await this.downloadVideo({
          url: this.youtubeUrl,
          quality: quality,
          filename: filename,
          type: 'video'
        });
        
      } catch (error) {
        console.error('Video download failed:', error);
        this.showNotification('Download video gagal: ' + error.message, 'error');
      }
    },
    
    // METHOD UNTUK DOWNLOAD AUDIO - NAMA BERBEDA
    async startAudioDownload() {
      try {
        console.log('Starting audio download');
        const filename = this.customFilename || this.defaultFilename;
        
        await this.downloadVideo({
          url: this.youtubeUrl,
          quality: 'highest',
          filename: filename,
          type: 'audio'
        });
        
      } catch (error) {
        console.error('Audio download failed:', error);
        this.showNotification('Download audio gagal: ' + error.message, 'error');
      }
    },
    
    openExternalService(url) {
      if (this.youtubeUrl) {
        const videoId = this.extractVideoId(this.youtubeUrl);
        if (videoId) {
          window.open(`${url}?q=https://www.youtube.com/watch?v=${videoId}`, '_blank');
        } else {
          window.open(url, '_blank');
        }
      } else {
        window.open(url, '_blank');
      }
    },
    
    extractVideoId(url) {
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
      }
      return null;
    },
    
    showNotification(message, type = 'info') {
      if (this.$notify) {
        this.$notify({
          message: message,
          type: type
        });
      } else {
        // Fallback to alert
        alert(message);
      }
    },
    
    formatDuration(seconds) {
      if (!seconds || seconds === '0') return 'Unknown';
      const minutes = Math.floor(parseInt(seconds) / 60);
      const remainingSeconds = parseInt(seconds) % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
    
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleString('id-ID');
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.hero-section {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
}

.hero-title {
  font-size: 2.5rem;
  color: #ff0000;
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.download-section {
  margin-bottom: 3rem;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
}

.card-header {
  background: linear-gradient(135deg, #ff0000, #cc0000);
  color: white;
  padding: 1.5rem;
}

.card-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.card-body {
  padding: 2rem;
}

.download-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #ff0000;
}

.form-input::placeholder {
  color: #999;
}

.form-hint {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
}

.file-info {
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #007bff;
}

.info-btn {
  width: 100%;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 1.5rem;
}

.info-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
}

.info-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background: #ffe6e6;
  color: #d63031;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  border-left: 4px solid #d63031;
}

.video-info-section {
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
  margin-top: 1.5rem;
}

.video-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.video-thumbnail img {
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
}

.video-meta {
  flex: 1;
}

.video-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.video-author,
.video-duration {
  color: #666;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.download-options h4 {
  margin-bottom: 1rem;
  color: #333;
}

.location-info {
  background: #e7f3ff;
  border: 1px solid #b3d9ff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.location-info p {
  margin: 0;
  color: #0066cc;
  font-size: 0.95rem;
}

.option-group {
  margin-bottom: 1.5rem;
}

.option-group h5 {
  margin-bottom: 0.75rem;
  color: #666;
  font-size: 1rem;
}

.quality-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.quality-btn,
.audio-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.quality-btn:hover:not(:disabled),
.audio-btn:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-1px);
}

.quality-btn:disabled,
.audio-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.audio-btn {
  background: #6f42c1;
}

.audio-btn:hover:not(:disabled) {
  background: #5a359c;
}

.history-section {
  margin-top: 2rem;
}

.history-section h3 {
  margin-bottom: 1rem;
  color: #333;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #28a745;
  transition: transform 0.2s;
}

.history-item:hover {
  transform: translateX(5px);
}

.history-info {
  flex: 1;
}

.history-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.history-details {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.type-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

.type-badge.video {
  background: #e9ecef;
  color: #495057;
}

.type-badge.audio {
  background: #e0d6f5;
  color: #6f42c1;
}

.file-size {
  background: #e9ecef;
  color: #495057;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.history-time {
  font-size: 0.875rem;
  color: #666;
}

.history-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.history-status.completed {
  background: #d4edda;
  color: #155724;
}

.history-status.failed {
  background: #f8d7da;
  color: #721c24;
}

/* Services Section */
.services-section {
  margin-top: 3rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.services-section h3 {
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
}

.services-description {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.service-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.service-card:hover {
  transform: translateY(-5px);
}

.service-card h4 {
  margin-bottom: 0.5rem;
  color: #333;
}

.service-card p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  min-height: 40px;
}

.service-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  font-weight: 500;
  transition: background 0.3s;
}

.service-btn:hover {
  background: #5a6268;
}

/* Guide Section */
.guide-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-top: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.guide-section h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.guide-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.guide-step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.3s;
}

.guide-step:hover {
  transform: translateY(-2px);
}

.step-icon {
  background: linear-gradient(135deg, #ff0000, #cc0000);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
  font-size: 1.2rem;
}

.step-content h3 {
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 1.1rem;
}

.step-content p {
  color: #666;
  line-height: 1.5;
  font-size: 0.9rem;
  margin: 0;
}

.features-section {
  text-align: center;
  padding: 3rem 0;
}

.features-section h2 {
  margin-bottom: 2rem;
  color: #333;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin-bottom: 1rem;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

/* Responsive design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem !important;
  }
  
  .video-details {
    flex-direction: column;
    text-align: center;
  }
  
  .video-thumbnail img {
    width: 100%;
    max-width: 200px;
    height: auto;
  }
  
  .quality-buttons {
    justify-content: center;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
  }
  
  .guide-steps {
    grid-template-columns: 1fr;
  }
  
  .guide-step {
    flex-direction: column;
    text-align: center;
  }
  
  .step-icon {
    align-self: center;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .history-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .location-info {
    text-align: center;
  }
  
  .home {
    padding: 10px;
  }
  
  .card-body {
    padding: 1rem;
  }
}

/* Animation for new downloads */
@keyframes highlight {
  0% { background-color: #d4edda; }
  100% { background-color: white; }
}

.history-item.new-download {
  animation: highlight 2s ease-in-out;
}
</style>