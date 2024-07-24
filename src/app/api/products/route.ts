import { db } from '@/lib/db/db';
import { products } from '@/lib/db/schema';
import { isServer, productSchema } from '@/lib/validators/productSchema';
import { desc } from 'drizzle-orm';
import { unlink, unlinkSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function POST(request: Request) {

    const data = await request.formData();

    let validatedData;
    try {
        validatedData = productSchema.parse({
            name: data.get('name'),
            description: data.get('description'),
            price: Number(data.get('price')),
            image: data.get('image'),
        });
    } catch (err) {
        return Response.json({ message: err }, { status: 400 });
    }

    const inputImage = isServer
        ? (validatedData.image as File)
        : (validatedData.image as FileList)[0];
    const filename = `${Date.now()}.${inputImage.name.split('.').slice(-1)}`; // choco.png 213123123123.png

    try {
        const buffer = Buffer.from(await inputImage.arrayBuffer());
        await writeFile(path.join(process.cwd(), 'public/assets', filename), buffer);
    } catch (err) {
        return Response.json({ message: 'Failed to save the file to fs' }, { status: 500 });
    }

    try {
        await db.insert(products).values({ ...validatedData, image: filename });
    } catch (err) {
        // todo: remove stored image from fs
        unlinkSync('public/assets/' + filename)
        return Response.json(
            { message: 'Failed to store product into the database' },
            { status: 500 }
        );
    }

    return Response.json({ message: 'OK' }, { status: 201 });
}

export async function GET() {
    try {
        const allProducts = await db.select().from(products).orderBy(desc(products.id));
        return Response.json(allProducts);
    } catch (err) {
        return Response.json({ message: 'Failed to fetch products' }, { status: 500 });
    }
}