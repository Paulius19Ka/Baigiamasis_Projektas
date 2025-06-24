import { useNavigate } from "react-router";

const FourZeroFour = () => {

  const navigate = useNavigate();

  return (
    <section>
      <h2>Error</h2>
      <h1>404</h1>
      <p>The page You are trying to reach does not exist.</p>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </section>
  );
}
 
export default FourZeroFour;