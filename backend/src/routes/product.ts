// src/routes/product.ts
import { Router } from 'express';
import {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';

const router = Router();

// Rota para criar um novo produto
router.post('/', createProduct);

// Rota para listar todos os produtos
router.get('/', listProducts);

// Rota para buscar um produto pelo ID
router.get('/:id', getProductById);

// Rota para atualizar um produto
router.put('/:id', updateProduct);

// Rota para deletar um produto
router.delete('/:id', deleteProduct);

export default router;
