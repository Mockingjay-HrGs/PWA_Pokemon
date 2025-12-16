export interface PokemonData {
    id: number;
    name: string;
    image: string;
    types: string[];
    isShiny: boolean;
    isFavorite: boolean;
}

export interface PokedexEntry {
    id: number;
    name: string;
    image: string;
    types: string[];
    count: number;
    hasShiny: boolean;
}
