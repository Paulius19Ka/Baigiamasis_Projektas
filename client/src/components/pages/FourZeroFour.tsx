import { useEffect } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import ButtonComponent from "../UI/atoms/ButtonComponent";

const StyledSection = styled.section`
  height: calc(100vh - 40px - 200px - 20px);

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;

  > h2{
    font-size: 1.3rem;
  }

  > h1{
    text-align: center;
    font-size: 5rem;
    margin: 0;
  }

  > p{
    font-size: 1.1rem;
    text-align: center;
    margin: 0;
  }

  > button{
    display: block;
    margin: 0 auto;
  }

  @media (min-width: 768px){
    > h2{
      font-size: 1.35rem;
    }

    > h1{
      font-size: 6rem;
    }

    > p{
      font-size: 1.15rem;
    }
  }

  @media (min-width: 1024px){
    > h2{
      font-size: 1.4rem;
    }

    > h1{
      font-size: 7rem;
    }

    > p{
      font-size: 1.2rem;
    }
  }
`;

const FourZeroFour = () => {

  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Page Not Found \u2666 MusicForum`;
  }, []);

  return (
    <StyledSection>
      <h2>Error</h2>
      <h1>404</h1>
      <p>The page You are trying to reach does not exist.</p>
      <ButtonComponent onClick={() => navigate('/')}>Home</ButtonComponent>
    </StyledSection>
  );
}
 
export default FourZeroFour;