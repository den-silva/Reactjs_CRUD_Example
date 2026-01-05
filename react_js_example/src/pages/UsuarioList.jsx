import React, { useState, useEffect } from 'react';
import usuarioService from '../services/usuarioService';
import '../App.css';

function UsuarioList() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [clienteEditado, setClienteEditado] = useState({
    nome: '',
    email: '',
    cpf: '',
    status: 'Ativo',
    dataNascimento: ''
  });

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usuarioService.getAllUsuarios();
      setClientes(data);
    } catch (err) {
      setError('Erro ao carregar clientes. Verifique se o backend está rodando.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const iniciarEdicao = (cliente) => {
    setEditandoId(cliente.id);
    setClienteEditado({
      nome: cliente.nome,
      email: cliente.email,
      cpf: cliente.cpf,
      status: cliente.status,
      dataNascimento: cliente.dataNascimento.split('T')[0] // Formato YYYY-MM-DD para input type="date"
    });
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setClienteEditado({
      nome: '',
      email: '',
      cpf: '',
      status: 'Ativo',
      dataNascimento: ''
    });
  };

  const salvarEdicao = async (id) => {
    try {
      await usuarioService.updateUsuario(id, clienteEditado);
      await carregarClientes();
      setEditandoId(null);
      alert('Cliente atualizado com sucesso!');
    } catch (err) {
      alert(`Erro: ${err.message || 'Não foi possível atualizar o cliente'}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClienteEditado({
      ...clienteEditado,
      [name]: value
    });
  };

//   const handleCriarCliente = async () => {
//     try {
//       const novoCliente = {
//         nome: 'Maria Silva',
//         email: 'maria@email.com',
//         cpf: '98765432100',
//         status: 'Ativo',
//         dataNascimento: '1985-05-15'
//       };
      
//       await usuarioService.createUsuario(novoCliente);
//       await carregarClientes();
//       alert('Cliente criado com sucesso!');
//     } catch (err) {
//       alert(`Erro: ${err.message || 'Não foi possível criar o cliente'}`);
//     }
//   };

const handleCriarCliente = async () => {
  try {
    // Gerar dados fictícios dinamicamente
    const novoCliente = gerarClienteFicticio();
    
    console.log('🆕 Criando cliente:', novoCliente);
    
    await usuarioService.createUsuario(novoCliente);
    await carregarClientes();
    alert(`Cliente "${novoCliente.nome}" criado com sucesso!`);
  } catch (err) {
    console.error('❌ Erro ao criar cliente:', err);
    alert(`Erro: ${err.response?.data || err.message || 'Não foi possível criar o cliente'}`);
  }
};

// Função auxiliar para gerar cliente fictício
const gerarClienteFicticio = () => {
  // Arrays de dados fictícios
  const nomes = [
    'Ana', 'Carlos', 'Fernanda', 'Ricardo', 'Juliana', 'Pedro', 'Amanda', 
    'Roberto', 'Patrícia', 'Marcos', 'Mariana', 'Lucas', 'Camila', 'Rafael',
    'Beatriz', 'Daniel', 'Isabela', 'Thiago', 'Larissa', 'Gabriel'
  ];
  
  const sobrenomes = [
    'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Almeida',
    'Pereira', 'Costa', 'Carvalho', 'Gomes', 'Martins', 'Araújo', 'Melo',
    'Ribeiro', 'Alves', 'Lima', 'Teixeira', 'Nunes', 'Rocha'
  ];
  
  const dominios = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'empresa.com'];
  
  // Gerar nome aleatório
  const nomeAleatorio = nomes[Math.floor(Math.random() * nomes.length)];
  const sobrenomeAleatorio = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
  const nomeCompleto = `${nomeAleatorio} ${sobrenomeAleatorio}`;
  
  // Gerar email baseado no nome
  const email = `${nomeAleatorio.toLowerCase()}.${sobrenomeAleatorio.toLowerCase()}@${dominios[Math.floor(Math.random() * dominios.length)]}`;
  
  // Gerar CPF único com timestamp
  const timestamp = Date.now().toString().slice(-4);
  const cpfBase = Math.floor(100000000 + Math.random() * 900000000).toString();
  const cpf = cpfBase.slice(0, 7) + timestamp;
  
  // Gerar data de nascimento aleatória (entre 18 e 70 anos)
  const anoAtual = new Date().getFullYear();
  const anoNascimento = anoAtual - (18 + Math.floor(Math.random() * 52));
  const mesNascimento = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const diaNascimento = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  const dataNascimento = `${anoNascimento}-${mesNascimento}-${diaNascimento}`;
  
  // Status aleatório (70% Ativo, 30% Inativo)
  const status = Math.random() < 0.7 ? 'Ativo' : 'Inativo';
  
  return {
    nome: nomeCompleto,
    email: email,
    cpf: cpf,
    status: status,
    dataNascimento: dataNascimento
  };
};

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await usuarioService.deleteUsuario(id);
        await carregarClientes();
        alert('Cliente excluído com sucesso!');
      } catch (err) {
        alert(`Erro: ${err.message || 'Não foi possível excluir o cliente'}`);
      }
    }
  };

  if (loading) return <div className="loading">Carregando clientes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="clientes-container" style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', marginTop: '10px' }}>Lista de Clientes</h2>
      <button onClick={handleCriarCliente} className="btn btn-primary" style={{ marginBottom: '20px' }}>
        + Novo Cliente de Teste
      </button>
      
      <table className="clientes-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>CPF</th>
            <th>Status</th>
            <th>Data Nasc.</th>
            <th>Data Inclusão</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center' }}>
                Nenhum cliente cadastrado
              </td>
            </tr>
          ) : (
            clientes.map(cliente => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                
                {/* NOME - Edição em linha */}
                <td>
                  {editandoId === cliente.id ? (
                    <input
                      type="text"
                      name="nome"
                      value={clienteEditado.nome}
                      onChange={handleInputChange}
                      className="edit-input"
                      style={{ width: '100%', padding: '4px' }}
                    />
                  ) : (
                    cliente.nome
                  )}
                </td>
                
                {/* EMAIL - Edição em linha */}
                <td>
                  {editandoId === cliente.id ? (
                    <input
                      type="email"
                      name="email"
                      value={clienteEditado.email}
                      onChange={handleInputChange}
                      className="edit-input"
                      style={{ width: '100%', padding: '4px' }}
                    />
                  ) : (
                    cliente.email
                  )}
                </td>
                
                {/* CPF - Edição em linha */}
                <td>
                  {editandoId === cliente.id ? (
                    <input
                      type="text"
                      name="cpf"
                      value={clienteEditado.cpf}
                      onChange={handleInputChange}
                      className="edit-input"
                      style={{ width: '100%', padding: '4px' }}
                    />
                  ) : (
                    usuarioService.formatarCPF(cliente.cpf)
                  )}
                </td>
                
                {/* STATUS - Edição em linha */}
                <td>
                  {editandoId === cliente.id ? (
                    <select
                      name="status"
                      value={clienteEditado.status}
                      onChange={handleInputChange}
                      className="edit-select"
                      style={{ width: '100%', padding: '4px' }}
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  ) : (
                    <span className={`status-badge ${cliente.status.toLowerCase()}`}>
                      {cliente.status}
                    </span>
                  )}
                </td>
                
                {/* DATA NASCIMENTO - Edição em linha */}
                <td>
                  {editandoId === cliente.id ? (
                    <input
                      type="date"
                      name="dataNascimento"
                      value={clienteEditado.dataNascimento}
                      onChange={handleInputChange}
                      className="edit-input"
                      style={{ width: '100%', padding: '4px' }}
                    />
                  ) : (
                    usuarioService.formatarDataExibicao(cliente.dataNascimento)
                  )}
                </td>
                
                {/* DATA INCLUSÃO (somente leitura) */}
                <td>{usuarioService.formatarDataExibicao(cliente.dataInclusao)}</td>
                
                {/* AÇÕES */}
                <td>
                  {editandoId === cliente.id ? (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button 
                        onClick={() => salvarEdicao(cliente.id)}
                        className="btn btn-success btn-sm"
                        style={{ padding: '4px 8px' }}
                      >
                        Salvar
                      </button>
                      <button 
                        onClick={cancelarEdicao}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px' }}
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button 
                        onClick={() => handleExcluir(cliente.id)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '4px 8px' }}
                      >
                        Excluir
                      </button>
                      <button 
                        onClick={() => iniciarEdicao(cliente)}
                        className="btn btn-warning btn-sm"
                        style={{ padding: '4px 8px' }}
                      >
                        Editar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UsuarioList;