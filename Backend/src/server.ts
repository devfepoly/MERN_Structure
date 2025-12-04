/**
 * Server Entry Point - TypeScript
 * Start the Express server
 */

import { Server } from 'http';
import app from './app';
import config from '@config/env';

// TODO: Connect to database before starting server

const PORT: number = config.port;

const server: Server = app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════════╗
    ║  Server running in ${config.env} mode     
    ║  Port: ${PORT}                           
    ║  URL: http://localhost:${PORT}           
    ╚══════════════════════════════════════════╝
    `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err);
    server.close(() => {
        process.exit(1);
    });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('💥 Process terminated!');
    });
});

export default server;
