import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { get } from "@/api/client";
import PostImageGrid from "@/components/ui/PostImageGrid";
import {server_img_url} from '@/lib/utils';

const PostView = () => {
  interface Post {
    _id: string;
    title: string;
    created_at: string;
    status: string;
    images?: { image_url: string }[];
    description: string;
    address?: string;
    date_found?: string;
  }

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const observer = useRef();

  // Fetch posts function
  const fetchPosts = useCallback(async (pageNum, search = "") => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const dataRes = await get<Post[]>(`/api/posts?page=${pageNum}&search=${search}`);

      const data = dataRes.data;
      if(typeof dataRes.error == 'boolean' && dataRes.error){
        setError(dataRes.message || "Une erreur est survenue");
        setLoading(false);
        return;
      }
      if (pageNum === 1) {
        setPosts(data);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...data]);
      }
      
      setHasMore(data.length > 0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPosts(1, searchTerm);
  }, [fetchPosts]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPosts(1, searchTerm);
  };

  // Setup intersection observer for infinite scroll
  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchPosts(nextPage, searchTerm);
            return nextPage;
          });
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchPosts, searchTerm]
  );

  // Render status badge with appropriate color
  const renderStatusBadge = (status) => {
    const statusColors = {
      found: "bg-green-100 text-green-800",
      lost: "bg-yellow-100 text-yellow-800",
      reported: "bg-red-100 text-red-800",
      closed: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge className={`${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Fixed search bar */}
      <div className="sticky top-0 z-10 bg-white p-4 border-b">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Rechercher un objet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">Rechercher</Button>
        </form>
      </div>

      {/* Posts list */}
      <div className="flex-grow overflow-y-auto p-4">
        {posts.length === 0 && !loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Aucun objet trouvé</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-xl mx-auto">
            {posts.map((post, index) => {
              // Check if this is the last element
              const isLastElement = index === posts.length - 1;
              
              return (
                <Card
                  key={post._id}
                  className="w-full"
                  ref={isLastElement ? lastPostElementRef : null}
                >
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      <p className="text-sm text-gray-500">
                        {format(new Date(post.created_at), "dd/MM/yyyy à HH:mm")}
                      </p>
                    </div>
                    {renderStatusBadge(post.status)}
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    {post.images && post.images.length > 0 && (
                      <div className="overflow-x-auto flex gap-2 mb-4">
                        <PostImageGrid 
                            images={
                                post.images.map((img)=>{
                                    return {image_url: server_img_url(`${post._id}/${img.image_url}`)}
                                })
                            }
                        />
                      </div>
                    )}
                    <p className="line-clamp-3">{post.description}</p>
                    {post.address && (
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-semibold">Adresse:</span> {post.address}
                      </p>
                    )}
                    {post.date_found && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Trouvé le:</span>{" "}
                        {format(new Date(post.date_found), "dd/MM/yyyy")}
                      </p>
                    )}
                  </CardContent>
                  
                  <CardFooter className="pt-0 flex justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <svg
                          className="w-4 h-4 mr-2"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M4 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1v2a1 1 0 0 0 1.707.707L9.414 13H15a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4Z" />
                        </svg>
                        Contacter
                      </Button>
                    </div>
                    <Button variant="secondary" size="sm">
                      Voir détails
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
            
            {loading && (
              <div className="flex justify-center my-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostView;