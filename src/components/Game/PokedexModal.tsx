import React from "react";
import { usePokedex } from "./PokedexContext";

type PokedexModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const PokedexModal: React.FC<PokedexModalProps> = ({ isOpen, onClose }) => {
    const { entries } = usePokedex();

    if (!isOpen) return null;

    const handleOverlayClick = () => {
        onClose();
    };

    const handleModalClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation(); // empêche de fermer quand on clique DANS la modale
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal pokedex-modal" onClick={handleModalClick}>
                <div className="modal-header">
                    <h2>Pokédex</h2>
                    <button className="modal-close-icon" onClick={onClose}>
                        ✕
                    </button>
                </div>

                {entries.length === 0 ? (
                    <p>Aucun Pokémon enregistré pour le moment.</p>
                ) : (
                    <div className="pokedex-grid">
                        {entries.map((entry) => (
                            <div key={entry.id} className="pokedex-card">
                <span className="pokedex-id">
                  #{entry.id.toString().padStart(3, "0")}
                </span>
                                <img src={entry.image} alt={entry.name} width={70} />
                                <h3>
                                    {entry.name} {entry.hasShiny && "✨"}
                                </h3>
                                <p className="types">{entry.types.join(", ")}</p>
                                <p className="count">Capturé {entry.count} fois</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PokedexModal;
