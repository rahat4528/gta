import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '../../types';

export type CrewSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socketInstance: CrewSocket | null = null;

export function getSocket(token?: string): CrewSocket {
  if (!socketInstance) {
    const serverUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3003';

    socketInstance = io(serverUrl, {
      auth: { token },
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });
  } else if (token && socketInstance.auth) {
    (socketInstance.auth as any).token = token;
  }

  return socketInstance;
}

export function disconnectSocket() {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}
