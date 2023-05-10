// ******************** //
// The logout account-only event file.
// ******************** //

import { LogoutResult, LogoutServerParams } from 'interfaces/account/logout';
import { EventTemplate } from 'interfaces/all';
import { getSocketAccountId, logoutSocket } from 'utilities/global';
import { prismaClient } from 'variables/global';

async function logout({
    io,
    socket,
}: LogoutServerParams): Promise<LogoutResult> {
    const account = await prismaClient.account.findFirst({
        where: {
            profileId: getSocketAccountId(socket.id),
        },
    });

    if (account.isInRoom) {
        await socket.leave(account.roomId);
    }

    logoutSocket(io, socket);

    return {};
}

const logoutTemplate: EventTemplate = {
    func: logout,
    template: [],
};

export default logoutTemplate;
