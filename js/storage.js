// LocalStorage Manager for Train Run
const StorageManager = {
  // Keys for localStorage
  KEYS: {
    HIGH_SCORE: 'subway_surfers_high_score',
    TOTAL_COINS: 'subway_surfers_total_coins',
    GAMES_PLAYED: 'subway_surfers_games_played',
    TOTAL_DISTANCE: 'subway_surfers_total_distance',
    ACHIEVEMENTS: 'subway_surfers_achievements',
    LAST_PLAYED: 'subway_surfers_last_played',
    SETTINGS: 'subway_surfers_settings'
  },

  // Initialize storage
  init() {
    if (!this.getHighScore()) {
      this.setHighScore(0);
    }
    if (!this.getTotalCoins()) {
      this.setTotalCoins(0);
    }
    if (!this.getGamesPlayed()) {
      this.setGamesPlayed(0);
    }
    if (!this.getTotalDistance()) {
      this.setTotalDistance(0);
    }
    if (!this.getAchievements()) {
      this.setAchievements([]);
    }
  },

  // High Score
  getHighScore() {
    return parseInt(localStorage.getItem(this.KEYS.HIGH_SCORE)) || 0;
  },

  setHighScore(score) {
    localStorage.setItem(this.KEYS.HIGH_SCORE, score);
  },

  checkAndSetHighScore(score) {
    const currentHigh = this.getHighScore();
    if (score > currentHigh) {
      this.setHighScore(score);
      return true; // New high score!
    }
    return false;
  },

  // Total Coins
  getTotalCoins() {
    return parseInt(localStorage.getItem(this.KEYS.TOTAL_COINS)) || 0;
  },

  setTotalCoins(coins) {
    localStorage.setItem(this.KEYS.TOTAL_COINS, coins);
  },

  addCoins(amount) {
    const current = this.getTotalCoins();
    this.setTotalCoins(current + amount);
  },

  // Games Played
  getGamesPlayed() {
    return parseInt(localStorage.getItem(this.KEYS.GAMES_PLAYED)) || 0;
  },

  setGamesPlayed(count) {
    localStorage.setItem(this.KEYS.GAMES_PLAYED, count);
  },

  incrementGamesPlayed() {
    const current = this.getGamesPlayed();
    this.setGamesPlayed(current + 1);
  },

  // Total Distance
  getTotalDistance() {
    return parseInt(localStorage.getItem(this.KEYS.TOTAL_DISTANCE)) || 0;
  },

  setTotalDistance(distance) {
    localStorage.setItem(this.KEYS.TOTAL_DISTANCE, distance);
  },

  addDistance(meters) {
    const current = this.getTotalDistance();
    this.setTotalDistance(current + meters);
  },

  // Achievements
  getAchievements() {
    const achievements = localStorage.getItem(this.KEYS.ACHIEVEMENTS);
    return achievements ? JSON.parse(achievements) : [];
  },

  setAchievements(achievements) {
    localStorage.setItem(this.KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  },

  unlockAchievement(achievementId) {
    const achievements = this.getAchievements();
    if (!achievements.includes(achievementId)) {
      achievements.push(achievementId);
      this.setAchievements(achievements);
      return true; // Achievement unlocked!
    }
    return false;
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
      totalCoins: this.getTotalCoins(),
      gamesPlayed: this.getGamesPlayed(),
      totalDistance: this.getTotalDistance(),
      achievements: this.getAchievements(),
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
    link.download = `subway_surfers_data_${new Date().getTime()}.json`;
    link.click();
  }
};

// Initialize storage on load
StorageManager.init();
