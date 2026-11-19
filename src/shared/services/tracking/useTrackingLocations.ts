import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import {
    createTrackingSocket,
    type TrackingSocket,
} from './trackingSocket';

import type {
    TrackingLocation,
    TrackingLocationPayload,
    TrackingLocationRemovedPayload,
    TrackingServiceType,
} from './tracking.types';

type TrackingStatus =
    | 'idle'
    | 'connecting'
    | 'connected'
    | 'disconnected'
    | 'error';

interface UseTrackingLocationsParams {
    baseUrl: string;
    token: string | null;
    enabled?: boolean;
    typeService?: TrackingServiceType;
}

const normalizeLocation = (
    data: TrackingLocationPayload
): TrackingLocation | null => {
    if (
        !Number.isFinite(data.latitude) ||
        !Number.isFinite(data.longitude) ||
        data.latitude < -90 ||
        data.latitude > 90 ||
        data.longitude < -180 ||
        data.longitude > 180 ||
        !data.unitNumber
    ) {
        return null;
    }

    return {
        ...data,
        accuracy:
            data.accuracy !== undefined &&
                data.accuracy >= 0
                ? data.accuracy
                : undefined,
        speed:
            data.speed !== undefined &&
                data.speed >= 0
                ? data.speed
                : undefined,
        heading:
            data.heading !== undefined &&
                data.heading >= 0
                ? data.heading
                : undefined,
        id: `${data.typeService}:${data.unitNumber}`,
        receivedAt: Date.now(),
    };
};

export const useTrackingLocations = ({
    baseUrl,
    token,
    enabled = true,
    typeService = 'all',
}: UseTrackingLocationsParams) => {
    const socketRef =
        useRef<TrackingSocket | null>(null);

    const [
        locationsById,
        setLocationsById,
    ] = useState<
        Record<string, TrackingLocation>
    >({});

    const [
        status,
        setStatus,
    ] = useState<TrackingStatus>('idle');

    const [
        error,
        setError,
    ] = useState<string | null>(null);

    useEffect(() => {
        if (
            !enabled ||
            !token ||
            !baseUrl
        ) {
            setStatus('idle');
            return;
        }

        const socket =
            createTrackingSocket({
                baseUrl,
                token,
            });

        socketRef.current = socket;
        setStatus('connecting');
        setError(null);

        const handleConnect = () => {
            setStatus('connected');

            socket.emit(
                'tracking:subscribe',
                {
                    typeService,
                },
                response => {
                    if (!response.success) {
                        setError(
                            response.message ??
                            'No fue posible suscribirse al tracking'
                        );
                    }
                }
            );
        };

        const handleLocation = (
            data: TrackingLocationPayload
        ) => {
            const location =
                normalizeLocation(data);

            if (!location) {
                return;
            }

            setLocationsById(
                previous => ({
                    ...previous,
                    [location.id]: location,
                })
            );
        };

        const handleLocationRemoved = (
            data: TrackingLocationRemovedPayload
        ) => {
            const id = `${data.typeService}:${data.unitNumber}`;

            setLocationsById(previous => {
                if (!previous[id]) {
                    return previous;
                }

                const next = { ...previous };
                delete next[id];
                return next;
            });
        };

        const handleConnectError = (
            connectError: Error
        ) => {
            setStatus('error');
            setError(
                connectError.message ??
                'Error de conexión con tracking'
            );
        };

        const handleDisconnect = () => {
            setStatus('disconnected');
        };

        socket.on(
            'connect',
            handleConnect
        );

        socket.on(
            'location:received',
            handleLocation
        );

        socket.on(
            'location:removed',
            handleLocationRemoved
        );

        socket.on(
            'connect_error',
            handleConnectError
        );

        socket.on(
            'disconnect',
            handleDisconnect
        );

        socket.connect();

        return () => {
            socket.emit(
                'tracking:unsubscribe',
                {
                    typeService,
                }
            );

            socket.off(
                'connect',
                handleConnect
            );

            socket.off(
                'location:received',
                handleLocation
            );

            socket.off(
                'location:removed',
                handleLocationRemoved
            );

            socket.off(
                'connect_error',
                handleConnectError
            );

            socket.off(
                'disconnect',
                handleDisconnect
            );

            socket.disconnect();

            socketRef.current = null;
        };
    }, [
        baseUrl,
        enabled,
        token,
        typeService,
    ]);

    const locations = useMemo(
        () => Object.values(locationsById),
        [locationsById]
    );

    return {
        locations,
        locationsById,
        status,
        isConnected:
            status === 'connected',
        error,
    };
};
