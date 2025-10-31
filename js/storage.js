// LocalStorage Manager for Train Run
const StorageManager = {
  // Keys for localStorage
  KEYS: {
    HIGH_SCORE: 'train_run_high_score',
    GAMES_PLAYED: 'train_run_games_played',
    LAST_PLAYED: 'train_run_last_played',
    SETTINGS: 'train_run_settings'
  },

  // Check if AuthManager is available
  isAuth() {
    return typeof AuthManager !== 'undefined';
  },

  // Initialize storage
  init() {
    // Check if this is a fresh visit or page reload of index.html
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
      const lastVisitTime = sessionStorage.getItem('lastVisitTime');
      const currentTime = new Date().getTime();
      
      // If there's no lastVisitTime or the page was reloaded, reset guest stats
      if (!lastVisitTime || document.referrer === '') {
        this.resetGuestStats();
      }
      
      // Update last visit time
      sessionStorage.setItem('lastVisitTime', currentTime);
    }
  },

  // Reset guest stats
  resetGuestStats() {
    // Only reset stats if AuthManager exists and user is not logged in
    if (this.isAuth() && !AuthManager.getCurrentUser()) {
      this.setHighScore(0);
      this.setGamesPlayed(0);
    }
  },

    // High Score
  getHighScore() {
    if (!this.isAuth()) return 0;
    const currentUser = AuthManager.getCurrentUser();
    if (!currentUser) {
      return "--";
    }
    return parseInt(localStorage.getItem(this.KEYS.HIGH_SCORE)) || 0;
  },

  setHighScore(score) {
    if (this.isAuth() && AuthManager.getCurrentUser()) {
      localStorage.setItem(this.KEYS.HIGH_SCORE, score);
    }
  },

  checkAndSetHighScore(score) {
    if (!this.isAuth() || !AuthManager.getCurrentUser()) return false;
    const currentHigh = parseInt(localStorage.getItem(this.KEYS.HIGH_SCORE)) || 0;
    if (score > currentHigh) {
      this.setHighScore(score);
      return true; // New high score!
    }
    return false;
  },

  // Games Played
  getGamesPlayed() {
    if (!this.isAuth()) return 0;
    const currentUser = AuthManager.getCurrentUser();
    if (!currentUser) {
      return "--";
    }
    return parseInt(localStorage.getItem(this.KEYS.GAMES_PLAYED)) || 0;
  },

  setGamesPlayed(count) {
    if (this.isAuth() && AuthManager.getCurrentUser()) {
      localStorage.setItem(this.KEYS.GAMES_PLAYED, count);
    }
  },

  incrementGamesPlayed() {
    if (this.isAuth() && AuthManager.getCurrentUser()) {
      const currentGames = parseInt(localStorage.getItem(this.KEYS.GAMES_PLAYED)) || 0;
      localStorage.setItem(this.KEYS.GAMES_PLAYED, currentGames + 1);
    }
  },


  // Last Played
  setLastPlayed() {
    localStorage.setItem(this.KEYS.LAST_PLAYED, new Date().toISOString());
  },

  getLastPlayed() {
    return localStorage.getItem(this.KEYS.LAST_PLAYED);
  },

  // Settings
  getSettings() {
    const settings = localStorage.getItem(this.KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : {
      soundEnabled: true,
      musicEnabled: true,
      difficulty: 'normal'
    };
  },

  saveSettings(settings) {
    localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Get all stats
  getAllStats() {
    return {
      highScore: this.getHighScore(),
      gamesPlayed: this.getGamesPlayed(),
      lastPlayed: this.getLastPlayed()
    };
  },

  // Reset all data
  resetAllData() {
    if (confirm('Are you sure you want to reset all game data? This cannot be undone.')) {
      Object.values(this.KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      this.init();
      alert('All game data has been reset!');
      location.reload();
    }
  },

  // Export data
  exportData() {
    const data = this.getAllStats();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `train_run_data_${new Date().getTime()}.json`;
    link.click();
  }
};

// Initialize storage on load
StorageManager.init();
