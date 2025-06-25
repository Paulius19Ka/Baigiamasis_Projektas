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
    text-align: center;
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

    > p{
      font-size: 1.15rem;
    }
  }

  @media (min-width: 1024px){
    > h2{
      font-size: 1.4rem;
    }

    > p{
      font-size: 1.2rem;
    }
  }
`;

type Props = {
  reason: string
}

const Forbidden = ({ reason }: Props) => {

  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Access Denied \u2666 MusicForum`;
  }, []);

  return (
    <StyledSection>
      <p>{reason}</p>
      <h2>You do not have permission to access this page!</h2>
      {/* <button onClick={() => navigate('/')}>Home</button> */}
      <ButtonComponent onClick={() => navigate('/')} type='button'>Home</ButtonComponent>
    </StyledSection>
  );
}
 
export default Forbidden;