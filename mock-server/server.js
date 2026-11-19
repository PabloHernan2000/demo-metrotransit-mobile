/**
 * MetroTransit Mock Backend & Real-Time Telemetry Server
 * Simulates REST endpoints and high-frequency WebSocket GPS telemetry for public demo evaluation.
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Socket.io Telemetry Server
const io = new Server(server, {
  path: '/metrotransit/socket.io',
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Simulated Transit Fleet Coordinates (Metropolitan Hub)
const simulatedVehicles = [
  { id: 'BUS-01', line: 'LINE-1-EXPRESS', lat: 20.1235, lng: -98.7365, speed: 42, direction: 'Norte' },
  { id: 'BUS-02', line: 'LINE-2-RAPID', lat: 20.1190, lng: -98.7410, speed: 38, direction: 'Sur' },
  { id: 'BUS-03', line: 'LINE-4-LOOP', lat: 20.1085, lng: -98.7520, speed: 25, direction: 'Este' },
  { id: 'BUS-04', line: 'LOCAL-PARADOR', lat: 20.1340, lng: -98.7290, speed: 31, direction: 'SurEste' },
];

io.on('connection', (socket) => {
  console.log(`[WebSocket] Client connected: ${socket.id}`);

  // Push initial vehicle snapshot
  socket.emit('vehicles:snapshot', simulatedVehicles);

  socket.on('disconnect', () => {
    console.log(`[WebSocket] Client disconnected: ${socket.id}`);
  });
});

// Broadcast periodic GPS movement every 3 seconds
setInterval(() => {
  simulatedVehicles.forEach((vehicle) => {
    // Small realistic delta jitter (~10-30 meters)
    const latDelta = (Math.random() - 0.48) * 0.0008;
    const lngDelta = (Math.random() - 0.48) * 0.0008;
    vehicle.lat = parseFloat((vehicle.lat + latDelta).toFixed(6));
    vehicle.lng = parseFloat((vehicle.lng + lngDelta).toFixed(6));
    vehicle.speed = Math.floor(20 + Math.random() * 30);
  });

  io.emit('vehicles:update', simulatedVehicles);
}, 3000);

// --- REST Endpoints ---

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'MetroTransit Mock API', timestamp: new Date().toISOString() });
});

// System Theme & Feature Flags
app.get('/v1/api/usuario-gestor/modo-veda', (req, res) => {
  res.json({
    status: 'success',
    data: { veda_electoral: false, maintenance_mode: false }
  });
});

app.get('/v1/api/usuario-gestor/modo-navidad', (req, res) => {
  res.json({
    status: 'success',
    data: { modo_navidad: false, seasonal_theme: false }
  });
});

// Support and Contact Information
app.get('/v1/api/support/info', (req, res) => {
  res.json({
    status: 'success',
    data: {
      direccion: 'Metropolitan Transit Center, Central Blvd 100',
      telefono: '800-555-0199',
      correo: 'support@metrotransit.dev'
    }
  });
});

// Authentication Mock
app.post('/v1/auth/login', (req, res) => {
  const { correoElectronico, password } = req.body;
  if (!correoElectronico) {
    return res.status(400).json({ status: 'error', msg: 'Email is required' });
  }

  return res.json({
    status: 'success',
    token: 'jwt_mock_token_for_portfolio_evaluation_77491028',
    user: {
      name: 'Demo Reviewer',
      email: correoElectronico
    }
  });
});

// Broadcast Notifications
app.get('/v1/messages', (req, res) => {
  res.json({
    status: 'success',
    messages: [
      {
        id: 'msg-1',
        title: 'Metro Line 1 Express On Schedule',
        body: 'All central corridor units operating with normal 5-minute headways.',
        date: new Date().toISOString()
      }
    ]
  });
});

server.listen(PORT, () => {
  console.log(`[MetroTransit Mock API] Running on http://localhost:${PORT}`);
  console.log(`[MetroTransit Socket.io] Telemetry streaming on path /metrotransit/socket.io`);
});
