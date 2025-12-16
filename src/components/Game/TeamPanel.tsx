import React from "react";
import { useTeam } from "./TeamContext";

const TeamPanel: React.FC = () => {
    const { team, removePokemon, toggleFavorite } = useTeam();

    return (
        <section className="section">
            <h2 className="section-title">Votre équipe</h2>

            <p>
                {team.length} / 6 Pokémon capturés
            </p>

            <div className="team-grid">
                {team.map((p) => (
                    <div key={p.id} className="team-card">
                        <button
                            className="fav-btn"
                            onClick={() => toggleFavorite(p.id)}
                            aria-label="Toggle favori"
                        >
                            {p.isFavorite ? "⭐" : "☆"}
                        </button>

                        <img src={p.image} alt={p.name} width={80} />
                        <h3>
                            {p.name} {p.isShiny && "✨"}
                        </h3>
                        <p>{p.types.join(", ")}</p>

                        <button onClick={() => removePokemon(p.id)}>Retirer</button>
                    </div>
                ))}

                {team.length === 0 && <p>Aucun Pokémon capturé pour l’instant.</p>}
            </div>
        </section>
    );
};

export default TeamPanel;
