require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados');
});

app.get('/', (req, res) => {
    res.send('Bem-vindo à API de Contatos!');
});

app.post('/contatos', (req, res) => {
    const { nome, telefone } = req.body;
    const p = nome.trim().split(' ');
    const v = p.filter(s => s.length > 0);
    
    if(v.length < 2){
        return res.status(400).json({error: 'O nome deve conter no mínimo duas palavras (nome e sobrenome)'});
    }

    const l = v.every(p => p.length >=3);
    if(!l){
        return res.status(400).json({error: 'Nome e sobrenome devem ter no mínimo 3 letras'})
    }

    const query = 'INSERT INTO contatos (nome, telefone) VALUES (?, ?)';
    connection.query(query, [nome, telefone], (err, results) => {
      if (err) {
        console.error('Erro ao inserir contato:', err);
        res.status(500).json({ error: 'Erro ao inserir contato' });
        return;
      }
      res.status(201).json({ id: results.insertId, nome: nome, telefone: telefone});
    });
});

app.get('/contatos', (req, res) => {
    const query = 'SELECT * FROM contatos';
    connection.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Erro ao buscar contatos' });
        return;
      }
      res.status(200).json(results);
    });
});

app.delete('/contatos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM contatos WHERE id = ?';
    connection.query(query, [id], (err, results) => {
      if (err) {
        console.error('Erro ao excluir contato:', err);
        res.status(500).json({ error: 'Erro ao excluir contato' });
        return;
      }
      res.status(204).set('X-Success-Message', 'Contato excluído com sucesso').send();
    });
});

app.patch('/contatos/:id', (req, res) => {
    const { id } = req.params;
    const {nome, telefone} = req.body;

    const p = nome.trim().split(' ');
    const v = p.filter(s => s.length > 0);
    
    if(v.length < 2){
        return res.status(400).json({error: 'O nome deve conter no mínimo duas palavras (nome e sobrenome)'});
    }

    const l = v.every(p => p.length >=3);
    if(!l){
        return res.status(400).json({error: 'Nome e sobrenome devem ter no mínimo 3 letras'})
    }

    const query = 'UPDATE contatos SET nome = ?, telefone = ? WHERE id = ?';
    connection.query(query, [nome, telefone, id], (err, results) => {
        if (err){
            console.error('Erro ao atualizar contato', err);
            res.status(500).json({error: 'Erro ao atulizar contato' });
            return;
        }
        res.status(200).json({ id: Number(id), nome, telefone });
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});