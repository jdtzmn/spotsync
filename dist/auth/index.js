"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const querystring_1 = require("querystring");
const url_1 = require("url");
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const celebrate_1 = require("celebrate");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const authorizationUrl = 'https://accounts.spotify.com/api/token';
const basicAuthorization = `Basic ${new Buffer(`${config_1.clientId}:${config_1.clientSecret}`).toString('base64')}`;
const router = express_1.default.Router();
router.use(cookie_parser_1.default(config_1.cookieSecret));
router.use(celebrate_1.errors());
/* ==================== */
/* ====== HELPERS ===== */
/* ==================== */
// Generate secure state token
const generateState = () => crypto_1.randomBytes(6).toString('hex');
// Request authorization_code and refresh_token
const requestTokens = (code) => {
    const data = querystring_1.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config_1.redirectUri
    });
    return axios_1.default.post(authorizationUrl, data, {
        headers: {
            Authorization: basicAuthorization
        }
    }).then(((response) => response.data));
};
/* ==================== */
/* ====== ROUTES ====== */
/* ==================== */
router.get('/login', (req, res) => {
    // Set origin cookie to redirect back to once the authorization flow is complete
    const { origin } = req.query;
    res.cookie('origin', origin, { httpOnly: true });
    // Generate state and set in cookie
    const state = generateState();
    res.cookie('spotify_state', state, {
        expires: new Date(Date.now() + 6e4),
        signed: true,
        httpOnly: true
    });
    // Send Spotify authorization request
    res.redirect('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        `&client_id=${config_1.clientId}` +
        `&scope=${encodeURIComponent(config_1.scopes)}` +
        `&state=${state}` +
        `&redirect_uri=${encodeURIComponent(config_1.redirectUri)}`);
});
router.get('/redirect', celebrate_1.celebrate({
    query: {
        code: celebrate_1.Joi.string().required(),
        state: celebrate_1.Joi.string().required()
    },
    cookies: {
        origin: celebrate_1.Joi.string(),
    },
    signedCookies: {
        spotify_state: celebrate_1.Joi.string().required(),
        access_token: celebrate_1.Joi.string(),
        refresh_token: celebrate_1.Joi.string()
    }
}), async (req, res) => {
    // Verify that the states match
    if (req.query.state !== req.signedCookies.spotify_state) {
        return res.status(400).send('states do not match');
    }
    res.clearCookie('spotify_state');
    // Request authorization code and refresh token
    let tokens;
    try {
        tokens = await requestTokens(req.query.code);
    }
    catch (err) {
        return res.status(400);
    }
    // Store tokens in cookies
    const { access_token, refresh_token } = tokens;
    // set access token to expire in an hour
    res.cookie('access_token', access_token, {
        expires: new Date(Date.now() + 36e5),
        signed: true,
        httpOnly: true
    });
    // set refresh token to expire in 2 weeks
    res.cookie('refresh_token', refresh_token, {
        expires: new Date(Date.now() + 12096e5),
        signed: true,
        httpOnly: true
    });
    // Redirect to origin or app url
    const responseURL = new url_1.URL(`${req.protocol}://${req.get('host')}/find`);
    if (req.cookies && req.cookies.origin) {
        responseURL.pathname = decodeURIComponent(req.cookies.origin);
        res.clearCookie('origin');
    }
    res.redirect(responseURL);
});
exports.default = router;
//# sourceMappingURL=index.js.map