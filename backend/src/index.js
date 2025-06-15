// Module imports
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors';

// Local imports
import connectDB from './config/dbConfig.js';
import { serverConfig } from './config/serverConfig.js';
import ApiRoutes from './routes/index.js'
import { app, server } from './lib/socket.js';
import path from "path"

const __dirname = path.resolve();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use('/api', ApiRoutes);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

app.get('/', (req, res) => {
    res.send('Chat Application Backend');
})

server.listen(serverConfig.PORT, () => {
    console.log(`\nServer is listening on http://localhost:${serverConfig.PORT}`);
    connectDB();
})