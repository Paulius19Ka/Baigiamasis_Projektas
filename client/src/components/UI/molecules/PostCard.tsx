import styled from "styled-components";
import { Post, UsersContextTypes } from "../../../types";
import { Link } from "react-router";
import DateFormat from "../atoms/DateFormat";
import UsersContext from "../../contexts/UsersContext";
import { useContext } from "react";

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

  const { postScores } = useContext(UsersContext) as UsersContextTypes;

  const score = post?._id ? postScores[post._id] ?? post.score : post?.score ?? 0;

  // title to lower case, replace spaces with dashes, remove special characters, remove hyphens that follow each other
  const postTitle = post.title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
  const postTopic = post.topic.trim().toLowerCase();

  const paragraphZero = post.content.split('\n\n')[0];

  return (
    <StyledDiv>
      {/* <span>Last edited: {post.lastEditDate}</span> */}
      <div className="heading">
        <span>{score}</span>
        {/* <h3><Link to={`post/${post._id}/${postTitle}`}>{post.title}</Link></h3> */}
        <h3><Link to={`/post/${postTopic}/${postTitle}/${post._id}`}>{post.title}</Link></h3>
        <span>{post.postDate ? <DateFormat date={post.postDate} /> : ''}</span>
      </div>
      <div className="content">
        <span>{paragraphZero.length > 150 ? `${paragraphZero.slice(0, 150)}...` : paragraphZero}</span>
      </div>
      <div className="info">
        <span>Topic: {post.topic}</span>
        {
          post.replyCount ?
          <span>Replies: {post.replyCount}</span> :
          <span>No Replies...</span>
        }
        <span>By: {post.postedBy?.username ?? ''}</span>
      </div>
    </StyledDiv>
  );
}
 
export default PostCard;