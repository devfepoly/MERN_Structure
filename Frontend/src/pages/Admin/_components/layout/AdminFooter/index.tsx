import { memo, type FC } from 'react';

const AdminFooter: FC = memo(() => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 py-6">
                <div className="text-center">
                    <p className="text-gray-400 text-sm">
                        © {currentYear} Admin Dashboard. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
});

AdminFooter.displayName = 'AdminFooter';

export default AdminFooter;
