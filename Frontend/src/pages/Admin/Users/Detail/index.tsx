import { memo, type FC } from 'react';
import { useParams, Link } from 'react-router-dom';

const UserDetail: FC = memo(() => {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link to="/admin/users" className="text-blue-600 hover:text-blue-800">
                    ← Back to Users
                </Link>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">User Detail</h1>
                <p className="text-gray-600">User ID: {id}</p>
            </div>
        </div>
    );
});

UserDetail.displayName = 'UserDetail';

export default UserDetail;
