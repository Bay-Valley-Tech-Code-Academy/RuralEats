'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function VendorPage({params}) {
    const [vendorItems, setVendorItems] = useState([]);
    const [newItemName, setNewItemName] = useState('');
    const [newItemDesc, setNewItemDesc] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState(null);
    const { restaurantId } = params;

    // Fetch vendor items on component mount
    useEffect(() => {
        console.log('Fetching restaurant with ID:', restaurantId);

        async function fetchRestaurant() {
            try {
                const response = await fetch(`/api/restaurants/${restaurantId}`);
                console.log('API Response:', response);
                
                if (!response.ok) {
                    throw new Error("Failed to fetch restaurant");
                }

                const data = await response.json();
                setRestaurant(data);
            } catch (error) {
                console.error("Error fetching restaurant data:", error);
            }
        }

        if (restaurantId) {
            fetchRestaurant();
        }
    }, [restaurantId]);

    useEffect(() => {
        async function fetchMenu() {
            try{
                const res = await fetch(`/api/menu`);
                const data = await res.json();
                setMenu(data);
                console.log(menu);
            }
            catch(error){
                console.error("Error fetching menu data:", error);
            }
        }

        if(restaurantId){
            fetchMenu();
        }
      }, []);

    if (!restaurant) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white text-lg text-black">
                Loading...
            </div>
        );
    }
    // toggles menu accordion
    const toggleMenuAccordion = () => {
        setMenuOpen(!menuOpen);
    };

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white text-lg text-black">
                <p>Error: {error}</p>
            </div>
        );
    }

    const justMenuItems = menu ? menu.filter(menuSection => Number(menuSection.restaurant_id) === Number(restaurantId)) : [];
    return (
        <div className="min-h-screen flex flex-col bg-Almond">
            <header className="w-full">
                <Navbar />
            </header>

            <main className="flex-grow w-full max-w-6xl mx-auto p-4 bg-white">
                <section className="mb-4 p-2">
                    <h1 className="text-3xl font-bold text-center text-black">
                        Vendor Items
                    </h1>
                </section>

                {/* Restaurant Content */}
                <section className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Image Section */}
                    <div className="relative w-full md:w-1/3 p-2 flex-shrink-0">
                        <img
                            src={`/images/${restaurant.image_url}` || '/default-image.jpg'} // Provide a default image if URL is missing
                            alt={`${restaurant.name} main dish`}
                            className="w-full h-auto object-cover rounded-lg"
                        />
                    </div>

                    {/* Restaurant Details */}
                    <div className="w-full md:w-2/3 flex flex-col gap-6">
                        {/* Contact Information */}
                        <div className="w-full p-2">
                            <div className="p-3 border border-gray-300 rounded-lg shadow-md" style={{ backgroundColor: '#AAD15F' }}>
                                <h2 className="text-2xl font-bold mb-2 text-black">
                                    Contact Information
                                </h2>
                                <p className="text-lg mb-6 text-black">
                                    <span className="font-semibold">Phone:</span>{" "}
                                    {restaurant.phone_number}
                                </p>
                                <p className="text-lg mb-6 text-black">
                                    <span className="font-semibold">Email:</span>{" "}
                                    {restaurant.email}
                                </p>
                                <p className="text-lg text-black">
                                    <span className="font-semibold">Address:</span>{" "}
                                    {restaurant.address}
                                </p>
                            </div>
                        </div>

                        {/* Price Range and Other Details */}
                        <div className="w-full p-2 ">
                            <div className="p-3 border border-gray-300 rounded-lg shadow-md bg-white hover:bg-slate-300">
                                <h2 className="text-2xl font-bold mb-2 text-black">Restaurant Details</h2>
                                <p className="text-lg mb-4 text-black">
                                    <span className="font-semibold">Price Range:</span> {restaurant.price_range}
                                </p>
                                <p className="text-lg mb-4 text-black">
                                    <span className="font-semibold">Rating:</span> {restaurant.rating || 'N/A'}
                                </p>
                                <p className="text-lg mb-4 text-black">
                                    <span className="font-semibold">Food Type:</span> {restaurant.food_type}
                                </p>
                            </div>
                        </div>

                        {/* Accordion for Menu */}
                        <div className="w-full p-2">
                            <div className="p-3 border border-gray-300 rounded-lg shadow-md bg-white">

                                <div className="border border-gray-200 rounded-lg">
                                    <button
                                        onClick={toggleMenuAccordion} // Toggle the accordion
                                        className="flex justify-between w-full px-4 py-2 text-left text-2xl font-bold mb-2 text-black bg-gray-100 rounded-lg focus:outline-none"
                                    >
                                        {menuOpen ? 'Hide Menu' : 'Show Menu'}
                                        <span className={`transform transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`}>
                                            ▼
                                        </span>
                                    </button>

                                    {menuOpen && (
                                        <div className="p-4 border-t border-gray-200">
                                            {justMenuItems && justMenuItems.length > 0 ? (
                                            justMenuItems.map((menuSection, index) => (
                                                <div key={index} className="mb-6">
                                                {/* Menu Section Title */}
                                                <h3 className="text-2xl font-bold text-black mb-2">
                                                    {menuSection.menu_name} {/* Section Name */}
                                                </h3>
                                                <p className="text-lg text-gray-600 mb-4">
                                                    {menuSection.menu_desc} {/* Section Description */}
                                                </p>

                                                {/* Menu Items */}
                                                <ul className="space-y-4">
                                                    {menuSection.items.map((item, itemIndex) => (
                                                    <li key={itemIndex} className="flex justify-between text-black">
                                                        <span className="font-semibold">{item.name}</span>
                                                        <span>${item.price}</span>
                                                    </li>
                                                    ))}
                                                </ul>
                                                </div>
                                            ))
                                            ) : (
                                            <p>No menu available.</p>
                                            )}
                                        </div>
                                        )}
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Back Button */}
                <section className="mt-4">
                    <a
                        href="/Pages/Restaurants"
                        className="bg-Kobicha text-rosey-brown rounded-lg hover:bg-Chocolate-cosmos hover:text-white px-6 py-3 text-sm font-semibold shadow-lg transition-transform transform hover:-translate-y-1"
                    >
                        Back to Restaurants
                    </a>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white mt-10">
                <Footer />
            </footer>
        </div>
    );
}
