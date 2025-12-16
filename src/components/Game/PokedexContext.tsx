import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import type { PokemonData, PokedexEntry } from "./types";

type PokedexContextValue = {
    entries: PokedexEntry[];
    addToPokedex: (pokemon: PokemonData) => void;
};

const PokedexContext = createContext<PokedexContextValue | undefined>(
    undefined
);

const POKEDEX_KEY = "pokedex";

const loadPokedexFromStorage = (): PokedexEntry[] => {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(POKEDEX_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw) as PokedexEntry[];
    } catch {
        return [];
    }
};

const savePokedexToStorage = (entries: PokedexEntry[]): void => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(POKEDEX_KEY, JSON.stringify(entries));
};

type Props = { children: React.ReactNode };

export const PokedexProvider: React.FC<Props> = ({ children }) => {
    const [entries, setEntries] = useState<PokedexEntry[]>([]);

    useEffect(() => {
        setEntries(loadPokedexFromStorage());
    }, []);

    useEffect(() => {
        savePokedexToStorage(entries);
    }, [entries]);

    const addToPokedex = useCallback((pokemon: PokemonData): void => {
        setEntries((prev) => {
            const existing = prev.find((e) => e.id === pokemon.id);
            if (existing) {
                return prev.map((e) =>
                    e.id === pokemon.id
                        ? {
                            ...e,
                            count: e.count + 1,
                            hasShiny: e.hasShiny || pokemon.isShiny,
                            image: pokemon.image,
                        }
                        : e
                );
            }

            const newEntry: PokedexEntry = {
                id: pokemon.id,
                name: pokemon.name,
                image: pokemon.image,
                types: pokemon.types,
                count: 1,
                hasShiny: pokemon.isShiny,
            };

            return [...prev, newEntry].sort((a, b) => a.id - b.id);
        });
    }, []);

    const value: PokedexContextValue = { entries, addToPokedex };

    return (
        <PokedexContext.Provider value={value}>
            {children}
        </PokedexContext.Provider>
    );
};

export const usePokedex = (): PokedexContextValue => {
    const ctx = useContext(PokedexContext);
    if (!ctx) {
        throw new Error("usePokedex must be used within PokedexProvider");
    }
    return ctx;
};
