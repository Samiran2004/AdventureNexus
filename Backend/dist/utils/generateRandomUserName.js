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
const userModel_1 = __importDefault(require("../Database/models/userModel"));
function createUserName(fullname) {
    return __awaiter(this, void 0, void 0, function* () {
        const splitName = fullname.toLowerCase().split(' ');
        const randomNumber = Math.floor(Math.random() * 9000) + 1000;
        const randomUserName = `${splitName[0]}${randomNumber}`;
        const checkUserName = yield userModel_1.default.findOne({ username: randomUserName });
        if (checkUserName) {
            return yield createUserName(fullname);
        }
        else {
            return randomUserName;
        }
    });
}
exports.default = createUserName;
