import apiClient from '../api/apiClient';

class UsuarioService {
  // Buscar todos os clientes
  async getAllUsuarios() {
    try {
      const response = await apiClient.get('/Clientes'); // Rota correta: /Clientes
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  }

  // Buscar cliente por ID
  async getUsuarioById(id) {
    try {
      const response = await apiClient.get(`/Clientes/${id}`); // Rota correta: /Clientes/{id}
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar cliente ${id}:`, error);
      throw error;
    }
  }

  // Criar novo cliente
  async createUsuario(usuario) {
    try {
      console.log('Dados do usuário a serem criados:', usuario);
      const clienteFormatado = {
        nome: usuario.nome || usuario.Nome,
        email: usuario.email || usuario.Email,
        cpf: (usuario.cpf || usuario.CPF || '').replace(/\D/g, ''), // Remover formatação
        status: usuario.status || usuario.Status || 'Ativo',
        dataNascimento: this.formatarDataParaBackend(usuario.dataNascimento || usuario.DataNascimento)
      };

      // Validações
      if (!clienteFormatado.nome || !clienteFormatado.email || !clienteFormatado.cpf) {
        throw new Error('Nome, email e CPF são obrigatórios');
      }

      if (clienteFormatado.cpf.length !== 11) {
        throw new Error('CPF deve ter 11 dígitos');
      }

      const response = await apiClient.post('/Clientes', clienteFormatado);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }

  // Atualizar cliente existente
  async updateUsuario(id, usuario) {
    try {
      // Formatar dados para enviar ao backend .NET
      const clienteFormatado = {
        nome: usuario.nome || usuario.Nome,
        email: usuario.email || usuario.Email,
        cpf: usuario.cpf ? usuario.cpf.replace(/\D/g, '') : usuario.CPF?.replace(/\D/g, ''),
        status: usuario.status || usuario.Status || 'Ativo',
        dataNascimento: this.formatarDataParaBackend(usuario.dataNascimento || usuario.DataNascimento)
      };

      // Validações
      if (!clienteFormatado.nome || !clienteFormatado.email || !clienteFormatado.cpf) {
        throw new Error('Nome, email e CPF são obrigatórios');
      }

      if (clienteFormatado.cpf.length !== 11) {
        throw new Error('CPF deve ter 11 dígitos');
      }

      const response = await apiClient.put(`/Clientes/${id}`, clienteFormatado);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar cliente ${id}:`, error);
      throw error;
    }
  }

  // Excluir cliente
  async deleteUsuario(id) {
    try {
      const response = await apiClient.delete(`/Clientes/${id}`); // Rota correta: /Clientes/{id}
      return response.data || { success: true };
    } catch (error) {
      console.error(`Erro ao excluir cliente ${id}:`, error);
      throw error;
    }
  }

  // Buscar cliente por CPF
  async getUsuarioByCpf(cpf) {
    try {
      // Pode fazer uma busca filtrada ou implementar endpoint específico
      // Se não tiver endpoint específico, buscar todos e filtrar
      const response = await apiClient.get('/Clientes');
      const cpfLimpo = cpf.replace(/\D/g, '');
      const cliente = response.data.find(c => c.cpf === cpfLimpo);
      
      if (!cliente) {
        throw new Error('Cliente não encontrado');
      }
      
      return cliente;
    } catch (error) {
      console.error(`Erro ao buscar cliente por CPF ${cpf}:`, error);
      throw error;
    }
  }

  // Validar email único
  async checkEmailDisponivel(email, idExcluir = null) {
    try {
      // Buscar todos os clientes
      const response = await apiClient.get('/Clientes');
      const emailEmUso = response.data.find(cliente => {
        const mesmoEmail = cliente.email === email;
        const mesmoId = idExcluir && cliente.id === parseInt(idExcluir);
        return mesmoEmail && !mesmoId;
      });
      
      return { disponivel: !emailEmUso };
    } catch (error) {
      console.error('Erro ao validar email:', error);
      throw error;
    }
  }

  // Método auxiliar para formatar data
  formatarDataParaBackend(data) {
    if (!data) return null;
    
    if (data instanceof Date) {
      return data.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    }
    
    if (typeof data === 'string') {
      // Tentar converter string para data
      const dataObj = new Date(data);
      if (!isNaN(dataObj.getTime())) {
        return dataObj.toISOString().split('T')[0];
      }
    }
    
    return null;
  }

  // Método auxiliar para formatar CPF para exibição
  formatarCPF(cpf) {
    if (!cpf) return '';
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return cpf;
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  // Método auxiliar para formatar data para exibição
  formatarDataExibicao(data) {
    if (!data) return '';
    const dataObj = new Date(data);
    return dataObj.toLocaleDateString('pt-BR');
  }

  // Método para alterar status do cliente
  async alterarStatusUsuario(id, status) {
    try {
      // Primeiro buscar o cliente atual
      const clienteAtual = await this.getUsuarioById(id);
      
      // Atualizar apenas o status
      const dadosAtualizacao = {
        nome: clienteAtual.nome,
        email: clienteAtual.email,
        cpf: clienteAtual.cpf,
        status: status,
        dataNascimento: clienteAtual.dataNascimento.split('T')[0]
      };
      
      const response = await apiClient.put(`/Clientes/${id}`, dadosAtualizacao);
      return response.data;
    } catch (error) {
      console.error(`Erro ao alterar status do cliente ${id}:`, error);
      throw error;
    }
  }

  // Método para buscar clientes com filtros
  async buscarComFiltros(filtros = {}) {
    try {
      const response = await apiClient.get('/Clientes');
      let clientes = response.data;
      
      // Aplicar filtros no frontend (ou implementar no backend)
      if (filtros.nome) {
        clientes = clientes.filter(c => 
          c.nome.toLowerCase().includes(filtros.nome.toLowerCase())
        );
      }
      
      if (filtros.status) {
        clientes = clientes.filter(c => c.status === filtros.status);
      }
      
      if (filtros.email) {
        clientes = clientes.filter(c => 
          c.email.toLowerCase().includes(filtros.email.toLowerCase())
        );
      }
      
      return clientes;
    } catch (error) {
      console.error('Erro ao buscar clientes com filtros:', error);
      throw error;
    }
  }
}

export default new UsuarioService();