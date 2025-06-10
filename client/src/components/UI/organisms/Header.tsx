import { useContext } from "react";
import { Link, NavLink } from "react-router";
import styled from "styled-components";
import UsersContext from "../../contexts/UsersContext";
import { UsersContextTypes } from "../../../types";

const StyledHeader = styled.header`
  background-color: var(--background-dark);
  height: 40px;
  padding: 0px 10px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  div, ul{
    display: flex;
    gap: 10px;

    margin: 0;
    padding: 0;

    > li{
      list-style-type: none;

    }
  }

  a{
    text-decoration: none;
    color: var(--font-main);

    &:hover{
      color: var(--accent-hover);
    }
    
    &.active{
      color: var(--accent-main);
    }

    &:active{
      color: var(--accent-active);
    }
  }
`;

const Header = () => {

  const { loggedInUser, logoutUser } = useContext(UsersContext) as UsersContextTypes;

  return (
    <StyledHeader>
      <div>
        <span>LOGO</span> {/* add logo here */}
        <NavLink to=''>Home</NavLink>
      </div>
      <div className="searchBar">
        <input type="text" placeholder="Search..." />
      </div>
      <nav>
        <ul>
          {
            loggedInUser ?
            <>
              <li><NavLink to='/user'>{loggedInUser.username}</NavLink></li>
              <li><button onClick={() => {logoutUser()}}>Logout</button></li>
            </> :
            <>
              <li><Link to='/register'>Register</Link></li>
              <li><Link to='/login'>Login</Link></li>
            </>
          }
        </ul>
      </nav>
    </StyledHeader>
  );
}
 
export default Header;