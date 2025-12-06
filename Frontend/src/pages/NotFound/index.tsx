import { memo, type FC } from 'react'
import { Link } from 'react-router-dom'

const NotFound: FC = memo(() => {
    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100'>
            <div className='text-center'>
                <h1 className='text-9xl font-bold text-gray-800'>404</h1>
                <p className='text-2xl font-semibold text-gray-600 mt-4'>
                    Page Not Found
                </p>
                <p className='text-gray-500 mt-2 mb-8'>
                    The page you are looking for does not exist.
                </p>
                <Link
                    to='/'
                    className='inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                    Back to Home Here
                </Link>
            </div>
        </div>
    )
})

NotFound.displayName = 'NotFound'

export default NotFound
