import express from 'express';
import hash from './utils/hash';

const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello there 👀');
});

app.post('/event', (req, res) => {
  const { event } = req.body;

  if (!event) return res.status(400).json();

  const thing = {
    event,
    timestamp: Date.now(),
    hash: hash(req),
  };

  console.log('Event: ', thing, '\n');
  return res.status(200).json();
});

app.post('/pageview', (req, res) => {
  const thing = {
    event: 'pageview',
    timestamp: Date.now(),
    hash: hash(req),
  };
  console.log('Event: ', thing, '\n');
  return res.status(200).json();
});

app.listen(8000, () => {
  console.log('Listening on port 8000 \n');
});
