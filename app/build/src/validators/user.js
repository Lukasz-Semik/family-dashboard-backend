"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const validators_1 = require("../helpers/validators");
const errors_1 = require("../constants/errors");
const validateEmail = email => {
    if (validators_1.isBlank(email))
        return errors_1.emailErrors.isRequired;
    if (!validators_1.isEmail(email))
        return errors_1.emailErrors.wrongFormat;
    return '';
};
const validatePassword = password => {
    if (validators_1.isBlank(password))
        return errors_1.passwordErrors.isRequired;
    if (!validators_1.hasProperLength(password, 6, 30))
        return errors_1.passwordErrors.wrongFormat;
    return '';
};
exports.validateSignIn = (email, password) => {
    const errors = {};
    const emailError = validateEmail(email);
    if (!validators_1.isBlank(emailError))
        errors.email = emailError;
    const passwordError = validatePassword(password);
    if (!validators_1.isBlank(passwordError))
        errors.password = passwordError;
    return {
        isValid: lodash_1.isEmpty(errors),
        errors,
    };
};
exports.validateSignUp = (email, password, firstName, lastName) => {
    const errors = {};
    const signInValidated = exports.validateSignIn(email, password);
    const { email: emailError, password: passwordError } = signInValidated.errors;
    if (!validators_1.isBlank(emailError))
        errors.email = emailError;
    if (!validators_1.isBlank(passwordError))
        errors.password = passwordError;
    if (validators_1.isBlank(firstName))
        errors.firstName = errors_1.firstNameRequired;
    if (validators_1.isBlank(lastName))
        errors.lastName = errors_1.lastNameRequired;
    return {
        isValid: lodash_1.isEmpty(errors),
        errors,
    };
};
//# sourceMappingURL=user.js.map