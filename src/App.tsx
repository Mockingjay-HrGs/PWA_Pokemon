function App() {
    return (
        <div className="app">
            <header className="hero">
                <div className="hero-image">
                    {/* Ici tu pourras mettre ton image Pokémon */}
                </div>
                <div className="hero-content">
                    <h1>PWA Simulateur de Capture Pokémon</h1>
                    <p>Attrapez-les tous dans votre navigateur ! 🎮</p>
                </div>
            </header>

            <section className="concept">
                <h2>Le Concept</h2>
                <div className="cards">
                    <div className="card">
                        <h3>Rencontres Aléatoires</h3>
                        <p>151 Pokémon de la Gen 1</p>
                        <p>Shiny 1/512 chance ✨</p>
                    </div>
                    <div className="card">
                        <h3>Système de Capture</h3>
                        <p>3 lancés max par combat</p>
                        <p>10–15% de réussite</p>
                    </div>
                    <div className="card">
                        <h3>PWA Installable</h3>
                        <p>Offline-first avec localStorage</p>
                        <p>Manifest + Service Worker</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default App;
