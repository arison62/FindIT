const { Message, User } = require('../models/models');
const mongoose = require('mongoose');

const getUserConversations = async (req, res) => {
    console.log('Fetching user conversations...');
    console.log('User ID:', req.user.user.id);
    try {
        const userId = req.user.user.id;

        // Trouver toutes les conversations uniques
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender_id: new mongoose.Types.ObjectId(userId) },
                        { receiver_id: new mongoose.Types.ObjectId(userId) }
                    ]
                }
            },
            {
                $sort: { sent_at: -1 }
            },
            {
                $group: {
                    _id: {
                        post_id: "$post_id",
                        with_user: {
                            $cond: {
                                if: { $eq: ["$sender_id", new mongoose.Types.ObjectId(userId)] },
                                then: "$receiver_id",
                                else: "$sender_id"
                            }
                        }
                    },
                    last_message: { $first: "$$ROOT" },
                    unread_count: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ["$receiver_id", new mongoose.Types.ObjectId(userId)] },
                                        { $eq: ["$is_read", false] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id.with_user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "_id.post_id",
                    foreignField: "_id",
                    as: "post"
                }
            },
            {
                $project: {
                    _id: 0,
                    post_id: "$_id.post_id",
                    with_user: { $arrayElemAt: ["$user", 0] },
                    post: { $arrayElemAt: ["$post", 0] },
                    last_message: 1,
                    unread_count: 1
                }
            },
            {
                $project: {
                    post_id: 1,
                    "with_user._id": 1,
                    "with_user.name": 1,
                    "post.title": 1,
                    "post.status": 1,
                    "last_message.content": 1,
                    "last_message.sent_at": 1,
                    "last_message.is_read": 1,
                    unread_count: 1
                }
            }
        ]);

        res.status(200).json({
            error: false,
            message: "Conversations récupérées avec succès",
            data: conversations
        });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({
            error: true,
            message: "Erreur lors de la récupération des conversations"
        });
    }
}

const getMessagesConversation = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const { postId, userId: otherUserId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(otherUserId)) {
            return res.status(400).json({
                error: true,
                message: "Format d'ID invalide"
            });
        }

        // Récupérer les messages
        const messages = await Message.find({
            post_id: postId,
            $or: [
                { sender_id: currentUserId, receiver_id: otherUserId },
                { sender_id: otherUserId, receiver_id: currentUserId }
            ]
        }).sort({ sent_at: 1 });

        // Marquer les messages comme lus
        await Message.updateMany(
            {
                post_id: postId,
                sender_id: otherUserId,
                receiver_id: currentUserId,
                is_read: false
            },
            { $set: { is_read: true } }
        );

        res.status(200).json({
            error: false,
            message: "Messages récupérés avec succès",
            data: messages
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            error: true,
            message: "Erreur lors de la récupération des messages"
        });
    }
}


const sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { receiverId, postId, content } = req.body;

        if (!receiverId || !postId || !content) {
            return res.status(400).json({
                error: true,
                message: "Tous les champs sont requis"
            });
        }

        // Vérifier les formats d'ID
        if (!mongoose.Types.ObjectId.isValid(receiverId) || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                error: true,
                message: "Format d'ID invalide"
            });
        }

        // Créer le message
        const message = new Message({
            sender_id: senderId,
            receiver_id: receiverId,
            post_id: postId,
            content,
            is_read: false
        });

        await message.save();

        res.status(201).json({
            error: false,
            message: "Message envoyé avec succès",
            data: message
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            error: true,
            message: "Erreur lors de l'envoi du message"
        });
    }
}

const createDiscussion = async (req, res)=>{
        const {postId} = req.body;
        const userId = req.user.id;

        // 
}

module.exports = {
    getUserConversations,
    getMessagesConversation,
    sendMessage
}