import React, { useCallback, useEffect, useState } from "react";
import type { PokemonData } from "./types";
import { useTeam } from "./TeamContext";
import TeamModal from "./TeamModal";
import { usePokedex } from "./PokedexContext";
import { useNotifications } from "../../hooks/useNotifications";
import PokedexModal from "./PokedexModal";




const MAX_ATTEMPTS = 3;

const getRandomId = (): number => Math.floor(Math.random() * 151) + 1;

const fetchPokemon = async (id: number): Promise<PokemonData> => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!res.ok) {
        throw new Error("Failed to fetch Pokémon");
    }

    const data = (await res.json()) as {
        id: number;
        name: string;
        sprites: { front_default: string; front_shiny: string };
        types: { type: { name: string } }[];
    };

    const isShiny = Math.random() < 1 / 512;

    return {
        id: data.id,
        name: data.name,
        image: isShiny ? data.sprites.front_shiny : data.sprites.front_default,
        types: data.types.map((t) => t.type.name),
        isShiny,
        isFavorite: false,
    };
};


const PokemonEncounter: React.FC = () => {
    const { team, addPokemon } = useTeam();
    const { permission, requestPermission, notifyCapture, notifyShiny } =
        useNotifications();
    const { addToPokedex } = usePokedex();
    const [isPokedexOpen, setIsPokedexOpen] = useState(false);




    const [pokemon, setPokemon] = useState<PokemonData | null>(null);
    const [attempt, setAttempt] = useState(0);
    const [status, setStatus] = useState<"idle" | "success" | "fail" | "flee">("idle");
    const [isLoading, setIsLoading] = useState(false);

    // Modale de gestion
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Tirage d’un Pokémon
    const generateNewPokemon = useCallback(async () => {
        setIsLoading(true);
        try {
            const p = await fetchPokemon(getRandomId());
            setPokemon(p);
            setAttempt(0);
            setStatus("idle");
        } catch (error) {
            console.error(error);
            setPokemon(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void generateNewPokemon();

        if (permission === "default") {
            void requestPermission();
        }
    }, [generateNewPokemon, permission, requestPermission]);

    useEffect(() => {
        if (pokemon && pokemon.isShiny) {
            notifyShiny(pokemon.id, pokemon.name);
        }
    }, [pokemon, notifyShiny]);




    const tryCatch = (): void => {
        if (!pokemon || status === "success" || status === "flee") return;

        if (team.length >= 6) {
            setIsModalOpen(true);
            return;
        }

        // Probabilité 10% à 15 %
        const probability = 0.1 + Math.random() * 0.05;
        const success = Math.random() < probability;

        if (success) {
            setStatus("success");
            addPokemon(pokemon);
            addToPokedex(pokemon);
            notifyCapture(pokemon.name);
            return;
        }


        setAttempt((prev) => {
            const next = prev + 1;
            if (next >= MAX_ATTEMPTS) {
                setStatus("flee"); // fuite automatique
            } else {
                setStatus("fail");
            }
            return next;
        });
    };

    const skip = (): void => {
        void generateNewPokemon();
    };


    if (isLoading && !pokemon) {
        return <p>Chargement...</p>;
    }

    if (!pokemon) {
        return <p>Impossible de charger le Pokémon.</p>;
    }

    return (
        <div className="encounter">
            <PokedexModal
                isOpen={isPokedexOpen}
                onClose={() => setIsPokedexOpen(false)}
            />

            <TeamModal
                isOpen={isModalOpen}
                incomingPokemonName={pokemon.name}
                onClose={() => setIsModalOpen(false)}
            />

            <h2>Un Pokémon sauvage apparaît !</h2>

            <img src={pokemon.image} alt={pokemon.name} width={150} />

            <h3>
                {pokemon.name} {pokemon.isShiny && "✨"}
            </h3>

            <p>Types : {pokemon.types.join(", ")}</p>
            <p>Tentatives : {attempt} / {MAX_ATTEMPTS}</p>

            {status === "success" && <p className="success">🎉 Capturé !</p>}
            {status === "fail" && <p className="fail">❌ Raté !</p>}
            {status === "flee" && <p className="flee">💨 Le Pokémon a fui...</p>}

            {(status === "idle" || status === "fail") && (
                <button onClick={tryCatch}>🎯 Tenter la capture</button>
            )}

            {(status === "success" || status === "flee") && (
                <button onClick={skip}>➡️ Pokémon suivant</button>
            )}

            <button onClick={skip}>Fuir 🏃</button>

            <button onClick={() => setIsPokedexOpen(true)}>📘 Pokédex</button>

        </div>
    );
};

export default PokemonEncounter;
