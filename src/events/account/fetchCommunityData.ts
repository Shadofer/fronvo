// ******************** //
// The fetchCommunityData account-only event file.
// ******************** //

import { StringSchema } from '@ezier/validate';
import {
    FetchCommunityDataResult,
    FetchCommunityDataServerParams,
    FetchedFronvoCommunity,
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

    const communityData: FetchedFronvoCommunity = {
        communityId,
        ownerId: community.ownerId,
        name: community.name,
        creationDate: community.creationDate,
        icon: community.icon,
        members: community.members,
        chatRequestsEnabled:
            typeof community.chatRequestsEnabled != 'undefined'
                ? community.chatRequestsEnabled
                : true,
        acceptedChatRequests: community.acceptedChatRequests || [],
        totalMessages: await prismaClient.communityMessage.count({
            where: {
                communityId: community.communityId,
            },
        }),
        bannedMembers: community.bannedMembers || [],
    };

    return { communityData };
}

const fetchCommunityDataTemplate: EventTemplate = {
    func: fetchCommunityData,
    template: ['communityId'],
    schema: new StringSchema({
        communityId: {
            minLength: 2,
            maxLength: 15,
            regex: /^[a-z0-9]+$/,
        },
    }),
};

export default fetchCommunityDataTemplate;
