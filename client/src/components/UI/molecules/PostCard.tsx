import styled from "styled-components";
import { Post, UsersContextTypes } from "../../../types";
import { Link } from "react-router";

import UsersContext from "../../contexts/UsersContext";
import { useContext } from "react";
import { formatDate, formatScore } from "../../../helpers";

const StyledDiv = styled.div`
  background-color: var(--background-dark);
  padding: 16px;
  border-radius: 15px;
  transition: var(--transition-slow);

  display: flex;
  flex-direction: column;
  gap: 15px;

  &:hover{
    background-color: var(--background-darker);
  }

  > div{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    > h3{
      margin: 0;
      font-size: 1.1rem;
      margin-right: auto;

      > a{
        text-decoration: none;
        color: var(--accent-main);

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 160px;
        display: inline-block;
        transition: var(--transition-main);

        &:hover{
          color: var(--accent-hover);
          cursor: pointer;
        }

        &:active{
          color: var(--accent-active);
        }
      }
    }

    > span{
      font-size: 1rem;
    }
  }

  > div.heading{

    > span:nth-child(1){
      font-size: 0.8rem;
      width: 32px;
      height: 32px;
      border: 1px solid var(--accent-main);
      border-radius: 100%;
      background-color: var(--background-main);
      color: var(--accent-main);
      cursor: default;

      display: flex;
      align-items: center;
      justify-content: center;
    }

    > div{
      display: flex;
      flex-direction: column;
      > span{
        font-size: 0.8rem;
        margin-left: auto;
        color: var(--font-hover);
      }

      > span:nth-child(2){
        font-size: 0.6rem;
        font-weight: 400;
        color: var(--button-main);
      }
    }
  }

  > div.info{
    display: flex;
    justify-content: flex-end;
    gap: 25px;
    
    > span{
      font-size: 0.8rem;
      color: var(--font-hover);
    }
  }

  @media (min-width: 768px){
    padding: 32px;
    gap: 25px;

    > div{
      gap: 20px;

      > h3{
        font-size: 1.3rem;
      }

      > span{
        font-size: 1.1rem;
      }
    }

    > div.heading{

      > h3{
        
        > a{
          max-width: 280px;
        }
      }

      > span:nth-child(1){
        font-size: 0.9rem;
        width: 40px;
        height: 40px;
        border: 2px solid var(--accent-main);
      }

      > div{

        > span{
          font-size: 0.9rem;
        }

        > span:nth-child(2){
          font-size: 0.7rem;
        }
      }
    }

    > div.info{
      gap: 50px;

      > span{
        font-size: 0.9rem;
      }
    }
  }

  @media (min-width: 1024px){
    min-width: 700px;

    > div.heading{

      > h3{
        
        > a{
          max-width: 420px;
        }
      }
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
      <div className="heading">
        <span>{formatScore(score)}</span>
        <h3><Link to={`/post/${postTopic}/${postTitle}/${post._id}`}>{post.title}</Link></h3>
        <div>
          <span>Posted {formatDate(post.postDate)}</span>
          {post.lastEditDate && <span><i>Edited {formatDate(post.lastEditDate)}</i></span>}
        </div>
      </div>
      <div className="content">
        <span>{paragraphZero.length > 150 ? `${paragraphZero.slice(0, 150)}...` : paragraphZero}</span>
      </div>
      <div className="info">
        <span>{post.topic}</span>
        {
          post.replyCount ?
          <span>Replies: {post.replyCount}</span> :
          <span>No Replies...</span>
        }
        <span>{post.postedBy?.username ?? ''}</span>
      </div>
    </StyledDiv>
  );
}
 
export default PostCard;