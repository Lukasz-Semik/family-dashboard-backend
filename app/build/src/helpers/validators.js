"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const validator = require("validator");
exports.isBlank = str => (!str ? true : lodash_1.isEmpty(String(str).trim()));
exports.isEmail = email => exports.isBlank(email) ? false : validator.isEmail(String(email));
exports.hasProperLength = (str, min, max) => validator.isLength(String(str), { min, max });
//# sourceMappingURL=validators.js.map