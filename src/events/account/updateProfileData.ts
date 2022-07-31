// ******************** //
// The updateProfileData account-only event file.
// ******************** //

import { StringSchema } from '@ezier/validate';
import {
    UpdateProfileDataResult,
    UpdateProfileDataServerParams,
} from 'interfaces/account/updateProfileData';
import { EventTemplate, FronvoError } from 'interfaces/all';
import { getSocketAccountId } from 'utilities/global';
import { prismaClient } from 'variables/global';

async function updateProfileData({
    socket,
    username,
    bio,
    avatar,
}: UpdateProfileDataServerParams): Promise<
    UpdateProfileDataResult | FronvoError
> {
    // Username validation not needed here, see schema below
    // Nor avatar, may need for content-type and extension if applicable (|| ?)

    // Proceed to update info
    // Create update dict, some parameters shouldn't be updated if empty
    const updateDict = {
        bio: bio.replace(/\n\n/g, '\n'),
        avatar,
    };

    // Refuse to remove
    if (username) {
        updateDict['username'] = username;
    }

    const profileData = await prismaClient.account.update({
        data: updateDict,
        where: {
            profileId: getSocketAccountId(socket.id),
        },
        select: {
            username: true,
            bio: true,
            avatar: true,
        },
    });

    return { profileData };
}

const updateProfileDataTemplate: EventTemplate = {
    func: updateProfileData,
    template: ['username', 'bio', 'avatar'],
    points: 3,
    schema: new StringSchema({
        username: {
            minLength: 5,
            maxLength: 30,
            optional: true,
        },

        bio: {
            maxLength: 128,
            optional: true,
        },

        avatar: {
            // Ensure https
            regex: /^(https:\/\/).+$/,
            maxLength: 512,
            optional: true,
        },
    }),
};

export default updateProfileDataTemplate;
