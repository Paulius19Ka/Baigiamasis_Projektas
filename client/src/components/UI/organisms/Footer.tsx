import styled from "styled-components";
import { Link } from "react-router";
import { useContext } from "react";

import UsersContext from "../../contexts/UsersContext";
import { UsersContextTypes } from "../../../types";
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const StyledFooter = styled.footer`
  height: 200px;
  background-color: var(--background-dark);

  display: flex;
  justify-content: center;
  gap: 25px;
  align-items: center;
  flex-direction: column;

  > div{
    width: 50%;
    max-width: 200px;
    align-items: center;
    justify-content: center;
  }

  > div.siteLinks{
    display: flex;
    flex-direction: column;

    > h6{
      margin: 0;
      font-size: 0.77rem;
    }

    > div{
      display: flex;
      gap: 7px;

      > a{
        color: var(--font-main);
        text-decoration: none;
        font-size: 0.75rem;

        &:hover{
          color: var(--font-hover);
        }

        &:active{
          color: var(--font-active);
        }
      }
    }
  }

  > div.linksAndCopyrights{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    > div.links{
      width: 100%;
      display: flex;
      justify-content: space-between;

      > a{
        color: var(--font-main);
        
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover{
          color: var(--font-hover);
        }

        &:active{
          color: var(--font-active);
        }
      }
    }

    > span{
      font-size: 0.9rem;
    }
  }

  @media (min-width: 768px){
    > div.siteLinks{

      > h6{
        font-size: 0.92rem;
      }
      
      > div{

        > a{
          font-size: 0.9rem;
        }
      }
    }

    > div.linksAndCopyrights{
      max-width: 220px;

      > span{
        font-size: 1rem;
      }
    }
  }
`;

const Footer = () => {

  const { loggedInUser } = useContext(UsersContext) as UsersContextTypes;

  return (
    <StyledFooter>
      <div className="siteLinks">
        <h6>Site Links</h6>
        <div>
          <Link to=''>Home</Link>
          <Link to='/rules'>Rules</Link>
          <Link to='/about'>About</Link>
          {
            !loggedInUser ?
            <>
              <Link to='/register'>Register</Link>
              <Link to='/login'>Login</Link>
            </> :
            <>
              <Link to='/savedPosts'>Saved</Link>
              <Link to='/user'>User</Link>
            </>
          }
        </div>
      </div>
      <div className="linksAndCopyrights">
        <div className="links">
          <Link to='https://github.com/Paulius19Ka/Baigiamasis_Projektas' target="_blank"><GitHubIcon /></Link>
          <Link to='https://www.facebook.com/paulius.karbauskas/' target="_blank"><FacebookIcon /></Link>
          <Link to='https://x.com/Kallabow' target="_blank"><TwitterIcon /></Link>
          <Link to='https://www.instagram.com/pauliusig19/' target="_blank"><InstagramIcon /></Link>
        </div>
        <span>Paulius Karbauskas &copy; {(new Date()).toString().slice(11, 15)}</span>
      </div>
    </StyledFooter>
  );
}
 
export default Footer;