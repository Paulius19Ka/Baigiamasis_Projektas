import { useNavigate } from "react-router";

type Props = {
  reason: string
}

const Forbidden = ({ reason }: Props) => {

  const navigate = useNavigate();

  return (
    <section>
      <h2>You do not have permission to access this page!</h2>
      <p>Due to: {reason}</p>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </section>
  );
}
 
export default Forbidden;