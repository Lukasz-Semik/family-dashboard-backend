"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const typeorm_1 = require("typeorm");
const lodash_1 = require("lodash");
const User_1 = require("../entity/User");
const bodyParser_1 = require("../utils/bodyParser");
const routes_1 = require("../constants/routes");
const errors_1 = require("../constants/errors");
const user_1 = require("../validators/user");
let UserController = class UserController {
    constructor() {
        this.userRepository = typeorm_1.getRepository(User_1.User);
    }
    // @create user
    // @full route: /api/sign-up
    // @access public
    createUser(body, res) {
        const { email, password, firstName, lastName } = body;
        const { isValid, errors } = user_1.validateSignUp(email, password, firstName, lastName);
        return this.userRepository
            .find({ email })
            .then(existingUser => {
            if (!lodash_1.isEmpty(existingUser))
                return res.status(400).json({ email: errors_1.emailErrors.emailTaken });
            if (!isValid)
                return res.status(400).json({ errors });
            const user = new User_1.User();
            return this.userRepository
                .save(Object.assign({}, user, { email,
                password,
                firstName,
                lastName }))
                .then(arg => res.status(200).json(arg))
                .catch(err => res.status(400).json({ error: errors_1.internalServerErrors.sthWrong, caughtError: err }));
        })
            .catch(err => res.status(400).json({ error: errors_1.internalServerErrors.sthWrong, caughtError: err }));
    }
};
__decorate([
    routing_controllers_1.Post(routes_1.API_SIGN_UP),
    routing_controllers_1.UseBefore(bodyParser_1.default),
    __param(0, routing_controllers_1.Body()), __param(1, routing_controllers_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "createUser", null);
UserController = __decorate([
    routing_controllers_1.JsonController()
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map