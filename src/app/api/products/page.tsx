// src/app/products/page.tsx
'use client'
import { useEffect, useState } from 'react';

interface Product {
    id: number;
    name: string;
    price: number;
}

const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [newName, setNewName] = useState('');
    const [newPrice, setNewPrice] = useState<number>(0);

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data);
        };

        fetchProducts();
    }, []);

    const handleEditClick = (product: Product) => {
        setEditingProduct(product);
        setNewName(product.name);
        setNewPrice(product.price);
    };

    const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingProduct) {
            const updatedProduct = { ...editingProduct, name: newName, price: newPrice };
            try {
                const res = await fetch('/api/products', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedProduct),
                });

                if (res.ok) {
                    const updatedProducts = products.map(product =>
                        product.id === editingProduct.id ? updatedProduct : product
                    );
                    setProducts(updatedProducts);
                    setEditingProduct(null);
                    setNewName('');
                    setNewPrice(0);
                } else {
                    console.error('Erro ao atualizar o produto');
                }
            } catch (error) {
                console.error('Erro:', error);
            }
        }
    };

    return (
        <div>
            <h1>Lista de Produtos</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Valor</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>
                                <button onClick={() => handleEditClick(product)}>Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editingProduct && (
                <div>
                    <h2>Editar Produto</h2>
                    <form onSubmit={handleUpdateProduct}>
                        <div>
                            <label>
                                Nome:
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Valor:
                                <input
                                    type="number"
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(Number(e.target.value))}
                                    required
                                />
                            </label>
                        </div>
                        <button type="submit">Atualizar Produto</button>
                        <button type="button" onClick={() => setEditingProduct(null)}>Cancelar</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
