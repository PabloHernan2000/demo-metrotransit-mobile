import {
    io,
    type Socket,
} from 'socket.io-client';

import type {
    TrackingClientToServerEvents,
    TrackingServerToClientEvents,
} from './tracking.types';

export type TrackingSocket = Socket<
    TrackingServerToClientEvents,
    TrackingClientToServerEvents
>;

interface CreateTrackingSocketParams {
    baseUrl: string;
    token: string;
}

export const createTrackingSocket = ({
    baseUrl,
    token,
}: CreateTrackingSocketParams): TrackingSocket => {
    return io(baseUrl, {
        path: process.env.TRACKING_SOCKET_PATH || '/metrotransit/socket.io',
        transports: [
            'websocket',
            'polling',
        ],
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        auth: {
            token,
        },
    });
};