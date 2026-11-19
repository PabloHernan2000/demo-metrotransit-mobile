export type TrackingServiceType =
    | 'troncal'
    | 'alimentadora'
    | 'all';

export interface TrackingLocationPayload {
    latitude: number;
    longitude: number;
    accuracy?: number;
    speed?: number;
    heading?: number;
    unitNumber: string;
    typeService: 'troncal' | 'alimentadora';
    routeId: string;
    timestamp: number;
    socketId: string;
}

export interface TrackingLocation
    extends TrackingLocationPayload {
    id: string;
    receivedAt: number;
}

export interface TrackingLocationRemovedPayload {
    unitNumber: string;
    typeService: 'troncal' | 'alimentadora';
    routeId: string;
}

export interface TrackingSubscribeResponse {
    success: boolean;
    message?: string;
}

export interface TrackingClientToServerEvents {
    'tracking:subscribe': (
        data: {
            typeService: TrackingServiceType;
        },
        callback?: (
            response: TrackingSubscribeResponse
        ) => void
    ) => void;

    'tracking:unsubscribe': (
        data: {
            typeService: TrackingServiceType;
        },
        callback?: (
            response: TrackingSubscribeResponse
        ) => void
    ) => void;
}

export interface TrackingServerToClientEvents {
    'location:received': (
        data: TrackingLocationPayload
    ) => void;

    'location:removed': (
        data: TrackingLocationRemovedPayload
    ) => void;
}
