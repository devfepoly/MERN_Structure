import { memo, type FC } from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderDetail: FC = memo(() => {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link to="/admin/orders" className="text-blue-600 hover:text-blue-800">
                    ← Back to Orders
                </Link>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Detail</h1>
                <p className="text-gray-600">Order ID: {id}</p>
            </div>
        </div>
    );
});

OrderDetail.displayName = 'OrderDetail';

export default OrderDetail;
