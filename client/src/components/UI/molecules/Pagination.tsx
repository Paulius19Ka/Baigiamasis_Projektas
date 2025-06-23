import { useContext } from "react";
import PostsContext from "../../contexts/PostsContext";
import { PostsContextTypes } from "../../../types";

const Pagination = () => {

  const { filteredDataCount } = useContext(PostsContext) as PostsContextTypes;

  return (
    <div>
      <div>
        <button>{`<`}</button>
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>{`>`}</button>
      </div>
      <div>
        <p>xx of {filteredDataCount}</p>
      </div>
    </div>
  );
}
 
export default Pagination;