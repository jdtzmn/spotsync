"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const next_1 = __importDefault(require("next"));
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next_1.default({ dev });
const handle = nextApp.getRequestHandler();
nextApp.prepare()
    .then(() => {
    const app = express_1.default();
    const server = new http_1.Server(app);
    // const io = require('socket.io')(server)
    /* ==================== */
    /* ====== ROUTES ====== */
    /* ==================== */
    app.get('*', (req, res) => {
        return handle(req, res);
    });
    server.listen(port, (err) => {
        if (err)
            throw err;
        // tslint:disable no-console
        console.log(`> Ready on http://localhost:${port}`);
        // tslint:enable no-console
    });
});
//# sourceMappingURL=index.js.map