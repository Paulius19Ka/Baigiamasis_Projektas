import styled from "styled-components";

const StyledFooter = styled.footer`
  height: 40px;
  background-color: var(--background-dark);

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Footer = () => {
  return (
    <StyledFooter>
      <span>Copyright PK 2025</span>
    </StyledFooter>
  );
}
 
export default Footer;