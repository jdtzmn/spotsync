"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const next_routes_1 = __importDefault(require("next-routes"));
exports.default = new next_routes_1.default()
    .add('party', '/party/:id');
//# sourceMappingURL=routes.js.map