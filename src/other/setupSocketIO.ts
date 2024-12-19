import { Server, Socket } from "socket.io";
import {
  addAssociatedSocket,
  prismaClient,
  removeAssociatedSocket,
  server,
  setServer,
} from "../vars";
import binaryParser from "socket.io-msgpack-parser";
import jwt from "jsonwebtoken";

async function authenticateSocket(
  socket: Socket,
  path: string
): Promise<string> {
  return new Promise((resolve) => {
    const header = socket.handshake.query["authorization"] as string;

    if (!header) {
      socket.disconnect();

      return;
    }

    const secret = process.env.JWT_SECRET;
    const token = header.split(" ")[1];

    jwt.verify(
      token,
      secret,
      {
        algorithms: ["HS256"],
      },
      async (err, decoded) => {
        if (err) {
          socket.disconnect();

          return;
        }

        const id = (decoded as { id: string }).id;

        const user = await prismaClient.accounts.findUnique({
          where: {
            id: id,
          },
        });

        // Deleted account most likely, reject
        if (!user) {
          socket.disconnect();

          return;
        }

        addAssociatedSocket(socket.id, id);

        resolve(id);
      }
    );
  });
}

export default function setupSocketIO(httpServer: any): void {
  setServer(
    new Server(httpServer, {
      transports: ["websocket"],
      serveClient: false,
      parser: binaryParser,
    })
  );

  // Only allow connections on namespaces
  server.on("connection", (socket) => socket.disconnect());

  // Profile-related updates
  server.of("/profiles").on("connection", async (socket) => {
    const userId = await authenticateSocket(socket, "/profiles");

    if (!userId) return;

    // Self channel for when over 1 socket is on the same account
    socket.join(userId);

    socket.on("disconnect", async () => {
      removeAssociatedSocket(socket.id);
    });
  });

  // Server-related updates
  server.of("/servers").on("connection", async (socket) => {
    const userId = await authenticateSocket(socket, "/servers");

    if (!userId) return;

    // Self channel for when over 1 socket is on the same account
    socket.join(userId);

    socket.on("disconnect", async () => {
      removeAssociatedSocket(socket.id);
    });
  });

  // DM-related updates
  server.of("/dms").on("connection", async (socket) => {
    const userId = await authenticateSocket(socket, "/dms");

    if (!userId) return;

    // Self channel for when over 1 socket is on the same account
    socket.join(userId);

    socket.on("disconnect", async () => {
      removeAssociatedSocket(socket.id);
    });
  });
}