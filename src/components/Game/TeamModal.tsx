import React from "react";
import { useTeam } from "./TeamContext";

type TeamModalProps = {
    isOpen: boolean;
    onClose: () => void;
    incomingPokemonName: string;
};

const TeamModal: React.FC<TeamModalProps> = ({
                                                 isOpen,
                                                 onClose,
                                                 incomingPokemonName,
                                             }) => {
    const { team, removePokemon } = useTeam();

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Équipe complète !</h2>

                <p>
                    Vous devez retirer un Pokémon avant de capturer{" "}
                    <strong>{incomingPokemonName}</strong>.
                </p>

                <div className="modal-team">
                    {team.map((p) => (
                        <div key={p.id} className="modal-card">
                            <img src={p.image} alt={p.name} width={70} />
                            <h3>
                                {p.name} {p.isShiny && "✨"}
                            </h3>
                            <p>{p.types.join(", ")}</p>
                            <button
                                onClick={() => {
                                    removePokemon(p.id);
                                    onClose();
                                }}
                            >
                                Retirer
                            </button>
                        </div>
                    ))}
                </div>

                <button className="close-btn" onClick={onClose}>
                    Annuler
                </button>
            </div>
        </div>
    );
};

export default TeamModal;
