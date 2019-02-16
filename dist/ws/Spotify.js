"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const querystring_1 = require("querystring");
class Spotify {
    constructor(clientId, clientSecret) {
        this.instance = null;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }
    get isSetup() {
        return this.instance !== null;
    }
    setup() {
        return this.requestAccessToken()
            .then((accessToken) => {
            this.instance = axios_1.default.create({
                baseURL: 'https://api.spotify.com/v1/',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
        });
    }
    getTrack(uri) {
        const request = () => this.instance.get(`/tracks/${uri}`);
        return this.wrapRequest(request);
    }
    requestAccessToken() {
        const body = { grant_type: 'client_credentials' };
        const authorization = `Basic ${Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64')}`;
        return axios_1.default.post('https://accounts.spotify.com/api/token', querystring_1.stringify(body), {
            headers: {
                Authorization: authorization
            }
        }).then((response) => response.data.access_token);
    }
    async setupIfNotAlready() {
        if (!this.isSetup)
            await this.setup();
    }
    async wrapRequest(request) {
        await this.setupIfNotAlready();
        try {
            const { data } = await request();
            return data;
        }
        catch (error) {
            const { response: { status } } = error;
            if (status === 401) {
                await this.setup();
                return this.wrapRequest(request);
            }
            else {
                throw error;
            }
        }
    }
}
exports.default = Spotify;
//# sourceMappingURL=Spotify.js.map