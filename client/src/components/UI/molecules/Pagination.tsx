import { useContext } from "react";
import PostsContext from "../../contexts/PostsContext";
import { PostsContextTypes } from "../../../types";

const Pagination = () => {

  const { filteredDataCount, currentPage, pageSize, changePage } = useContext(PostsContext) as PostsContextTypes;
  const lastPage = Math.ceil(filteredDataCount / pageSize.current);

  return (
    <div>
      <div>
        <button
          disabled={currentPage.current === 1 ? true : false}
          onClick={() => changePage(currentPage.current - 1)}
        >{`<`}</button>
        {
          currentPage.current !== 1 &&
          <button
            onClick={() => changePage(1)}
          >1</button>
        }
        {
          currentPage.current - 3 > 1 && 
          <span>...</span>
        }
        {
          currentPage.current - 2 !== 1 && 
          currentPage.current - 2 > 0 &&
          <button
            onClick={() => changePage(currentPage.current - 2)}
          >{currentPage.current - 2}</button>
        }
        {
          currentPage.current - 1 !== 1 && 
          currentPage.current - 1 > 0 &&
          <button
            onClick={() => changePage(currentPage.current - 1)}
          >{currentPage.current - 1}</button>
        }
        <button disabled>{currentPage.current}</button>
        {
          currentPage.current + 1 !== lastPage && 
          currentPage.current + 1 < lastPage &&
          <button
            onClick={() => changePage(currentPage.current + 1)}
          >{currentPage.current + 1}</button>
        }
        {
          currentPage.current + 2 !== lastPage && 
          currentPage.current + 2 < lastPage &&
          <button
            onClick={() => changePage(currentPage.current + 2)}
          >{currentPage.current + 2}</button>
        }
        {
          currentPage.current + 3 < lastPage && 
          <span>...</span>
        }
        {
          currentPage.current !== lastPage &&
          <button
            onClick={() => changePage(lastPage)}
          >{lastPage}</button>
        }
        <button
          disabled={currentPage.current === lastPage ? true : false}
          onClick={() => changePage(currentPage.current + 1)}
        >{`>`}</button>
      </div>
      <div>
        <p>{(currentPage.current - 1) * pageSize.current + 1}-{currentPage.current * pageSize.current > filteredDataCount ? filteredDataCount : currentPage.current * pageSize.current} of {filteredDataCount} posts</p>
      </div>
    </div>
  );
}
 
export default Pagination;