import PokemonEncounter from "./components/Game/PokemonEncounter";
import TeamPanel from "./components/Game/TeamPanel";
import ThemeToggle from "./components/ThemeToggle";
import "./styles/sections.css";


const App: React.FC = () => {
    return (
        <>
            <ThemeToggle />
            <PokemonEncounter />
            <TeamPanel />
        </>
    );
};

export default App;
