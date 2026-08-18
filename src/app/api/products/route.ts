// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const { rows } = await pool.query('SELECT * FROM products'); // Supondo que você tenha uma tabela chamada "products"
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.error();
    }
}

export async function PUT(request: Request) {
    try {
        const { id, name, price } = await request.json();
        const { rows } = await pool.query(
            'UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *',
            [name, price, id]
        );
        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.error();
    }
}
