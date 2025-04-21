import { useState, useEffect, useRef, use } from 'react';
import { io } from 'socket.io-client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Send, Check, CheckCheck, User, Loader2 } from 'lucide-react';
import { get } from '@/api/client';
import { BACKEND_URL } from '@/lib/constants';

const ChatComponent = ({ postId, otherUserId, currentUser, otherUserName }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  // Fonction pour obtenir les initiales d'un nom
  const getInitials = (name) => {
    return name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
      : 'U';
  };

  // Connexion au socket
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Connecting to socket with token:', token);
    setIsConnecting(true);
    // Créer une nouvelle instance de socket
    const newSocket = io(BACKEND_URL, {
      auth: {
        token: token
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnecting(false);
      
      // Rejoindre la room de cette conversation
      newSocket.emit('join_room', {
        receiverId: otherUserId,
        postId: postId
      });
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setIsConnecting(false);
    });

    newSocket.on('message_history', (data) => {
      setMessages(data.messages);
      scrollToBottom();
    });

    newSocket.on('receive_message', (message) => {
      console.log(message);
      setMessages(prevMessages => [...prevMessages, message]);
      
      // Marquer comme lu si le message est reçu
      if (message.sender_id !== currentUser._id) {
        newSocket.emit('mark_as_read', { messageIds: [message._id] });
      }
      
      scrollToBottom();
    });

    newSocket.on('user_typing', (data) => {
      if (data.userId === otherUserId) {
        setIsTyping(true);
      }
    });

    newSocket.on('user_stop_typing', (data) => {
      if (data.userId === otherUserId) {
        setIsTyping(false);
      }
    });

    setSocket(newSocket);

    // Cleanup à la déconnexion
    return () => {
      if (newSocket) {
        newSocket.emit('leave_room', {
          receiverId: otherUserId,
          postId: postId
        });
        newSocket.disconnect();
      }
    };
  }, [postId, otherUserId, currentUser._id]);

  // Charger les messages via API (alternative au socket)
  const loadMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await get(
        `/api/chat/messages/${postId}/${otherUserId}`
      );
      console.log('Messages loaded:', response);
      if (response.error === false) {
        setMessages(response.data);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !socket) return;
    
    // Envoyer le message via socket
    socket.emit('send_message', {
      receiverId: otherUserId,
      postId: postId,
      content: inputMessage
    });
    
    setInputMessage('');
    
    // Arrêter l'indicateur de frappe
    handleStopTyping();
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    
    // Envoyer l'événement "typing"
    if (socket) {
      socket.emit('typing', {
        receiverId: otherUserId,
        postId: postId
      });
      
      // Réinitialiser le timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Arrêter d'indiquer la frappe après 2 secondes d'inactivité
      typingTimeoutRef.current = setTimeout(handleStopTyping, 2000);
    }
  };

  const handleStopTyping = () => {
    if (socket) {
      socket.emit('stop_typing', {
        receiverId: otherUserId,
        postId: postId
      });
    }
  };

  // Formatage de la date pour l'affichage
  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Grouper les messages par date
  const groupMessagesByDate = () => {
    const groups = {};
    
    messages.forEach(message => {
      const date = formatMessageDate(message.sent_at);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader className="border-b bg-slate-50">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={`/api/users/${otherUserId}/avatar`} alt={otherUserName} />
            <AvatarFallback>{getInitials(otherUserName || 'User')}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{otherUserName || 'Utilisateur'}</CardTitle>
            {isConnecting ? (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin mr-1" /> 
                Connexion...
              </div>
            ) : (
              isTyping && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="animate-pulse">Écrit un message...</span>
                </div>
              )
            )}
          </div>
        </div>
      </CardHeader>
      
      <ScrollArea className="h-96 p-4">
        {Object.entries(messageGroups).map(([date, dateMessages]) => (
          <div key={date} className="mb-4">
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <Badge variant="outline" className="mx-2 text-xs font-normal bg-white">
                {date}
              </Badge>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            
            {dateMessages.map((msg, index) => (
              <div 
                key={msg._id || index} 
                className={`flex mb-4 ${msg.sender_id === currentUser._id ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender_id !== currentUser._id && (
                  <Avatar className="h-8 w-8 mr-2 mt-1">
                    <AvatarFallback className="text-xs">{getInitials(otherUserName || 'User')}</AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-xs ${msg.sender_id === currentUser._id ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3 shadow`}>
                  <div className="text-sm">{msg.content}</div>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-xs opacity-70">
                      {formatMessageTime(msg.sent_at)}
                    </span>
                    
                    {msg.sender_id === currentUser._id && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {msg.is_read ? 
                              <CheckCheck className="h-3 w-3" /> : 
                              <Check className="h-3 w-3" />
                            }
                          </TooltipTrigger>
                          <TooltipContent>
                            {msg.is_read ? 'Lu' : 'Envoyé'}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
                
                {msg.sender_id === currentUser._id && (
                  <Avatar className="h-8 w-8 ml-2 mt-1">
                    <AvatarImage src={`/api/users/${currentUser._id}/avatar`} alt="Moi" />
                    <AvatarFallback>{getInitials(currentUser.name || 'Moi')}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </ScrollArea>
      
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            value={inputMessage}
            onChange={handleInputChange}
            placeholder="Tapez votre message..."
            className="flex-1"
            disabled={isConnecting}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!inputMessage.trim() || isConnecting}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatComponent;