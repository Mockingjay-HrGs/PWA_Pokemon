import React from "react";
import { usePokedex } from "./PokedexContext";
import SectionTitle from "../SectionTitle";

const Pokedex: React.FC = () => {
    const { entries } = usePokedex();

    return (
        <section className="section pokedex">
            <SectionTitle title="Pokédex" />

            {entries.length === 0 ? (
                <p>Aucun Pokémon capturé pour le moment.</p>
            ) : (
                <div className="pokedex-grid">
                    {entries.map((entry) => (
                        <div key={entry.id} className="pokedex-card">
                            <span className="pokedex-id">#{entry.id.toString().padStart(3, "0")}</span>
                            <img src={entry.image} alt={entry.name} width={80} />
                            <h3>
                                {entry.name} {entry.hasShiny && "✨"}
                            </h3>
                            <p className="types">{entry.types.join(", ")}</p>
                            <p className="count">
                                Capturé {entry.count} fois
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Pokedex;
