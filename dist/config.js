"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Register environment variables
const dotenv_1 = require("dotenv");
dotenv_1.config();
exports.cookieSecret = process.env.COOKIE_SECRET;
exports.scopes = 'user-modify-playback-state user-read-currently-playing user-read-playback-state';
exports.clientId = process.env.SPOTIFY_CLIENT_ID;
exports.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
exports.redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/auth/redirect';
//# sourceMappingURL=config.js.map