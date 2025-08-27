"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const figlet_1 = __importDefault(require("figlet"));
const connectDb = (mongoURI) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(mongoURI);
        (0, figlet_1.default)('D a t a b a s e   c o n n e c t e d', (err, data) => err ? console.log('Figlet error...') : console.log(data));
    }
    catch (err) {
        (0, figlet_1.default)('D a t a b a s e  c o n n e c t i o n  e r r o r', (err, data) => err ? console.log('Figlet error') : console.log(data));
    }
});
exports.default = connectDb;
