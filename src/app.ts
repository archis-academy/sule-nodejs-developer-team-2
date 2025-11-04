import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoutes from './routes/health';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/health', healthRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(process.env.PORT);
  console.log('Server is running on port 3000');
});
