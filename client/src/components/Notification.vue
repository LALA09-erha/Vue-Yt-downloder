<template>
  <div v-if="visible" class="notification" :class="type">
    <div class="notification-content">
      <strong>{{ title }}</strong>
      <p>{{ text }}</p>
    </div>
    <button @click="close" class="close-btn">&times;</button>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  props: {
    title: String,
    text: String,
    type: {
      type: String,
      default: 'info',
      validator: value => ['info', 'success', 'warning', 'error'].includes(value)
    },
    duration: {
      type: Number,
      default: 5000
    }
  },
  data() {
    return {
      visible: false
    }
  },
  mounted() {
    this.visible = true
    if (this.duration > 0) {
      setTimeout(() => {
        this.close()
      }, this.duration)
    }
  },
  methods: {
    close() {
      this.visible = false
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  min-width: 300px;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  
  &.success {
    border-left: 4px solid #28a745;
  }
  
  &.error {
    border-left: 4px solid #dc3545;
  }
  
  &.warning {
    border-left: 4px solid #ffc107;
  }
  
  &.info {
    border-left: 4px solid #17a2b8;
  }
}

.notification-content {
  flex: 1;
  
  strong {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
  }
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #333;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

// Responsive design
@media (max-width: 768px) {
  .notification {
    left: 20px;
    right: 20px;
    min-width: auto;
  }
}
</style>