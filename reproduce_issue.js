
const vendors = [
    { price: '₹100 for two', distance: '0.8 km', rating: 4.5 },
    { price: 100, distance: '1.2 km', rating: 4.0 },
    { price: '₹200', distance: 0.5, rating: 5.0 }, // distance as number
    { distance: '1.0 km', rating: '3.5' }, // rating as string
    { price: null, distance: null, rating: null }, // nulls
    { price: {}, distance: {}, rating: {} } // objects
];

const sortKeys = ['price_low', 'price_high', 'rating', 'distance'];

const getPriceValue = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
        return parseFloat(price.replace('₹', '').replace(' for two', '')) || 0;
    }
    return 0;
};

vendors.forEach(v => console.log('Vendor:', JSON.stringify(v)));

sortKeys.forEach(key => {
    console.log(`\nSorting by ${key}...`);
    try {
        const sorted = [...vendors].sort((a, b) => {
            switch (key) {
                case 'price_low':
                    return getPriceValue(a.price) - getPriceValue(b.price);
                case 'price_high':
                    return getPriceValue(b.price) - getPriceValue(a.price);
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0);
                case 'distance':
                    return parseFloat(a.distance || '0') - parseFloat(b.distance || '0');
                default:
                    return 0;
            }
        });
        console.log('Success');
    } catch (error) {
        console.error(`Failed to sort by ${key}:`, error.message);
    }
});
