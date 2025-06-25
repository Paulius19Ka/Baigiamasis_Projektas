import { useContext } from "react";
import PostsContext from "../../contexts/PostsContext";
import { PostsContextTypes } from "../../../types";
import styled from "styled-components";

const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0px;

  > div{
    display: flex;
    gap: 5px;
    align-items: center;

    > p{
      margin: 0;
      font-size: 0.9rem;
    }

    > button{
      font-size: 0.8rem;
      background-color: var(--accent-main);
      color: var(--font-main);
      border: none;
      padding: 5px 10px;
      border-radius: 10px;
      transition: var(--transition-main);

      &:hover{
        background-color: var(--accent-hover);
        color: var(--font-main);
        cursor: pointer;
      }

      &:active{
        background-color: var(--accent-active);
        color: var(--accent-main);
      }

      &:disabled{
        cursor: default;
        background-color: var(--accent-active);
      }
    }
  }

  @media (min-width: 768px){
    width: 80%;
    min-width: 80%;
    margin: 20px auto;

  > div{

    > p{
      font-size: 1rem;
    }

    > button{
      font-size: 0.9rem;
    }
  }
  }

  @media (min-width: 1024px){
    width: unset;
    min-width: unset;
  > div{

  }
  }
`;

const Pagination = () => {

  const { filteredDataCount, currentPage, pageSize, changePage } = useContext(PostsContext) as PostsContextTypes;
  const lastPage = Math.ceil(filteredDataCount / pageSize.current);

  return (
    <StyledDiv className="pagination">
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
    </StyledDiv>
  );
}
 
export default Pagination;