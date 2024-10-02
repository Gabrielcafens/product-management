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
