import { memo, type FC } from 'react';

const Products: FC = memo(() => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Products Management</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Add Product
                </button>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Products list will be displayed here</p>
            </div>
        </div>
    );
});

Products.displayName = 'Products';

export default Products;
