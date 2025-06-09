import bcrypt from 'bcrypt';
import { connectToDB, createAccessJWT, validateJWT } from "./helper.js";

const login = async (req, res) => {
  const client = await connectToDB();
  try{
    const DB_RESPONSE = await client.db('Final_Project').collection('users').findOne({ email: req.body.email });
    if(!DB_RESPONSE){
      console.error({ error: `User credentials are incorrect.` });
      return res.status(404).send({ error: `User credentials are incorrect.` });
    };
    if(!(await bcrypt.compare(req.body.password, DB_RESPONSE.password))){
      console.error({ error: `User credentials are incorrect.` });
      return res.status(401).send({ error: `User credentials are incorrect.` });
    };
    const { password, _id, ...user } = DB_RESPONSE;
    const JWT_accessToken = createAccessJWT(user);
    res.header('Authorization', JWT_accessToken).send({ success: `[${user.email}] was logged in successfully`, userData: user });
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with server, try to log in later.` });
  } finally{
    await client.close();
  };
};

const autoLogin = async (req, res) => {
  // extract authetication header from request, contains the JWT token in format { Authorization: Bearer <token> }
  const authHeader = req.headers.authorization;
  if(!authHeader){ // if thea authentication header is empty, send a message that user needs to re-authenticate
    return res.status(401).send({ error: 'Token does not exist. Please log in again.' });
  };
  // extract the access token from the header and validate
  const accessToken = req.headers.authorization.split(' ')[1];
  const verifyResults = validateJWT(accessToken);
  if(verifyResults.error){
    return res.status(verifyResults.status).send(verifyResults);
  };
};


export { login, autoLogin };