import express from 'express';
import player_sleeper_router from './routes/player_sleeper';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/error_handler';
import { invalid_endpoint } from './errors/endpoint_not_found';
import cors from 'cors'
const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};


app.use(cors(corsOptions));
app.use(express.json())
app.use(logger)
app.use('/sleeper_player', player_sleeper_router)
app.use(invalid_endpoint)
app.use(errorHandler)
app.get('/healthcheck', (req, res) => {
    res.send("Healthy");
});

export default app