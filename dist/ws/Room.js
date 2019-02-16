"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Room {
    constructor(id, api) {
        this.queue = []; // the remaining queue of the room
        this.id = id;
        this.api = api;
    }
    async addToQueue(songUri) {
        const track = await this.api.getTrack(songUri);
        const dataStoredInQueue = {
            id: track.id,
            name: track.name,
            duration_ms: track.duration_ms,
            artists: track.artists.map((artist) => ({ id: artist.id, name: artist.name }))
        };
        this.queue.push(dataStoredInQueue);
        this.timestamp = Date.now();
    }
    get status() {
        const status = {
            positionMs: 0,
            currentTrack: null,
            queue: []
        };
        if (this.queue.length > 0) {
            let difference = Date.now() - this.timestamp;
            status.positionMs = difference;
            // calculate what song is currently playing, what position it is at, and update the timestamp if necessary
            let positionMs = 0;
            let currentTrack = null;
            for (const [index, song] of this.queue.entries()) {
                if (difference < song.duration_ms) {
                    // set the values above for the status
                    positionMs = difference;
                    currentTrack = song;
                    // update the timestamp to when the current song started playing if not the first song
                    if (index > 0) {
                        this.timestamp = Date.now() - difference;
                    }
                    // return the status; do not continue
                    break;
                }
                // remove the song length from the difference
                difference -= song.duration_ms;
                // remove the song from the queue
                this.queue = this.queue.slice(1);
            }
            // set the necessary status properties
            status.positionMs = positionMs;
            status.currentTrack = currentTrack;
            status.queue = this.queue.slice(1); // remove the current track from the queue
        }
        return status;
    }
}
exports.default = Room;
//# sourceMappingURL=Room.js.map