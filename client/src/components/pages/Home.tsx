import { useContext } from "react";
import PostsContext from "../contexts/PostsContext";
import { PostsContextTypes } from "../../types";
import PostCard from "../UI/molecules/PostCard";
import styled from "styled-components";

const StyledSection = styled.section`
  
  > div{
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
`;

const Home = () => {

  const { posts, loading } = useContext(PostsContext) as PostsContextTypes;

  return (
    <StyledSection>
      <h2>Home</h2>
      <div>
        {
          loading ? <p>Loading posts...</p> :
          posts.length ?
          posts.map(post =>
            <PostCard key={post._id} post={post} />
          ) : <p>No posts were found...</p>
        }
      </div>
    </StyledSection>
  );
}
 
export default Home;