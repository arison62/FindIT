import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, ArrowLeft } from 'lucide-react';
import { useMediaQuery } from '@uidotdev/usehooks';
import ChatComponent from './ChatComponent';
import ConversationList from './ConversationList';
import { get } from '@/api/client';

// Hook personnalisé pour la réactivité
const useResponsiveLayout = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return { isMobile };
};

const ChatPage = () => {
  const { postId, userId } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isMobile } = useResponsiveLayout();
  const [activeTab, setActiveTab] = useState(postId && userId ? 'chat' : 'conversations');

  useEffect(() => {
    // Charger les infos de l'utilisateur courant
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await get('/api/users/me');
        
        if (response.error === false) {
          setCurrentUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    // Si postId et userId sont fournis, charger cette conversation
    if (postId && userId && currentUser) {
      const loadConversationDetails = async () => {
        try {
          const token = localStorage.getItem('token');
          
          // Charger les détails du post
          const postResponse = await get(`/api/posts/${postId}`);
          console.log(postResponse)
          // Charger les détails de l'utilisateur
          const userResponse = await get(`/api/users/${userId}`);
          console.log(userResponse)
          if (postResponse.error === false && userResponse.error === false) {
            setSelectedConversation({
              post_id: postId,
              with_user: {
                _id: userId,
                name: userResponse.data.name
              },
              post: {
                title: postResponse.data.title
              }
            });
            
            if (isMobile) {
              setActiveTab('chat');
            }
          
          }
        } catch (error) {
          console.error('Error loading conversation details:', error);
        }
      };
      
      loadConversationDetails();
    }
  }, [postId, userId, currentUser, isMobile]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    
    // Update URL
    navigate(`/chat/${conversation.post_id}/${conversation.with_user._id}`);
    
    if (isMobile) {
      setActiveTab('chat');
    }
  };

  const handleBackToList = () => {
    if (isMobile) {
      setActiveTab('conversations');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Messagerie</h1>
      
      {isMobile ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="conversations" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Conversations
            </TabsTrigger>
            <TabsTrigger value="chat" disabled={!selectedConversation} className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Discussion
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="conversations" className="mt-4">
            <ConversationList 
              currentUser={currentUser} 
              onSelectConversation={handleSelectConversation} 
            />
          </TabsContent>
          
          <TabsContent value="chat" className="mt-4">
            {selectedConversation ? (
              <div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBackToList}
                  className="mb-2 flex items-center gap-1 text-xs"
                >
                  <ArrowLeft className="h-3 w-3" /> Retour
                </Button>
                <ChatComponent
                  postId={selectedConversation.post_id}
                  otherUserId={selectedConversation.with_user._id}
                  otherUserName={selectedConversation.with_user.name}
                  currentUser={currentUser}
                />
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Veuillez sélectionner une conversation
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ConversationList 
              currentUser={currentUser} 
              onSelectConversation={handleSelectConversation}
            />
          </div>
          
          <div className="md:col-span-2">
            {selectedConversation ? (
              <ChatComponent
                postId={selectedConversation.post_id}
                otherUserId={selectedConversation.with_user._id}
                otherUserName={selectedConversation.with_user.name}
                currentUser={currentUser}
              />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="p-6 text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Sélectionnez une conversation pour commencer à discuter</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;