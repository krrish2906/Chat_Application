// Module imports
import express from 'express'
import cookieParser from 'cookie-parser'

// Local imports
import connectDB from './config/dbConfig.js';
import { serverConfig } from './config/serverConfig.js';
import ApiRoutes from './routes/index.js'

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api', ApiRoutes);

app.get('/', (req, res) => {
    res.send('Chat Application Backend');
})

app.listen(serverConfig.PORT, () => {
    console.log(`\nServer is listening on http://localhost:${serverConfig.PORT}`);
    connectDB();
})