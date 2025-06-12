import styled from "styled-components";
import { Post } from "../../../types";

const StyledDiv = styled.div`
  border: solid 1px var(--font-main);
  padding: 5px;
`;

type Props = { post: Post };
const PostCard = ({ post }: Props) => {
  return (
    <StyledDiv>
      <p>{post.score}</p>
      <p>{post.title}</p>
      <p>{post.content}</p>
      <p>Posted: {post.postDate}</p>
      <p>Last edited: {post.lastEditDate}</p>
      <p>Topic: {post.topic}</p>
      <p>By: {post.postedBy.username}</p>
    </StyledDiv>
  );
}
 
export default PostCard;