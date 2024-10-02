// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    available: boolean;
}

const ITEMS_PER_PAGE = 5;

const HomePage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch('/api/products');
            const data = await response.json();

            // Converte o preço de string para número
            const formattedProducts = data.map((product: Product) => ({
                ...product,
                price: parseFloat(product.price),
            }));

            setProducts(formattedProducts);
        };

        fetchProducts();
    }, []);

    const handleSort = () => {
        const sortedProducts = [...products].sort((a, b) => {
            return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
        });
        setProducts(sortedProducts);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleCreateNewProduct = () => {
        alert('Função de criar novo produto ainda não implementada.');
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Lista de Produtos</h1>
            <div className="flex justify-between mb-4">
                <Input
                    placeholder="Buscar por nome"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-1/2"
                />
                <Button onClick={handleSort} className="ml-4">
                    Ordenar pelo Preço ({sortOrder === 'asc' ? 'Crescente' : 'Decrescente'})
                </Button>
                <Button onClick={handleCreateNewProduct} variant="primary" className="ml-2">
                    Criar Novo Produto
                </Button>
            </div>
            <Table>
                <TableCaption>Uma lista dos produtos disponíveis.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Preço</TableHead>
                        <TableHead>Disponível</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedProducts.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.id}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.description}</TableCell>
                            <TableCell className="text-right">R$ {product.price.toFixed(2)}</TableCell>
                            <TableCell>{product.available ? 'Sim' : 'Não'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4} className="text-right">
                            Página {currentPage} de {totalPages}
                        </TableCell>
                        <TableCell>
                            <div className="flex justify-end">
                                <Button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="mr-2"
                                >
                                    Anterior
                                </Button>
                                <Button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Próximo
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
};

export default HomePage;
