import { useNavigate } from "react-router";

type Props = {
  reason: string
}

const Forbidden = ({ reason }: Props) => {

  const navigate = useNavigate();

  return (
    <section>
      <h2>You do not have permission to access this page!</h2>
      <p>Reason: {reason}</p>
      <button onClick={() => navigate('/')}>Home</button>
    </section>
  );
}
 
export default Forbidden;