"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Listar produtos (GET /products)
router.get('/', (req, res) => {
    res.send('Lista de produtos');
});
// Criar um novo produto (POST /products)
router.post('/', (req, res) => {
    const { name, description, price, available } = req.body;
    // Aqui vamos inserir a lógica de criar um produto no banco de dados
    res.send(`Produto ${name} criado com sucesso!`);
});
exports.default = router;
