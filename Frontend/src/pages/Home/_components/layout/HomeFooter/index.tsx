import { memo, type FC } from 'react';

const HomeFooter: FC = memo(() => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-gray-300">
                        © {currentYear} Your Company. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
});

HomeFooter.displayName = 'HomeFooter';

export default HomeFooter;
