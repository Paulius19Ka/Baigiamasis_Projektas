import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Post } from "../../types";

const ExpandedPost = () => {

  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    fetch(`http://localhost:5500/posts/${id}`)
      .then(res => res.json())
      .then(data => setPost(data));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section>
      {
        post ?
        <div>
          <p>Score: {post.score}</p>
          <p>Posted: {post.postDate ? post.postDate.slice(0, 10): ''}, {post.postDate ? post.postDate.slice(11, 16): ''}</p>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>Topic: {post.topic}</p>
          <p>Edited: {post.lastEditDate ? post.lastEditDate.slice(0, 10): ''}, {post.lastEditDate ? post.lastEditDate.slice(11, 16): ''}</p>
          <p>By: {post.postedBy.username}</p>
        </div> :
        <p>Loading...</p>
      }
    </section>
  );
}
 
export default ExpandedPost;