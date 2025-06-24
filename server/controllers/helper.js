import { MongoClient } from "mongodb";
import jwt from 'jsonwebtoken';
import { validate as uuidValidate } from 'uuid';

const DB_CONNECTION_STRING = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASS}@${process.env.DB_CLUSTER}.${process.env.DB_CLUSTER_ID}.mongodb.net/`;

const connectToDB = async () => {
  return await MongoClient.connect(DB_CONNECTION_STRING);
};

const createAccessJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '1d' });
};

const createRefreshJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });
};

const validateJWT = (providedJWT) => {
  try{
    return jwt.verify(providedJWT, process.env.JWT_ACCESS_SECRET);
  } catch(err){
    console.error(`JWT validation error: ${err.message}.`);
    if(err.name === 'TokenExpiredError'){
      return { status: 401, error: 'Your session has expired. Please log in again.' };
    } else if(err.name === 'JsonWebTokenError'){
      return { status: 403, error: 'Invalid token.' };
    } else{
      return { status: 500, error: 'Something went wrong with token validation.' };
    };
  };
};

const validateUUID = (providedId, res) => {
  if(!uuidValidate(providedId)){
    console.error({ error: `[${providedId}] is not a valid id. The id must be a valid uuid.` });
    res.status(400).send({ error: `[${providedId}] is not a valid id. The id must be a valid uuid.` });
    return false;
  };
  return true;
};

export { connectToDB, createAccessJWT, createRefreshJWT, validateJWT, validateUUID };