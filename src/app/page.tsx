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

const ITEMS_PER_PAGE = 5;

const HomePage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [confirmDeleteProduct, setConfirmDeleteProduct] = useState<Product | null>(null);
    const [newProduct, setNewProduct] = useState<Product>({ id: 0, name: '', description: '', price: 0, available: false });

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch('/api/products');
            const data = await response.json();
            const formattedProducts = data.map((product: Product) => ({
                ...product,
                price: typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0, // Ensure price is a number
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

    const handleCreateProduct = () => {
        setProducts((prev) => [...prev, { ...newProduct, id: Date.now() }]);
        setIsCreateDialogOpen(false);
        setNewProduct({ id: 0, name: '', description: '', price: 0, available: false }); // Reset form
    };

    const handleUpdateProduct = () => {
        if (selectedProduct) {
            setProducts((prev) => prev.map((p) => (p.id === selectedProduct.id ? { ...selectedProduct, ...newProduct } : p)));
            setIsEditDialogOpen(false);
            setSelectedProduct(null);
            setNewProduct({ id: 0, name: '', description: '', price: 0, available: false }); // Reset form
        }
    };

    const handleDeleteProduct = (id: number) => {
        setProducts((prev) => prev.filter((product) => product.id !== id));
        setIsDeleteDialogOpen(false);
        setConfirmDeleteProduct(null);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

    return (
        <div className="flex flex-col p-4 space-y-4">
            <h1 className="text-2xl font-bold">Lista de Produtos</h1>
            <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
                <Input
                    placeholder="Buscar por nome"
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

            {/* Tabela de Produtos */}
            <Table>
                <TableCaption>Uma lista dos produtos disponíveis.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Preço (R$)</TableHead>
                        <TableHead>Disponível</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedProducts.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.id}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.description}</TableCell>
                            <TableCell className="text-right">{typeof product.price === 'number' ? product.price.toFixed(2) : 'Preço inválido'}
                            </TableCell>
                            <TableCell>{product.available ? 'Sim' : 'Não'}</TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    onClick={() => { setSelectedProduct(product); setIsEditDialogOpen(true); setNewProduct(product); }}
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
                                Próxima
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>

            {/* Dialog para Criar Produto */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Criar Novo Produto</DialogTitle>
                        <DialogDescription>
                            Preencha os detalhes do novo produto.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Produto</label>
                        <Input
                            placeholder="Nome"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            className="mb-2"
                        />
                        <label className="block text-sm font-medium text-gray-700 mb-2">Descrição do Produto</label>
                        <Input
                            placeholder="Descrição"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            className="mb-2"
                        />
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preço</label>
                         <Input
                                placeholder="Preço"
                                type="number"
                                value={newProduct.price || ''}
                                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                                className="mb-2"
                            />

                        <label className="block text-sm font-medium text-gray-700 mb-2">Disponível</label>
                        <Select
                            onValueChange={(value) => setNewProduct({ ...newProduct, available: value === 'Sim' })}
                            value={newProduct.available ? 'Sim' : 'Não'}
                        >
                            <SelectTrigger className="mb-2">
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="Sim">Sim</SelectItem>
                                    <SelectItem value="Não">Não</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleCreateProduct}>Criar</Button>
                        <Button onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog para Editar Produto */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Produto</DialogTitle>
                        <DialogDescription>
                            Atualize os detalhes do produto selecionado.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Produto</label>
                        <Input
                            placeholder="Nome"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            className="mb-2"
                        />
                        <label className="block text-sm font-medium text-gray-700 mb-2">Descrição do Produto</label>
                        <Input
                            placeholder="Descrição"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            className="mb-2"
                        />
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preço</label>
                        <Input
                            placeholder="Preço"
                            type="number"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                            className="mb-2"
                        />
                        <label className="block text-sm font-medium text-gray-700 mb-2">Disponível</label>
                        <Select
                            onValueChange={(value) => setNewProduct({ ...newProduct, available: value === 'Sim' })}
                            value={newProduct.available ? 'Sim' : 'Não'}
                        >
                            <SelectTrigger className="mb-2">
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="Sim">Sim</SelectItem>
                                    <SelectItem value="Não">Não</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleUpdateProduct}>Salvar</Button>
                        <Button onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog para Confirmar Exclusão */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Excluir Produto</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir o produto "{confirmDeleteProduct?.name}"?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => handleDeleteProduct(confirmDeleteProduct!.id)} className="text-red-500">
                            Excluir
                        </Button>
                        <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HomePage;
