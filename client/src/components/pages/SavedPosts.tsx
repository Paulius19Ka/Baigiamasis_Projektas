import { useContext, useEffect, useRef, useState } from "react";
import PostsContext from "../contexts/PostsContext";
import { Post, PostsContextTypes, UsersContextTypes } from "../../types";
import UsersContext from "../contexts/UsersContext";
import PostCard from "../UI/molecules/PostCard";

const SavedPosts = () => {

  const { loading } = useContext(PostsContext) as PostsContextTypes;
  const { decodeUserFromToken } = useContext(UsersContext) as UsersContextTypes;
  
  const decodedUser = decodeUserFromToken();
  const savedPostsIDs = useRef<string[]>(decodedUser?.savedPosts || []);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState('');

  const refetchPosts = async () => {
    const Response = await fetch(`http://localhost:5500/posts`);
    const allPosts: Post[] = await Response.json();
    const saved = allPosts.filter(post => savedPostsIDs.current.includes(post._id));
    if(!saved.length){
      setMessage('No saved posts...');
    } else{
      setMessage('');
    };
    setSavedPosts(saved);
  };

  useEffect(() => {
    refetchPosts();
  }, []);

  useEffect(() => {
    document.title = `Saved Posts \u2666 MusicForum`;
  }, []);

  return (
    <section>
      <h2>Saved Posts</h2>
      <div className="posts">
        {
          loading ? <p>Loading posts...</p> :
          savedPosts.length ?
          savedPosts?.map((post, i) =>
            post._id ?
            <PostCard key={post._id} post={post} /> :
            <p key={i}>Post not found.</p>
          ) : <p>{message}</p>
        }
      </div>
    </section>
  );
}
 
export default SavedPosts;