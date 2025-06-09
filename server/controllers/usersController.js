import bcrypt from 'bcrypt';
import { connectToDB, createAccessJWT } from "./helper.js";

const login = async (req, res) => {
  const client = await connectToDB();
  try{
    const DB_RESPONSE = await client.db('Final_Project').collection('users').findOne({ email: req.body.email });
    if(!DB_RESPONSE){
      console.error({ error: `User credentials are incorrect.` });
      return res.status(404).send({ error: `User credentials are incorrect.` });
    };
    if(!bcrypt.compareSync(req.body.password, DB_RESPONSE.password)){
      console.error({ error: `User credentials are incorrect.` });
      return res.status(404).send({ error: `User credentials are incorrect.` });
    };
    const { password, ...user } = DB_RESPONSE;
    const JWT_accessToken = createAccessJWT(user);
    res.header('Authorization', JWT_accessToken).send({ success: `[${user.email}] was logged in successfully`, userData: user });
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with server, try to log in later.` });
  } finally{
    await client.close();
  };
};

export { login };