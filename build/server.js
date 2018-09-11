"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var body_parser_1 = __importDefault(require("body-parser"));
var APP = express_1.default();
var PORT = Number(process.env.PORT) || 8080;
APP.use(body_parser_1.default);
APP.use(body_parser_1.default.urlencoded({ extended: false }));
APP.use(morgan_1.default("dev"));
APP.listen(PORT, function () {
    console.log("App is running on " + PORT);
});
