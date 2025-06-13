import { useContext } from "react";
import { Link } from "react-router";
import { useFormik } from "formik";
import * as Yup from 'yup';

import UsersContext from "../contexts/UsersContext";
import { UsersContextTypes } from "../../types";
import InputField from "../UI/molecules/InputField";
import { topics } from "../../dynamicVariables";

const CreatePost = () => {

  const { decodeUserFromToken } = useContext(UsersContext) as UsersContextTypes;
  const decodedUser = decodeUserFromToken();

  const initValues = {
    title: '',
    content: '',
    topic: ''
  };

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: Yup.object({
      title: Yup.string()
        .min(5, 'Title must be longer than 5 symbols.')
        .max(100, 'Title must be shorter than 100 symbols.')
        .required('Enter the title.'),
      content: Yup.string()
        .min(20, 'The post description must be longer than 20 symbols.')
        .max(2000, 'The post description must be shorter than 2000 symbols.')
        .required('Enter the post description'),
      topic: Yup.string()
        .oneOf(topics, 'Invalid topic selected.')
        .required('A topic must be selected.')
    }),
    onSubmit: async (values) => {
      console.log(values);
    }
  })

  return (
    <section>
      {
        decodedUser ?
        <>
          <h2>Create new thread</h2>
          <form onSubmit={formik.handleSubmit}>
            <InputField
              labelText='Title:'
              inputType='text'
              inputName='title' inputId='title'
              inputValue={formik.values.title}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.title}
              touched={formik.touched.title}
              inputPlaceholder={'Enter a title...'}
            />
            <InputField
              labelText='Content:'
              inputType='textarea'
              inputName='content' inputId='content'
              inputValue={formik.values.content}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.content}
              touched={formik.touched.content}
              inputPlaceholder={'Enter content...'}
            />
            <InputField
              labelText='Topic:'
              inputType='select'
              inputName='topic' inputId='topic'
              inputValue={formik.values.topic}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.topic}
              touched={formik.touched.topic}
              inputPlaceholder={'Enter a topic...'}
            />
            <input type="submit" value='Submit Post' />
          </form>
        </> :
        <>
          <p>Please <Link to='/login'>login</Link> or <Link to='/register'>register</Link> to create a new thread.</p>
        </>
      }
    </section>
  );
}
 
export default CreatePost;