import { useCallback, useEffect, useRef, useState } from "react";

type PermissionState = NotificationPermission | "unsupported";

export const useNotifications = () => {
    const [permission, setPermission] = useState<PermissionState>("default");
    const lastShinyIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (typeof window === "undefined" || !("Notification" in window)) {
            setPermission("unsupported");
            return;
        }
        setPermission(Notification.permission);
    }, []);

    const requestPermission = useCallback(async () => {
        if (permission === "unsupported") return "unsupported";
        if (Notification.permission === "granted") {
            setPermission("granted");
            return "granted";
        }
        const result = await Notification.requestPermission();
        setPermission(result);
        return result;
    }, [permission]);

    const notifyCapture = useCallback(
        (pokemonName: string) => {
            if (permission !== "granted") return;
            new Notification("Capture Réussie !", {
                body: `It's a catch ! ${pokemonName} rejoint votre équipe 🎉`,
            });
        },
        [permission]
    );

    const notifyShiny = useCallback(
        (pokemonId: number, pokemonName: string) => {
            if (permission !== "granted") return;
            // évite les doubles notif en StrictMode
            if (lastShinyIdRef.current === pokemonId) return;
            lastShinyIdRef.current = pokemonId;

            new Notification("Shiny détecté ✨", {
                body: `"Shine bright like a diamond" – ${pokemonName} ! (1/512)`,
            });
        },
        [permission]
    );

    return {
        permission,
        requestPermission,
        notifyCapture,
        notifyShiny,
    };
};
