import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Peliculas from './components/Peliculas';
// Importa otros componentes que necesites

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/peliculas" element={<Peliculas />} />
                {/* Añade más rutas aquí */}
            </Routes>
        </Router>
    );
};

export default App;