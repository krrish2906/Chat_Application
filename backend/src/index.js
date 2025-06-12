import express from 'express'





import { serverConfig } from './config/serverConfig.js';
import ApiRoutes from './routes/index.js'




const app = express();
app.use('/api', ApiRoutes);


app.listen(serverConfig.PORT, () => {
    console.log(`Server is listening on http://localhost:${serverConfig.PORT}`);
})