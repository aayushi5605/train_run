/**
 * Authentication Module
 * Handles user session management, login state, and authentication checks
 */

class AuthManager {
    static CURRENT_USER_KEY = 'subway_current_user';
    static USERS_KEY = 'subway_users';

    /**
     * Get currently logged in user
     * @returns {Object|null} User object or null if not logged in
     */
    static getCurrentUser() {
        const userEmail = localStorage.getItem(this.CURRENT_USER_KEY);
        if (!userEmail) return null;
        
        const users = this.getAllUsers();
        return users.find(user => user.email === userEmail) || null;
    }

    /**
     * Check if a user is currently logged in
     * @returns {boolean}
     */
    static isLoggedIn() {
        return this.getCurrentUser() !== null;
    }

    /**
     * Get all registered users
     * @returns {Array} Array of user objects
     */
    static getAllUsers() {
        const usersData = localStorage.getItem(this.USERS_KEY);
        return usersData ? JSON.parse(usersData) : [];
    }

    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Object} Success status and message
     */
    static registerUser(userData) {
        try {
            const users = this.getAllUsers();
            
            // Check if email already exists
            if (users.find(user => user.email === userData.email)) {
                return { success: false, message: 'Email already registered' };
            }

            // Check if username already exists
            if (users.find(user => user.username === userData.username)) {
                return { success: false, message: 'Username already taken' };
            }

            // Create new user object
            const newUser = {
                username: userData.username,
                email: userData.email,
                phone: userData.phone || '',
                password: userData.password,
                registeredDate: new Date().toISOString(),
                highScore: 0,
                totalCoins: 0,
                gamesPlayed: 0,
                totalDistance: 0
            };

            users.push(newUser);
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
            
            return { success: true, message: 'Registration successful' };
        } catch (error) {
            return { success: false, message: 'Registration failed. Please try again.' };
        }
    }

    /**
     * Login a user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Object} Success status and message
     */
    static login(email, password) {
        try {
            const users = this.getAllUsers();
            const user = users.find(u => u.email === email);

            if (!user) {
                return { success: false, message: 'Email not found. Please register first.' };
            }

            if (user.password !== password) {
                return { success: false, message: 'Incorrect password. Please try again.' };
            }

            // Set current user
            localStorage.setItem(this.CURRENT_USER_KEY, email);
            return { success: true, message: 'Login successful', user: user };
        } catch (error) {
            return { success: false, message: 'Login failed. Please try again.' };
        }
    }

    /**
     * Logout current user
     */
    static logout() {
        localStorage.removeItem(this.CURRENT_USER_KEY);
    }

    /**
     * Update user statistics after a game
     * @param {number} score - Game score
     * @param {number} coins - Coins collected
     * @param {number} distance - Distance traveled
     */
    static updateUserStats(score, coins, distance) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return;

        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        
        if (userIndex !== -1) {
            users[userIndex].totalCoins += coins;
            users[userIndex].totalDistance += distance;
            
            if (score > users[userIndex].highScore) {
                users[userIndex].highScore = score;
            }

            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        }
    }

    /**
     * Increment games played counter when game starts
     */
    static incrementGamesPlayed() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return;

        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        
        if (userIndex !== -1) {
            users[userIndex].gamesPlayed += 1;
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        }
    }    /**
     * Get top players sorted by high score
     * @param {number} limit - Number of top players to return
     * @returns {Array} Array of top players
     */
    static getTopPlayers(limit = 10) {
        const users = this.getAllUsers();
        return users
            .sort((a, b) => b.highScore - a.highScore)
            .slice(0, limit)
            .map(user => ({
                username: user.username,
                email: user.email,
                highScore: user.highScore,
                totalCoins: user.totalCoins,
                gamesPlayed: user.gamesPlayed,
                totalDistance: user.totalDistance
            }));
    }

    /**
     * Redirect to login page if user is not logged in
     * @param {string} returnUrl - URL to return to after login
     */
    static requireLogin(returnUrl = '') {
        if (!this.isLoggedIn()) {
            const params = returnUrl ? `?return=${encodeURIComponent(returnUrl)}` : '';
            window.location.href = `login.html${params}`;
            return false;
        }
        return true;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
