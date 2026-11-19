import notifee, { AndroidColor, AndroidImportance, Notification } from '@notifee/react-native';

interface NotificationParams {
    title: string;
    body: string;
    imageUrl?: string;
    data?: Record<string, string>;
}

export const initializeNotifications = async (): Promise<void> => {
    try {
        await notifee.requestPermission();

        await notifee.createChannel({
            id: 'default',
            name: 'Notificaciones Transporte Metropolitano',
            importance: AndroidImportance.HIGH,
        });
    } catch (error) {
        console.error("initializeNotifications error:", error);
    }
}

export const showNotification = async ({
    title,
    body,
    imageUrl,
    data,
}: NotificationParams): Promise<void> => {
    try {
        const notification: Notification = {
            title,
            body,
            data,
            android: {
                channelId: "default",
                smallIcon: "ic_stat_notification",
                color: "#691B32" as AndroidColor,
                pressAction: {
                    id: "default",
                },
                ...(imageUrl && {
                    largeIcon: imageUrl,
                }),
            },
            ios: {
                foregroundPresentationOptions: {
                    badge: true,
                    sound: true,
                    banner: true,
                    list: true,
                },
                ...(imageUrl && {
                    attachments: [{ url: imageUrl }],
                }),
            },
        };

        await notifee.displayNotification(notification);
    } catch (error) {
        console.error("showNotification error:", error);
    }
};

/* export const showNotification = async ({ title, body, imageUrl, data }: NotificationParams): Promise<void> => {
    // Solicitar permisos en iOS
    await notifee.requestPermission();

    // Crear un canal (obligatorio en Android)
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
    });

    // Configuración base de la notificación
    const notification: Notification = {
        title,
        body,
        data: from ? { from } : undefined,
        android: {
            channelId,
            smallIcon: 'ic_stat_notification',
            color: '#691B32' as AndroidColor,
            pressAction: {
                id: 'default',
            },
            ...(imageUrl && { largeIcon: imageUrl }), // Solo agregar largeIcon si imageUrl existe
        },
        ios: {
            foregroundPresentationOptions: {
                badge: true,
                sound: true,
                banner: true,
                list: true,
            },
            ...(imageUrl && { attachments: [{ url: imageUrl }] }), // Solo agregar attachments si imageUrl existe
        },
    };

    // Mostrar la notificación
    await notifee.displayNotification(notification);
}; */