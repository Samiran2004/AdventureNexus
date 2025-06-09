"use strict";
// Connect with mongoDb
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const figlet_1 = __importDefault(require("figlet"));
const connectDb = async (mongoURI) => {
    try {
        await mongoose_1.default.connect(mongoURI);
        (0, figlet_1.default)('D a t a b a s e   c o n n e c t e d', (err, data) => err ? console.log('Figlet error...') : console.log(data));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }
    catch (err) {
        (0, figlet_1.default)('D a t a b a s e  c o n n e c t i o n  e r r o r', (err, data) => err ? console.log('Figlet error') : console.log(data));
    }
};
exports.default = connectDb;
