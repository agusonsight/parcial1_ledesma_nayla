import express from 'express';
import route from './src/routes/route.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(route);

app.get('/', (req, res) => {
  res.send('Hola je');
});

app.listen(PORT, () => {
  console.log(`El servidor está corriendo en http://localhost:${PORT}`);
});
