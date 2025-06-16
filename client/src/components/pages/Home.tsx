import { useContext } from "react";
import PostsContext from "../contexts/PostsContext";
import { PostsContextTypes } from "../../types";
import PostCard from "../UI/molecules/PostCard";
import styled from "styled-components";
import { Link } from "react-router";

const StyledSection = styled.section`
  
  > div.posts{
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
`;

const Home = () => {

  const { posts, loading, handleSort } = useContext(PostsContext) as PostsContextTypes;

  return (
    <StyledSection>
      <h2>Home</h2>
      <div className="tools">
        <Link to='newPost'>New Thread</Link>
        {/* sort: date, reply count */}
        <button type="button" onClick={handleSort} value={`sort_postDate=1`}>Date ASC</button>
        <button type="button" onClick={handleSort} value={`sort_postDate=-1`}>Date DESC</button>
        {/* filter: solved/not solved, title, topic */}
      </div>
      <div className="posts">
        {
          loading ? <p>Loading posts...</p> :
          posts.length ?
          posts?.map((post, i) =>
            post._id ?
            <PostCard key={post._id} post={post} /> :
            <p key={i}>Post not found.</p>
          ) : <p>No posts were found...</p>
        }
      </div>
    </StyledSection>
  );
}
 
export default Home;