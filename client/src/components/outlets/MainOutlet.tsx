import { Outlet } from "react-router";
import styled from "styled-components";
import Header from "../UI/organisms/Header";
import Footer from "../UI/organisms/Footer";

const StyledMain = styled.main`
  /* total height - header - footer - (margin top + margin bottom) */
  min-height: calc(100vh - 40px - 40px - 20px);

  margin: 10px 10px;

  h1, h2, h3, h4, h5, h6{
    margin: 0;
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