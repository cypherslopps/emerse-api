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
exports.cache = void 0;
const redis_1 = __importDefault(require("redis"));
const client = redis_1.default.createClient();
console.log(client);
const cache = (key, dataFn) => () => __awaiter(void 0, void 0, void 0, function* () {
    const cachedData = yield client.get(key);
    // if (cachedData) return JSON.parse(cachedData);
    // const data = await dataFn();
    // client.setex(key, 3600, JSON.stringify(data));
    // return data;
});
exports.cache = cache;
//# sourceMappingURL=cache.js.map