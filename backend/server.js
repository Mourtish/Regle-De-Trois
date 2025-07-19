const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: 'http://localhost:3000' } });
const PORT = process.env.PORT || 3001;

// Initialize Prisma with retry logic
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
async function connectWithRetry(retries = 15, delay = 5000) {
  console.log('Attempting to connect to database:', process.env.DATABASE_URL.replace(/:password@/, ':***@'));
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      console.log('Prisma connected to database');
      return;
    } catch (error) {
      console.error(`Prisma connection failed, retry ${i + 1}/${retries}:`, error);
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Règle de Trois API is running!' });
});

app.get('/test-db', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ message: 'Database connection successful', users });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server after Prisma connection
connectWithRetry()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });
