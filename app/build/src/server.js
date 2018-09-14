"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express = require("express");
const routing_controllers_1 = require("routing-controllers");
const typeorm_1 = require("typeorm");
const UserController_1 = require("./controllers/UserController");
const APP = express();
const PORT = Number(process.env.PORT) || 8080;
// tslint:disable no-console
exports.DbConnection = typeorm_1.createConnection()
    .then(conn => console.log('Database connection established'))
    .catch(error => console.log('TypeORM connection error: ', error));
routing_controllers_1.useExpressServer(APP, {
    routePrefix: '/api',
    controllers: [UserController_1.UserController],
});
APP.listen(PORT, () => {
    console.log(`App is running on ${PORT}`);
    // tslint:enable
});
//# sourceMappingURL=server.js.map