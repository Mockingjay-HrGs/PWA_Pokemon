import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import type { PokemonData } from "./types";

type TeamContextValue = {
    team: PokemonData[];
    addPokemon: (pokemon: PokemonData) => "added" | "full";
    removePokemon: (id: number) => void;
    toggleFavorite: (id: number) => void;
};

const TeamContext = createContext<TeamContextValue | undefined>(undefined);

const TEAM_KEY = "team";

const loadTeamFromStorage = (): PokemonData[] => {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(TEAM_KEY);
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw) as PokemonData[];
        return parsed.map((p) => ({
            ...p,
            isFavorite: p.isFavorite ?? false,
        }));
    } catch {
        return [];
    }
};

const saveTeamToStorage = (team: PokemonData[]): void => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(TEAM_KEY, JSON.stringify(team));
};

type Props = {
    children: React.ReactNode;
};

export const TeamProvider: React.FC<Props> = ({ children }) => {
    const [team, setTeam] = useState<PokemonData[]>([]);

    useEffect(() => {
        setTeam(loadTeamFromStorage());
    }, []);

    useEffect(() => {
        saveTeamToStorage(team);
    }, [team]);

    const addPokemon = useCallback(
        (pokemon: PokemonData): "added" | "full" => {
            setTeam((prev) => {
                if (prev.length >= 6) {
                    return prev;
                }
                return [...prev, pokemon];
            });

            return team.length >= 6 ? "full" : "added";
        },
        [team.length]
    );

    const removePokemon = useCallback((id: number): void => {
        setTeam((prev) => prev.filter((p) => p.id !== id));
    }, []);

    const toggleFavorite = useCallback((id: number): void => {
        setTeam((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
            )
        );
    }, []);

    const value: TeamContextValue = {
        team,
        addPokemon,
        removePokemon,
        toggleFavorite,
    };

    return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};

export const useTeam = (): TeamContextValue => {
    const ctx = useContext(TeamContext);
    if (!ctx) {
        throw new Error("useTeam must be used within TeamProvider");
    }
    return ctx;
};
