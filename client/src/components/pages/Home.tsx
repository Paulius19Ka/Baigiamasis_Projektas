import { useContext, useEffect } from "react";
import PostsContext from "../contexts/PostsContext";
import { PostsContextTypes } from "../../types";
import PostCard from "../UI/molecules/PostCard";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { useFormik } from "formik";
import InputField from "../UI/molecules/InputField";
import { topics } from "../../dynamicVariables";
import Pagination from "../UI/molecules/Pagination";
import ButtonComponent from "../UI/atoms/ButtonComponent";

// ICONS
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StyledSection = styled.section`

  > div.tools{
    width: 100%;
    min-width: 100%;
    min-height: fit-content;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;

    /* margin-bottom: 20px; */

    > div.sort{
      display: flex;
      flex-direction: column;
      /* align-items: center; */
      gap: 5px;

      background-color: var(--background-dark);
      padding: 15px;
      border-radius: 15px;

      > span{
        font-size: 0.8rem;
        font-weight: 600;
        align-self: center;
      }

      > div{
        display: flex;
        align-items: center;

        > span{
          font-size: 0.8rem;
        }

        > div{
          display: flex;
          align-items: center;
          justify-content: center;

          > button{
            /* width: 20px;
            height: 20px; */
            padding: 0;
            border: none;
            background-color: rgba(255, 255, 255, 0);
            cursor: pointer;
            

            > svg{
              color: var(--font-main);
              font-size: 2rem;
              transition: var(--transition-main);
            }

            &:hover{
              > svg{
                color: var(--accent-main);
              }
            }

            &:active{
              > svg{
                color: var(--accent-active);
              }
            }
          }
        }
      }
    }

    > form{
      display: flex;
      flex-direction: column;
      align-items: center;

      background-color: var(--background-dark);
      padding: 16px;
      border-radius: 15px;

      > span{
        font-size: 0.8rem;
        font-weight: 600;
        align-self: center;
      }

      > div{

        > label{
          font-size: 0.8rem;
        }

        > div{
          display: flex;
          flex-direction: column;

          > label{
            font-size: 0.8rem;
          }

          > input, select{
            color: var(--font-main);
            width: 200px;
            padding: 5px 10px;
            background-color: var(--modal-background);
            border: none;
            border-radius: 5px;
            font-size: 0.8rem;
            transition: var(--transition-main);

            &::placeholder{
              color: var(--font-active);
            }

            &:hover{
              color: var(--font-main);
              background-color: var(--background-main);

              &::placeholder{
                color: var(--modal-background);
              }
            }
            
            &:focus{
              background-color: var(--background-main);
              outline: 2px solid var(--font-main);

              &::placeholder{
                color: var(--background-dark);
              }
            }
          }

          > select{
            color: var(--font-main);
            
            &:hover{
              color: var(--font-main);
              background-color: var(--modal-background);
            }

            &:focus{
              background-color: var(--modal-background);
              outline: none;
    
              &::placeholder{
                color: var(--background-dark);
              }
            }
          }
        }
      }

      > div:nth-child(4){
        display: flex;
        gap: 10px;
        > button{
          font-size: 0.9rem;
          padding: 5px 10px;
        }
      }
    }
  }
  
  > div.posts{
    min-height: calc(100vh - 40px - 200px - 172.38px - 10px - 20px - 25px - 10px);
    width: 100%;
    margin-top: 10px;

    display: flex;
    flex-direction: column;
    gap: 10px;

    > p{
      width: 100%;
      min-width: 100%;
    }
  }

  > div.pagination{

  }

  @media (min-width: 768px){
    
    > div.tools{
      width: 80%;
      min-width: 80%;
      margin: 0 auto;

      > div.sort{
        gap: 10px;
        padding: 29.2px;

        > span{
          font-size: 0.9rem;
        }

        > div{

          > span{
            font-size: 0.9rem;
          }

          > div{

            > button{

              > svg{

                font-size: 2.2rem;
              }
            }
          }
        }
      }

      > form{
        gap: 10px;

        > span{
          font-size: 0.9rem;
        }

        > div{

          > label{
            font-size: 0.9rem;
          }

          > div{

            > input, select{
              padding: 10px 15px;
              font-size: 0.9rem;
            }
          }
        }

        > div:nth-child(4){
          gap: 15px;
          > button{
            font-size: 1rem;
            padding: 5px 10px;
          }
        }
      }
    }

    > div.posts{
      min-height: calc(100vh - 60px - 200px - 172.38px - 20px - 40px - 26px - 80px);
      width: 80%;
      margin: auto;
      margin-top: 20px;
      gap: 20px;

    }
  }

  @media (min-width: 1024px){

    > div.tools{
      width: unset;
      min-width: unset;
    }

    > div.posts{
      width: unset;
    }
  }
`;

const Home = () => {
  
  const { posts, loading, handleSort, handleFilter, resetFilterAndSort } = useContext(PostsContext) as PostsContextTypes;
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: '',
      topic: '',
      replied: false
    },
    onSubmit: async (values) => {
      handleFilter(values);
    }
  });

  useEffect(() => {
    document.title = `Home \u2666 MusicForum`;
  }, []);

  return (
    <StyledSection>
      <div className="tools">
        <div className="sort">
          <span>Sort</span>
          <div className="dateSort">
            <span>Date</span>
            <div>
              <button type="button" onClick={handleSort} value={`sort_postDate=1`}><ExpandLessIcon /></button>
              <button type="button" onClick={handleSort} value={`sort_postDate=-1`}><ExpandMoreIcon /></button>
            </div>
          </div>
          <div className="replySort">
            <span>Replies</span>
            <div>
              <button type="button" onClick={handleSort} value={`sort_replyCount=1`}><ExpandLessIcon /></button>
              <button type="button" onClick={handleSort} value={`sort_replyCount=-1`}><ExpandMoreIcon /></button>
            </div>
          </div>
          <ButtonComponent type="button" onClick={() => navigate('/newPost')}>New Post</ButtonComponent>
        </div>
        <form onSubmit={formik.handleSubmit}>
          {/* <span>Filter</span> */}
          <InputField
            labelText='Search'
            inputType='text'
            inputName='title' inputId='title'
            inputValue={formik.values.title}
            inputOnChange={formik.handleChange}
            inputOnBlur={formik.handleBlur}
            errors={formik.errors.title}
            touched={formik.touched.title}
            inputPlaceholder="Search..."
          />
          <InputField
            labelText='Topic'
            inputType='select'
            inputName='topic' inputId='topic'
            inputValue={formik.values.topic}
            inputOnChange={formik.handleChange}
            inputOnBlur={formik.handleBlur}
            errors={formik.errors.topic}
            touched={formik.touched.topic}
            selectOps={topics}
          />
          <div>
            <input
              type='checkbox'
              name='replied' id='replied'
              onChange={formik.handleChange}
              checked={formik.values.replied}
            />
            <label htmlFor='replied'>Only Posts With Replies</label>
          </div>
          <div>
            <ButtonComponent type="submit">Filter</ButtonComponent>
            <ButtonComponent type="button" onClick={() => {
              formik.resetForm();
              resetFilterAndSort();
            }}>Reset</ButtonComponent>
          </div>
        </form>
      </div>
      {/* <Pagination /> */}
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
      <Pagination />
    </StyledSection>
  );
}
 
export default Home;