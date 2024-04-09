import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? 'https://bingo-socket-server.onrender.com' : 'http://localhost:4000';

export const socket = io(URL);