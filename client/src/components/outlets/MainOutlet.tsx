import { Outlet } from "react-router";
import styled from "styled-components";
import Header from "../UI/organisms/Header";
import Footer from "../UI/organisms/Footer";

const StyledMain = styled.main`
  /* total height - header - footer - (margin top + margin bottom) */
  min-height: calc(100vh - 40px - 200px - 20px);

  margin: 10px 10px;

  h1, h2, h3, h4, h5, h6{
    margin: 0;
  }

  @media (min-width: 768px){
    background-color: red;
    min-height: calc(100vh - 60px - 200px - 40px);
    margin: 20px 20px;
  }

  @media (min-width: 1024px){
    background-color: green;
    margin: 20px 30px;
  }
`;

const MainOutlet = () => {
  return (
    <>
      <Header />
      <StyledMain>
        <Outlet />
      </StyledMain>
      <Footer />
    </>
  );
}
 
export default MainOutlet;