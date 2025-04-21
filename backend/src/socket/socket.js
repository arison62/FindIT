// src/socket/socket.js
const socketIO = require('socket.io');
const { Message, User, Notification } = require('../models/models');
const authSocketMiddleware = require('../middlewares/authSocket.middleware');
const mongoose = require('mongoose');

function initializeSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Middleware d'authentification pour Socket.IO
  io.use(authSocketMiddleware);

  // Stockage des utilisateurs connectés
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    const userId = socket.user._id;
    
    // Enregistrer l'utilisateur comme connecté
    connectedUsers.set(userId.toString(), socket.id);
    
    // Rejoindre toutes les rooms où l'utilisateur a des conversations
    joinUserRooms(socket, userId);

    // Écouter les nouveaux messages
    socket.on('send_message', async (data) => {
      try {
        const { receiverId, postId, content } = data;
        
        if (!receiverId || !postId || !content) {
          return socket.emit('error', { message: 'Missing required fields' });
        }

        // Vérifier si les IDs sont valides
        if (!mongoose.Types.ObjectId.isValid(receiverId) || 
            !mongoose.Types.ObjectId.isValid(postId)) {
          return socket.emit('error', { message: 'Invalid ID format' });
        }

        // Créer le message dans la base de données
        const message = new Message({
          sender_id: userId,
          receiver_id: receiverId,
          post_id: postId,
          content,
          is_read: false,
          sent_at: new Date()
        });

        await message.save();

        // Générer le nom de la room basé sur les IDs des utilisateurs et le post
        const roomName = generateRoomName(userId, receiverId, postId);
        
        // Envoyer le message à la room
        io.to(roomName).emit('receive_message', {
          _id: message._id,
          sender_id: userId,
          receiver_id: receiverId,
          post_id: postId,
          content,
          is_read: false,
          sent_at: message.sent_at
        });

        // Créer une notification pour le destinataire
        const senderUser = await User.findById(userId).select('name');
        const notification = new Notification({
          user_id: receiverId,
          type: 'new_message',
          message: `Nouveau message de ${senderUser.name}`,
          is_read: false
        });

        await notification.save();

        // Si le destinataire est connecté mais pas dans la room, envoyer une notification
        if (connectedUsers.has(receiverId.toString())) {
          const receiverSocketId = connectedUsers.get(receiverId.toString());
          io.to(receiverSocketId).emit('new_notification', {
            notification_id: notification._id,
            type: 'new_message',
            message: notification.message,
            sender_id: userId,
            post_id: postId
          });
        }
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Marquer les messages comme lus
    socket.on('mark_as_read', async (data) => {
      try {
        const { messageIds } = data;
        
        if (!Array.isArray(messageIds) || messageIds.length === 0) {
          return socket.emit('error', { message: 'Invalid message IDs' });
        }

        await Message.updateMany(
          { _id: { $in: messageIds }, receiver_id: userId },
          { $set: { is_read: true } }
        );

        socket.emit('messages_marked_read', { messageIds });
      } catch (error) {
        console.error('Error marking messages as read:', error);
        socket.emit('error', { message: 'Failed to mark messages as read' });
      }
    });

    // Rejoindre une room spécifique pour une conversation
    socket.on('join_room', async (data) => {
      try {
        const { receiverId, postId } = data;
        
        if (!receiverId || !postId) {
          return socket.emit('error', { message: 'Missing required fields' });
        }

        const roomName = generateRoomName(userId, receiverId, postId);
        socket.join(roomName);
        
        // Charger l'historique des messages
        const messages = await Message.find({
          $or: [
            {  post_id: postId },
            {  post_id: postId }
          ]
        }).sort({ sent_at: 1 });

        socket.emit('message_history', { messages });
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join conversation room' });
      }
    });

    // Quitter une room
    socket.on('leave_room', (data) => {
      const { receiverId, postId } = data;
      if (receiverId && postId) {
        const roomName = generateRoomName(userId, receiverId, postId);
        socket.leave(roomName);
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { receiverId, postId } = data;
      if (receiverId && postId) {
        const roomName = generateRoomName(userId, receiverId, postId);
        socket.to(roomName).emit('user_typing', { userId });
      }
    });

    socket.on('stop_typing', (data) => {
      const { receiverId, postId } = data;
      if (receiverId && postId) {
        const roomName = generateRoomName(userId, receiverId, postId);
        socket.to(roomName).emit('user_stop_typing', { userId });
      }
    });

    // Déconnexion
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
      connectedUsers.delete(userId.toString());
    });
  });

  // Fonction pour rejoindre les rooms existantes
  async function joinUserRooms(socket, userId) {
    try {
      // Trouver tous les messages où l'utilisateur est impliqué
      const messages = await Message.aggregate([
        {
          $match: {
            $or: [
              { sender_id: new mongoose.Types.ObjectId(userId) },
              { receiver_id: new mongoose.Types.ObjectId(userId) }
            ]
          }
        },
        {
          $group: {
            _id: {
              post_id: "$post_id",
              participants: {
                $cond: {
                  if: { $eq: ["$sender_id", new mongoose.Types.ObjectId(userId)] },
                  then: ["$sender_id", "$receiver_id"],
                  else: ["$receiver_id", "$sender_id"]
                }
              }
            }
          }
        }
      ]);

      // Rejoindre chaque room
      messages.forEach((convo) => {
        const participants = convo._id.participants.map(id => id.toString());
        const otherUserId = participants.find(id => id !== userId.toString());
        const postId = convo._id.post_id.toString();
        
        if (otherUserId && postId) {
          const roomName = generateRoomName(userId, otherUserId, postId);
          socket.join(roomName);
        }
      });
    } catch (error) {
      console.error('Error joining user rooms:', error);
    }
  }

  // Fonction pour générer un nom de room unique pour une conversation
  function generateRoomName(userId1, userId2, postId) {
    // Trier les IDs pour avoir un nom cohérent indépendamment de qui est l'expéditeur/destinataire
    const userIds = [userId1.toString(), userId2.toString()].sort();
    return `chat_${userIds[0]}_${userIds[1]}_post_${postId}`;
  }

  return io;
}

module.exports = initializeSocket;