import { useEffect } from "react";
import { useNavigate } from "react-router";

const FourZeroFour = () => {

  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Page Not Found \u2666 MusicForum`;
  }, []);

  return (
    <section>
      <h2>Error</h2>
      <h1>404</h1>
      <p>The page You are trying to reach does not exist.</p>
      <button onClick={() => navigate('/')}>Home</button>
    </section>
  );
}
 
export default FourZeroFour;