"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Spotify_1 = __importDefault(require("./Spotify"));
const Room_1 = __importDefault(require("./Room"));
const config_1 = require("../config");
// create a new spotify instance
const spotify = new Spotify_1.default(config_1.clientId, config_1.clientSecret);
const rooms = {};
const handleIO = (io) => {
    // Room middleware
    io.use((socket, next) => {
        const { query } = socket.handshake;
        const { room: roomString } = query;
        if (!roomString)
            return next(new Error('invalid room'));
        // Check that there is a match
        const matches = roomString.match(/[a-z,A-Z]{6}/g);
        if (matches && matches.length === 1) {
            const roomId = matches[0];
            // create the room
            rooms[roomId] = new Room_1.default(roomId, spotify);
            // have the socket join the room
            socket.join(roomId);
            socket.room = roomId;
            next();
        }
        else {
            next(new Error('invalid room'));
        }
    });
    io.on('connection', (socket) => {
        // Add to queue event
        socket.on('queue', async (songUri) => {
            const room = rooms[socket.room];
            await room.addToQueue(songUri);
            socket.to(socket.room).emit('queue', songUri);
        });
        socket.on('status', () => {
            const room = rooms[socket.room];
            socket.emit('status', room.status);
        });
    });
};
exports.default = handleIO;
//# sourceMappingURL=index.js.map