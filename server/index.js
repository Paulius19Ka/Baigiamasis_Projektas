import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import usersRoutes from './routes/usersRoutes.js';
import postsRoutes from './routes/postsRoutes.js';
import repliesRoutes from './routes/repliesRoutes.js'

const PORT = process.env.PORT || 5501;
const corsOptions = {
  origin: "http://localhost:5173",
  exposedHeaders: ['Authorization']
};

const app = express();

app.use(express.json());
app.use(cors(corsOptions));

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

app.use('/users', usersRoutes);
app.use('/posts', postsRoutes);
app.use('/replies', repliesRoutes);

app.use((req, res) => {
  res.status(404).send({ error: `Your requested route does not exist.` });
});