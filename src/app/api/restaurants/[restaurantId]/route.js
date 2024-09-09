import { Pool } from 'pg';
import { NextResponse } from 'next/server';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function GET(req) {
    const { restaurantId } = req.nextUrl.pathname.split('/').pop();

    try {
        const client = await pool.connect();
        const result = await client.query(`
            SELECT r.restaurant_id, r.name, r.location, r.price_range, f.type_name AS food_type, r.hours_of_operation, r.description, rp.image_url AS image_url
            FROM Restaurants r
            JOIN Restaurant_Food_Types rft ON r.restaurant_id = rft.restaurant_id
            JOIN Food_Types f ON rft.food_type_id = f.food_type_id
            LEFT JOIN Restaurant_Pictures rp ON r.restaurant_id = rp.restaurant_id
            WHERE r.restaurant_id = $1
        `, [restaurantId]);
        client.release();

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
        }

        const restaurant = result.rows[0];

        // Fetch menu images if needed
        const menuImages = await client.query(`
            SELECT image_url
            FROM Restaurant_Pictures
            WHERE restaurant_id = $1 AND photo_type_id = 1
        `, [restaurantId]);

        return NextResponse.json({
            ...restaurant,
            menu_images: menuImages.rows.map(row => row.image_url)
        });
    } catch (error) {
        console.error('Error fetching restaurant details:', error);
        return NextResponse.json({ error: 'Failed to fetch restaurant details' }, { status: 500 });
    }
}
