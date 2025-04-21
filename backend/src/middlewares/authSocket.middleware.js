// src/middlewares/authSocket.middleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../models/models');

module.exports = async function(socket, next) {
  try {
    // Récupérer le token depuis les headers de la requête
    const token = socket.handshake.auth.token || 
                 socket.handshake.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return next(new Error('Authentication error: Token required'));
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Récupérer l'utilisateur
    const user = await User.findById(decoded.user.id).select('-password_hash');
    console.log('User:', user);
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    // Attacher l'utilisateur à l'objet socket
    socket.user = user;
    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Authentication error: Invalid token'));
  }
};