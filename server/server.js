import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateHandler, healthHandler } from './api-handlers.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.post('/api/generate', generateHandler);
app.get('/api/health', healthHandler);

app.listen(PORT, () => {
  console.log(`StudyFlow AI server running on http://localhost:${PORT}`);
});
