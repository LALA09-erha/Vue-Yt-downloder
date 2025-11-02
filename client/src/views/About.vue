<template>
  <div class="about">
    <div class="about-header">
      <h1>Tentang YouTube Downloader</h1>
      <p>Aplikasi untuk mendownload video YouTube dengan mudah dan cepat</p>
    </div>
    
    <div class="about-content">
      <div class="info-section">
        <h2>Fitur Utama</h2>
        <ul class="feature-list">
          <li>Download video YouTube dalam berbagai kualitas</li>
          <li>Antarmuka yang user-friendly</li>
          <li>Riwayat download terbaru</li>
          <li>Proses download yang cepat</li>
          <li>Mendukung semua format video YouTube</li>
        </ul>
      </div>
      
      <div class="info-section">
        <h2>Cara Menggunakan</h2>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Salin URL YouTube</h3>
              <p>Buka video YouTube yang ingin didownload dan salin URL-nya</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Paste URL</h3>
              <p>Tempel URL YouTube ke dalam form di halaman utama</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Pilih Kualitas</h3>
              <p>Pilih kualitas video yang diinginkan</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>Download</h3>
              <p>Klik tombol "Download Video" dan tunggu proses selesai</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="info-section">
        <h2>Peringatan</h2>
        <div class="warning-card">
          <p>
            <strong>Penggunaan untuk Edukasi:</strong> Aplikasi ini ditujukan untuk tujuan edukasi 
            dan pembelajaran. Pastikan Anda mematuhi kebijakan hak cipta YouTube dan hanya 
            mendownload konten yang diperbolehkan oleh pemiliknya.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutPage'
}
</script>

<style lang="scss" scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
}

.about-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
  
  h1 {
    font-size: 2.5rem;
    color: #ff0000;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.2rem;
    color: #666;
  }
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.info-section {
  h2 {
    color: #333;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
  }
}

.feature-list {
  list-style: none;
  padding: 0;
  
  li {
    padding: 0.75rem 0;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 2rem;
    
    &:before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #28a745;
      font-weight: bold;
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  
  .step-number {
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
  }
  
  .step-content {
    h3 {
      margin-bottom: 0.5rem;
      color: #333;
    }
    
    p {
      color: #666;
      line-height: 1.6;
    }
  }
}

.warning-card {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 1.5rem;
  color: #856404;
  
  p {
    margin: 0;
    line-height: 1.6;
  }
}

// Responsive design
@media (max-width: 768px) {
  .about-header h1 {
    font-size: 2rem;
  }
  
  .step {
    flex-direction: column;
    text-align: center;
    
    .step-number {
      align-self: center;
    }
  }
}
</style>