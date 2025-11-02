import { createStore } from 'vuex';
import axios from 'axios';

// API base URL - otomatis detect environment
const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : '/api';

export default createStore({
    state: {
        downloadHistory: JSON.parse(localStorage.getItem('downloadHistory')) || [],
        isLoading: false,
        error: null,
        videoInfo: null
    },
    mutations: {
        SET_LOADING(state, isLoading) {
            state.isLoading = isLoading;
        },
        SET_ERROR(state, error) {
            state.error = error;
        },
        CLEAR_ERROR(state) {
            state.error = null;
        },
        SET_VIDEO_INFO(state, info) {
            state.videoInfo = info;
        },
        CLEAR_VIDEO_INFO(state) {
            state.videoInfo = null;
        },
        ADD_TO_HISTORY(state, download) {
            state.downloadHistory.unshift(download);
            if (state.downloadHistory.length > 10) {
                state.downloadHistory.pop();
            }
            localStorage.setItem('downloadHistory', JSON.stringify(state.downloadHistory));
        }
    },
    actions: {
        async getVideoInfo({ commit }, url) {
            commit('SET_LOADING', true);
            commit('CLEAR_ERROR');
            commit('CLEAR_VIDEO_INFO');

            try {
                const response = await axios.get(`${API_BASE}/download/info`, {
                    params: { url },
                    timeout: 10000
                });

                if (response.data.success) {
                    commit('SET_VIDEO_INFO', response.data.data);
                    return response.data.data;
                } else {
                    throw new Error(response.data.error);
                }
            } catch (error) {
                const errorMsg = error.response?.data?.error || error.message;
                commit('SET_ERROR', errorMsg);
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },

        async downloadVideo({ commit }, { url, quality, filename, type = 'video' }) {
            commit('SET_LOADING', true);
            commit('CLEAR_ERROR');

            try {
                const endpoint = type === 'audio' ? '/audio' : '/video';
                const response = await axios({
                    method: 'GET',
                    url: `${API_BASE}/download${endpoint}`,
                    params: {
                        url,
                        quality: type === 'audio' ? 'highest' : quality,
                        filename
                    },
                    timeout: 15000
                });

                // Jika ada redirect_url, buka di tab baru
                if (response.data.redirect_url) {
                    window.open(response.data.redirect_url, '_blank');
                } else if (response.data.data?.download_url) {
                    window.open(response.data.data.download_url, '_blank');
                }

                // Add to history
                const downloadInfo = {
                    id: Date.now(),
                    url,
                    quality: type === 'audio' ? 'MP3' : quality,
                    type,
                    filename: response.data.data?.filename || `${filename}.${type === 'audio' ? 'mp3' : 'mp4'}`,
                    timestamp: new Date().toISOString(),
                    status: 'completed',
                    message: response.data.data?.message || 'Membuka service download...'
                };

                commit('ADD_TO_HISTORY', downloadInfo);

                // Show success message
                if (typeof this._vm !== 'undefined' && this._vm.$notify) {
                    this._vm.$notify({
                        title: 'Membuka Service Download',
                        message: 'Service external dibuka di tab baru. Silakan ikuti instruksi di website tersebut.',
                        type: 'success',
                        duration: 5000
                    });
                }

                return downloadInfo;

            } catch (error) {
                const errorMsg = error.response?.data?.error || error.message;
                commit('SET_ERROR', errorMsg);

                if (typeof this._vm !== 'undefined' && this._vm.$notify) {
                    this._vm.$notify({
                        title: 'Error',
                        message: errorMsg,
                        type: 'error',
                        duration: 5000
                    });
                }

                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        }
    },
    getters: {
        downloadHistory: state => state.downloadHistory,
        isLoading: state => state.isLoading,
        error: state => state.error,
        videoInfo: state => state.videoInfo
    }
});