import { memo, type FC } from 'react';

const Dashboard: FC = memo(() => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">1,234</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">567</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">890</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm font-medium">Revenue</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">$45,678</p>
                </div>
            </div>
        </div>
    );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
