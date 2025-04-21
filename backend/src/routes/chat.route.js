// src/routes/chat.route.js
const express = require('express');
const router = express.Router();
const { Message, User } = require('../models/models');
const authMiddleware = require('../middlewares/auth.middleware');
const mongoose = require('mongoose');
const { getUserConversations, getMessagesConversation, sendMessage } = require('../controllers/chat.controller');

// Récupérer toutes les conversations d'un utilisateur
router.get('/conversations', authMiddleware, getUserConversations);

// Récupérer les messages d'une conversation
router.get('/messages/:postId/:userId', authMiddleware, getMessagesConversation);

// Envoyer un message (alternative REST pour les clients sans Socket.IO)
router.post('/messages', authMiddleware, sendMessage);


module.exports = router;