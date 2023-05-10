// ******************** //
// Shared variables for the test files.
// ******************** //

import { SharedTestVariablesType } from 'interfaces/test';
import { generateEmail, generatePassword } from 'test/utilities';

export function setTestVariable(
    variable: SharedTestVariablesType,
    value: any
): void {
    sharedVariables[variable as string] = value;
}

const sharedVariables: { [TestVariable in SharedTestVariablesType] } = {
    email: generateEmail(),
    password: generatePassword(),
    token: '',
    profileId: '',
    secondaryProfileToken: '',
    secondaryProfileId: '',
    sharedPostId: '',
    createdRoomId: '',
    createdRoomName: '',
    sharedMessageId: '',
};

export default sharedVariables;
