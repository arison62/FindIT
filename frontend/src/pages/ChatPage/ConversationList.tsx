import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { get } from '@/api/client';

const ConversationList = ({ currentUser, onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await get('/api/chat/conversations', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data)
      if (response.error === false) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtenir les initiales d'un nom
  const getInitials = (name) => {
    return name
      ? name.split(' ').map((n) => n[0]).join('').toUpperCase()
      : 'U';
  };

  // Formatage de la date du dernier message
  const formatLastMessageTime = (dateString) => {
    const now = new Date();
    const messageDate = new Date(dateString);
    
    // Différence en jours
    const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Aujourd'hui : afficher l'heure
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Hier
      return 'Hier';
    } else if (diffDays < 7) {
      // Cette semaine : afficher le jour
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Plus ancien : afficher la date
      return messageDate.toLocaleDateString([], { day: 'numeric', month: 'short' });
    }
  };

  // Tronquer le texte si nécessaire
  const truncateText = (text, maxLength = 40) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Filtrer les conversations en fonction de la recherche
  const filteredConversations = conversations.filter(convo => 
    convo.with_user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    convo.post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    convo.last_message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectConversation = (conversation) => {
    if (onSelectConversation) {
      onSelectConversation(conversation);
    } else {
      navigate(`/chat/${conversation.post_id}/${conversation.with_user._id}`);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Conversations
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          {loading ? (
            // Skeletons pendant le chargement
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border-b">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </div>
                <Skeleton className="h-3 w-8" />
              </div>
            ))
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {searchTerm ? 'Aucune conversation trouvée' : 'Aucune conversation'}
            </div>
          ) : (
            filteredConversations.map((convo) => (
              <Button
                key={`${convo.post_id}_${convo.with_user._id}`}
                variant="ghost"
                className={`w-full justify-start p-6 border-b mb-2 hover:bg-slate-50 ${
                  convo.unread_count > 0 ? 'bg-slate-50' : ''
                }`}
                onClick={() => handleSelectConversation(convo)}
              >
                <div className="flex items-start w-full gap-3">
                  <Avatar>
                    <AvatarImage src={`/api/users/${convo.with_user._id}/avatar`} />
                    <AvatarFallback>{getInitials(convo.with_user.name)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 text-left">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">
                        {convo.with_user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatLastMessageTime(convo.last_message.sent_at)}
                      </span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mb-1 truncate">
                      Re: {convo.post.title}
                    </div>
                    
                  </div>
                </div>
              </Button>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ConversationList;