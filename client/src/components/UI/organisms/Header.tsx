import { Link, NavLink } from "react-router";

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><NavLink to=''>Home</NavLink></li>
          <li><NavLink to='/user'>User</NavLink></li>
          <li><Link to='/register'>Register</Link></li>
          <li><Link to='/login'>Register</Link></li>
        </ul>
      </nav>
    </header>
  );
}
 
export default Header;