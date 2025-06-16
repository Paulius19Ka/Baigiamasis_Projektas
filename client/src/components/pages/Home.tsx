import { useContext } from "react";
import PostsContext from "../contexts/PostsContext";
import { PostsContextTypes } from "../../types";
import PostCard from "../UI/molecules/PostCard";
import styled from "styled-components";
import { Link } from "react-router";
import { useFormik } from "formik";
import InputField from "../UI/molecules/InputField";
import { topics } from "../../dynamicVariables";

const StyledSection = styled.section`
  
  > div.posts{
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
`;

const Home = () => {
  
  const { posts, loading, handleSort, handleFilter, resetFilterAndSort } = useContext(PostsContext) as PostsContextTypes;

  const formik = useFormik({
    initialValues: {
      topic: ''
    },
    onSubmit: async (values) => {
      if(values.topic){
        handleFilter(values);
      };
    }
  });

  return (
    <StyledSection>
      <h2>Home</h2>
      <div className="tools">
        <Link to='newPost'>New Thread</Link>
        {/* sort: date, reply count */}
        <button type="button" onClick={handleSort} value={`sort_postDate=1`}>Date ASC</button>
        <button type="button" onClick={handleSort} value={`sort_postDate=-1`}>Date DESC</button>
        {/* filter: solved/not solved, title, topic */}
        <form onSubmit={formik.handleSubmit}>
          <InputField
            labelText='Topic:'
            inputType='select'
            inputName='topic' inputId='topic'
            inputValue={formik.values.topic}
            inputOnChange={formik.handleChange}
            inputOnBlur={formik.handleBlur}
            errors={formik.errors.topic}
            touched={formik.touched.topic}
            selectOps={topics}
          />
          <input type="submit" value='Filter' />
          <button type="button" onClick={resetFilterAndSort}>Reset</button>
        </form>
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