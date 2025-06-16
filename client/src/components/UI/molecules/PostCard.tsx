import styled from "styled-components";
import { Post } from "../../../types";
import { Link } from "react-router";

const StyledDiv = styled.div`
  border: solid 1px var(--font-main);
  padding: 5px;

  display: flex;
  flex-direction: column;

  > div{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    > h3{
      margin: 0;
    }
  }
`;

type Props = { post: Post };
const PostCard = ({ post }: Props) => {

  // title to lower case, replace spaces with dashes, remove special characters, remove hyphens that follow each other
  const postTitle = post.title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
  const postTopic = post.topic.toLowerCase();

  return (
    <StyledDiv>
      {/* <span>Last edited: {post.lastEditDate}</span> */}
      <div className="heading">
        <span>{post.score}</span>
        {/* <h3><Link to={`post/${post._id}/${postTitle}`}>{post.title}</Link></h3> */}
        <h3><Link to={`post/${postTopic}/${postTitle}/${post._id}`}>{post.title}</Link></h3>
        <span>{post.postDate ? post.postDate.slice(0, 10): ''}, {post.postDate ? post.postDate.slice(11, 16): ''}</span>
      </div>
      <div className="content">
        <span>{post.content.length > 150 ? `${post.content.slice(0, 150)}...` : post.content.slice(0, 150)}</span>
      </div>
      <div className="info">
        <span>Topic: {post.topic}</span>
        <span>By: {post.postedBy?.username ?? ''}</span>
      </div>
    </StyledDiv>
  );
}
 
export default PostCard;