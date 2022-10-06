// ******************** //
// The fetchCommunityData account-only event file.
// ******************** //

import { StringSchema } from '@ezier/validate';
import { Community } from '@prisma/client';
import {
    FetchCommunityDataResult,
    FetchCommunityDataServerParams,
} from 'interfaces/account/fetchCommunityData';
import { EventTemplate, FronvoError } from 'interfaces/all';
import { generateError } from 'utilities/global';
import { prismaClient } from 'variables/global';

async function fetchCommunityData({
    communityId,
}: FetchCommunityDataServerParams): Promise<
    FetchCommunityDataResult | FronvoError
> {
    const community = await prismaClient.community.findFirst({
        where: {
            communityId,
        },
    });

    if (!community) {
        return generateError('COMMUNITY_NOT_FOUND');
    }

    const communityData: Partial<Community> = {
        communityId,
        ownerId: community.ownerId,
        name: community.name,
        description: community.description,
        creationDate: community.creationDate,
        icon: community.icon,
        members: community.members,
        inviteOnly: community.inviteOnly || false,
        acceptedChatRequests: community.acceptedChatRequests || [],
    };

    return { communityData };
}

const fetchCommunityDataTemplate: EventTemplate = {
    func: fetchCommunityData,
    template: ['communityId'],
    schema: new StringSchema({
        communityId: {
            minLength: 5,
            maxLength: 15,
            regex: /^[a-z0-9]+$/,
        },
    }),
};

export default fetchCommunityDataTemplate;