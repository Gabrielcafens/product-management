'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaTrashAlt, FaEdit, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { HiPlus } from 'react-icons/hi';
interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    available: boolean;
}

const productSchema = z.object({
    name: z.string().min(1, 'O nome é obrigatório'),
    description: z.string().optional(),
    price: z.number().positive('O preço deve ser um número positivo'),
    available: z.boolean(),
});

const ITEMS_PER_PAGE = 5;

const HomePage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [newProduct, setNewProduct] = useState<Product>({ id: 0, name: '', description: '', price: 0, available: true });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [confirmDeleteProduct, setConfirmDeleteProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const formattedProducts = data.map((product: Product) => ({
                    ...product,
                    price: typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0,
                }));
                setProducts(formattedProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleCreateProduct = () => {
        try {
            productSchema.parse(newProduct);
            setProducts((prev) => [...prev, { ...newProduct, id: Date.now() }]);
            closeCreateDialog();
        } catch (e) {
            handleValidationErrors(e);
        }
    };

    const handleUpdateProduct = () => {
        if (confirmDeleteProduct) {
            try {
                productSchema.parse(newProduct);
                setProducts((prev) =>
                    prev.map((p) => (p.id === confirmDeleteProduct.id ? { ...p, ...newProduct } : p))
                );
                closeEditDialog();
            } catch (e) {
                handleValidationErrors(e);
            }
        }
    };

    const handleDeleteProduct = () => {
        if (confirmDeleteProduct) {
            setProducts((prev) => prev.filter((p) => p.id !== confirmDeleteProduct.id));
            closeDeleteDialog();
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

    const handleSort = () => {
        const sortedProducts = [...products].sort((a, b) => {
            return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
        });
        setProducts(sortedProducts);
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const handleValidationErrors = (e: unknown) => {
        if (e instanceof z.ZodError) {
            const formErrors = e.errors.reduce((acc, curr) => {
                acc[curr.path[0]] = curr.message;
                return acc;
            }, {} as { [key: string]: string });
            setErrors(formErrors);
        }
    };
    const closeCreateDialog = () => {
        setIsCreateDialogOpen(false);
        resetProductForm();
    };

    const closeEditDialog = () => {
        setIsEditDialogOpen(false);
        resetProductForm();
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setConfirmDeleteProduct(null);
    };

    const resetProductForm = () => {
        setNewProduct({ id: 0, name: '', description: '', price: 0, available: true });
        setErrors({});
    };

    return (
        <div className="flex flex-col p-4 space-y-4">
            <h1 className="text-2xl font-bold">Lista de Produtos</h1>
            <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
                <Input
                    placeholder="Buscar por nome do produto"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-1/2"
                />
                <Button onClick={handleSort} className="ml-4 flex items-center">
                    {sortOrder === 'asc' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                    Ordenar pelo Preço ({sortOrder === 'asc' ? 'Crescente' : 'Decrescente'})
                </Button>
                <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    variant="outline"
                    className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white ml-2 flex items-center"
                >
                    <HiPlus className="mr-1" /> Criar Novo Produto
                </Button>
            </div>

            {/* Product Table */}
            <Table>
                <TableCaption>Uma lista dos produtos disponíveis.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nome do produto</TableHead>
                        <TableHead> Descrição do produto</TableHead>
                        <TableHead className="text-right">Valor do produto (R$)</TableHead>
                        <TableHead> Disponível para venda</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedProducts.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.id}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.description}</TableCell>
                            <TableCell className="text-right">{product.price.toFixed(2)}</TableCell>
                            <TableCell>{product.available ? 'Sim' : 'Não'}</TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    onClick={() => { setConfirmDeleteProduct(product); setIsEditDialogOpen(true); setNewProduct(product); }}
                                    className="mr-2 text-blue-500 hover:bg-blue-100"
                                >
                                    <FaEdit />
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => { setConfirmDeleteProduct(product); setIsDeleteDialogOpen(true); }}
                                    className="text-red-500 hover:bg-red-100"
                                >
                                    <FaTrashAlt />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={6} className="text-center">
                            <Button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Anterior
                            </Button>
                            <span className="mx-2">Página {currentPage} de {totalPages}</span>
                            <Button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Próximo
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>

            {/* Create Product Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={closeCreateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Criar Novo Produto</DialogTitle>
                        <DialogDescription>Preencha as informações do produto.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col">
                        <label htmlFor="product-name" className="mt-2 mb-2">Nome do produto</label>
                        <Input
                            id="product-name"
                            placeholder="Nome do produto"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                        {errors.name && <span className="text-red-600">{errors.name}</span>}

                        <label htmlFor="product-description" className="mt-2 mb-2"> Descrição do produto</label>
                        <Input
                            id="product-description"
                            placeholder="Descrição do produto"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            className="mt-2"
                        />

                        <label htmlFor="product-price" className="mt-2 mb-2">Valor do produto</label>
                        <Input
                            id="product-price"
                            placeholder="Valor do produto"
                            type="number"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                            className="mt-2"
                        />
                        {errors.price && <span className="text-red-600">{errors.price}</span>}

                        <label htmlFor="product-availability" className="mt-2 mb-2">Disponível para venda?</label>
                        <Select
                            value={newProduct.available ? 'sim' : 'não'}
                            onValueChange={(value) => setNewProduct({ ...newProduct, available: value === 'sim' })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Escolha" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="sim">Sim</SelectItem>
                                    <SelectItem value="não">Não</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleCreateProduct}>Criar</Button>
                        <Button type="button" variant="outline" onClick={closeCreateDialog}>Cancelar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Product Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={closeEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Produto</DialogTitle>
                        <DialogDescription>Atualize as informações do produto.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col">
                        <label htmlFor="product-name" className="mt-2 mb-2">Nome do produto</label>
                        <Input
                            id="product-name"
                            placeholder="Nome do produto"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                        {errors.name && <span className="text-red-600">{errors.name}</span>}

                        <label htmlFor="product-description" className="mt-2 mb-2"> Descrição do produto</label>
                        <Input
                            id="product-description"
                            placeholder=" Descrição do produto"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            className="mt-2"
                        />

                        <label htmlFor="product-price" className="mt-2 mb-2">Valor do produto</label>
                        <Input
                            id="product-price"
                            placeholder="Valor do produto"
                            type="number"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                            className="mt-2"
                        />
                        {errors.price && <span className="text-red-600">{errors.price}</span>}

                        <label htmlFor="product-availability" className="mt-2 mb-2">Disponível para venda?</label>
                        <Select
                            value={newProduct.available ? 'sim' : 'não'}
                            onValueChange={(value) => setNewProduct({ ...newProduct, available: value === 'sim' })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Escolha" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="sim">Sim</SelectItem>
                                    <SelectItem value="não">Não</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleUpdateProduct}>Atualizar</Button>
                        <Button type="button" variant="outline" onClick={closeEditDialog}>Cancelar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Product Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={closeDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Excluir Produto</DialogTitle>
                        <DialogDescription>Tem certeza que deseja excluir este produto?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" onClick={handleDeleteProduct} className="bg-red-500 text-white">Excluir</Button>
                        <Button type="button" variant="outline" onClick={closeDeleteDialog}>Cancelar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HomePage;
