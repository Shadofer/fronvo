// ******************** //
// Constant values used for outputing error codes.
// ******************** //

export const JoiE: {[errorCode: string]: string} = {
    TYPE_REQUIRED: 'any.required',
    TYPE_EMPTY: 'string.empty',
    TYPE_MIN: 'string.min',
    TYPE_MAX: 'string.max',
    TYPE_LENGTH: 'string.length',
    TYPE_INVALID_EMAIL_FORMAT: 'string.email',
    TYPE_REGEX: 'string.pattern.base',
};

const enumsArr = [
    'ERR_UNKNOWN',
    'ERR_LENGTH',
    'ERR_EXACT_LENGTH',
    'ERR_REQUIRED',
    'ERR_MISSING_ARGS',
    'ERR_INVALID_EMAIL',
    'ERR_INVALID_EMAIL_FORMAT',
    'ERR_ACC_DOESNT_EXIST',
    'ERR_ACC_ALR_EXISTS',
    'ERR_INVALID_PASSWORD',
    'ERR_INVALID_REGEX',
    'ERR_INVALID_TOKEN',
    'ERR_MUST_BE_LOGGED_IN',
    'ERR_MUST_BE_LOGGED_OUT',
    'ERR_PROFILE_NOT_FOUND'
];

export const enums: {[errorCode: string]: number} = {};

// Eg.: {ERR_UNKNOWN: 1, ERR_LENGTH: 2}
enumsArr.forEach(item => {
    enums[item] = enumsArr.indexOf(item) + 1;
});

// TODO: Error code completion function in a utilities function, retrieve from there, dont use directly