import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/health', healthRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
