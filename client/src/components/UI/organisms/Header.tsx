import { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import styled from "styled-components";
import LogoutIcon from '@mui/icons-material/Logout';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
    align-items: center;

    margin: 0;
    padding: 0;

    > img{
      height: 35px;
      width: 100%;
      border-radius: 5px;
      object-fit: cover;
    }

    > li{
      list-style-type: none;

      display: flex;
      align-items: center;
      gap: 5px;

      > a{
        display: flex;
        align-items: center;
        gap: 5px;

        > img{
          width: 24px;
          height: 24px;
          border-radius: 100%;
          object-fit: cover;
        }
      }

      svg{
        cursor: pointer;
        width: 27px;
        height: 27px;


        &:hover{
          color: var(--accent-hover);
        }
        &:active{
          color: var(--accent-active);
        }
      }
    }
  }

  a{
    text-decoration: none;
    color: var(--font-main);
    font-size: 1em;

    &:hover{
      color: var(--accent-hover);
      > img{
        filter: brightness(0.8);
      }

         
    }
    
    &.active{
      color: var(--accent-main);
      font-weight: bold;
       > img{
        filter: brightness(0.6);
      }
    }

    &:active{
      color: var(--accent-active);
       > img{
        filter: brightness(0.4);
      }
    }
  }
`;

const Header = () => {

  const { loggedInUser, logoutUser } = useContext(UsersContext) as UsersContextTypes;
  const navigate = useNavigate();

  return (
    <StyledHeader>
      <div>
        <img src="/public/media/forumLogo.png" alt="a vinyl record with message symbol on the side" />
        <NavLink to=''>Home</NavLink>
      </div>
      <div className="searchBar">
        
      </div>
      <nav>
        <ul>
          {
            loggedInUser ?
            <>
              <li>
                <ArrowBackIcon onClick={() => navigate(-1)} />
                <NavLink to='/savedPosts' ><SaveIcon /></NavLink>
                <NavLink to='/user'>
                  {
                    loggedInUser.avatar ?
                    <img src={loggedInUser.avatar} alt={`${loggedInUser.username} profile picture`} /> :
                    <img src='/public/media/placeholderProfilePic.png' alt={`placeholder profile picture`} />
                  }
                  {/* {loggedInUser.username} */}
                </NavLink>
                <LogoutIcon onClick={() => {
                  navigate('/');
                  logoutUser();
                }} />
              </li>
            </> :
            <>
              <li><ArrowBackIcon onClick={() => navigate(-1)} /></li>
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