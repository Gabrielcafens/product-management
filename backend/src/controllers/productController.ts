// src/controllers/productController.ts
import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';


// Função para criar um produto
export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
      const newProduct = req.body; // Pegar os dados do corpo da requisição
      // Aqui você deve adicionar lógica para salvar o produto no banco de dados

      // Supondo que o produto foi salvo com sucesso, você pode enviar uma resposta
      res.status(201).json({
          message: 'Produto criado com sucesso!',
          product: newProduct, // ou o produto salvo, se você tiver
      });
  } catch (error) {
      next(error);
  }
};

// Função para listar todos os produtos
export const listProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await Product.findAll({ order: [['price', 'ASC']] });
    res.json(products);
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};

// Função para buscar um produto pelo ID
export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ error: 'Produto não encontrado.' });
      return;
    }
    res.json(product);
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};

// Função para atualizar um produto
export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { name, description, price, available } = req.body;

  try {
    const [updated] = await Product.update(
      { name, description, price, available },
      { where: { id } }
    );
    if (!updated) {
      res.status(404).json({ error: 'Produto não encontrado.' });
      return;
    }
    const updatedProduct = await Product.findByPk(id);
    res.json(updatedProduct);
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};

// Função para deletar um produto
export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    const deleted = await Product.destroy({ where: { id } });
    if (!deleted) {
      res.status(404).json({ error: 'Produto não encontrado.' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};
