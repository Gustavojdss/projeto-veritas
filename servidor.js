// backend/server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Importa o bcrypt
const db = require('./database');  // ✅ CERTO

const app = express();
const port = process.env.PORT || 3001;
const saltRounds = 10; // Custo do hash para bcrypt

// Middlewares
app.use(cors()); // Permite requisições do seu frontend (localhost:portafacade)

// Diz pro servidor: "Pode entregar os arquivos dessa pasta (HTML, CSS, JS)"
app.use(express.static(__dirname)); 
// ---------------------

// ... (resto das rotas /api/usuarios, etc.)
app.use(express.json()); // Processa corpo das requisições como JSON

// --- ROTAS DA API ---

// 1. Rota de Cadastro de Novo Usuário (POST /api/usuarios)
app.post('/api/usuarios', async (req, res) => {
  const { nome, cpf, telefone, senha } = req.body;

  // Validação básica de campos
  if (!nome || !cpf || !telefone || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  // Limpa CPF e Telefone (apenas números)
  const cpfClean = cpf.replace(/\D/g, '');
  const telefoneClean = telefone.replace(/\D/g, '');

  try {
    // 1. Gerar o hash da senha de forma assíncrona
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // 2. Inserir no banco de dados
    const [result] = await db.query(
      'INSERT INTO usuarios (nome, cpf, telefone, senha_hash) VALUES (?, ?, ?, ?)',
      [nome, cpfClean, telefoneClean, senhaHash]
    );

    // 3. Resposta de sucesso
    res.status(201).json({ 
        message: 'Usuário cadastrado com sucesso!', 
        userId: result.insertId,
        nome: nome 
    });

  } catch (error) {
    console.error('Erro no cadastro:', error);
    // Erro de CPF duplicado (código MySQL: 1062)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Este CPF já está cadastrado.' });
    }
    res.status(500).json({ error: 'Erro interno do servidor ao cadastrar usuário.' });
  }
});

// 2. Rota de Login (POST /api/login)
app.post('/api/login', async (req, res) => {
  const { cpf, senha } = req.body;

  if (!cpf || !senha) {
    return res.status(400).json({ error: 'CPF e senha são obrigatórios.' });
  }

  const cpfClean = cpf.replace(/\D/g, '');

  try {
    // 1. Buscar usuário pelo CPF
    const [rows] = await db.query('SELECT id, nome, senha_hash FROM usuarios WHERE cpf = ?', [cpfClean]);
    
    const user = rows[0];

    if (!user) {
      // Usuário não encontrado
      return res.status(401).json({ error: 'CPF ou senha incorretos.' });
    }

    // 2. Comparar a senha fornecida com o hash armazenado
    const match = await bcrypt.compare(senha, user.senha_hash);

    if (!match) {
      // Senha incorreta
      return res.status(401).json({ error: 'CPF ou senha incorretos.' });
    }

    // 3. Login bem-sucedido
    // Em um sistema real, aqui você geraria um token JWT
    res.status(200).json({ 
        message: 'Login realizado com sucesso!', 
        user: { id: user.id, nome: user.nome } 
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao tentar login.' });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});