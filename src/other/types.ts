// ******************** //
// Types for all kinds of files.
// ******************** //

export type CollectionNames = 'Account' | 'Token' | 'Report' | 'Log';

export type Errors = 'UNKNOWN' | 'MUST_BE_LOGGED_IN' | 'MUST_BE_LOGGED_OUT' | 'MISSING_ARGS'
                    | 'RATELIMITED' | 'REQUIRED' | 'REQUIRED_EMAIL' | 'REQUIRED_UUID' | 'LENGTH'
                    | 'EXACT_LENGTH' | 'INVALID_PASSWORD' | 'ACC_ALR_EXISTS' | 'ACC_DOESNT_EXIST'
                    | 'INVALID_REGEX' | 'INVALID_TOKEN' | 'PROFILE_NOT_FOUND';

export type TestAssertTypes = 'string' | 'boolean' | 'number'
                            | 'function'| 'object';
