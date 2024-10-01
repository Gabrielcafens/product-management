// src/app.ts
import express from 'express';
import sequelize from './config/database';
import productRoutes from './routes/product';

const app = express();
app.use(express.json()); // Middleware para analisar JSON

// Usando as rotas de produtos
app.use('/api/products', productRoutes);

// Inicializando o servidor e a conexão com o banco de dados
const startServer = async () => {
  try {
    await sequelize.sync(); // Sincronizando o banco de dados
    app.listen(3000, () => {
      console.log('Servidor rodando na porta 3000');
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
  }
};

startServer();
