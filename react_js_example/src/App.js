import React from 'react';
import UsuarioList from './pages/UsuarioList';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Cabeçalho da aplicação */}
      <header className="App-header">
        <h1>NailsApp - Sistema de Clientes</h1>
        {/* <p>Gerencie seus clientes de forma eficiente</p> */}
      </header>

      {/* Área principal com a lista de clientes */}
      <main className="App-main">
        <UsuarioList />
      </main>

      {/* Rodapé */}
      <footer className="App-footer">
        <p>Sistema desenvolvido para NailsApp © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;