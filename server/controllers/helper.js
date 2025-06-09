import { MongoClient } from "mongodb";
import jwt from 'jsonwebtoken';

const DB_CONNECTION_STRING = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASS}@${process.env.DB_CLUSTER}.${process.env.DB_CLUSTER_ID}.mongodb.net/`;

const connectToDB = async () => {
  return await MongoClient.connect(DB_CONNECTION_STRING);
};

const createAccessJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET);
};

const validateJWT = (providedJWT) => {
  let response;
  jwt.verify(providedJWT, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if(err){
      response = { error: 'Your session has expired. Please log in again' };
    } else {
      response = decoded;
    };
  });
  return response;
};

export { connectToDB, createAccessJWT, validateJWT };