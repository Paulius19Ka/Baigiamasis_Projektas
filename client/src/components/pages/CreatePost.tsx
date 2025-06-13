import { useContext } from "react";
import UsersContext from "../contexts/UsersContext";
import { UsersContextTypes } from "../../types";
import { Link } from "react-router";

const CreatePost = () => {

  const { decodeUserFromToken } = useContext(UsersContext) as UsersContextTypes;
  const decodedUser = decodeUserFromToken();

  

  return (
    <section>
      {
        decodedUser ?
        <>
          <h2>Create new thread</h2>
          <form action=""></form>
        </> :
        <>
          <p>Please <Link to='/login'>login</Link> or <Link to='/register'>register</Link> to create a new thread.</p>
        </>
      }
    </section>
  );
}
 
export default CreatePost;