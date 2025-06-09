import { v4 as genID, validate as uuidValidate } from 'uuid';
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
    if(!(await bcrypt.compare(req.body.password, DB_RESPONSE.password))){
      console.error({ error: `User credentials are incorrect.` });
      return res.status(401).send({ error: `User credentials are incorrect.` });
    };
    const { password, _id, ...user } = DB_RESPONSE;
    const JWT_accessToken = createAccessJWT(user);
    // console.log(JWT_accessToken);
    res.header('Authorization', JWT_accessToken).send({ success: `[${user.email}] was logged in successfully`, userData: user });
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with server, try to log in later.` });
  } finally{
    await client.close();
  };
};

const autoLogin = async (req, res) => {
  // // extract authetication header from request, contains the JWT token in format { Authorization: Bearer <token> }
  // const authHeader = req.headers.authorization;
  // // if thea authentication header is empty, send a message that user needs to re-authenticate
  // if(!authHeader){
  //   return res.status(401).send({ error: 'Token does not exist. Please log in again.' });
  // };
  // // extract the access token from the header and validate
  // const accessToken = authHeader.split(' ')[1];
  // const verifyResults = validateJWT(accessToken);
  // if(verifyResults.error){
  //   return res.status(verifyResults.status).send(verifyResults);
  // };
  res.send({ success: 'User was authenticated.', userData: req.user });
};

const refreshLogin = async (req, res) => {
  const { token } = req.body;
  if(!token){
    return res.status(401).send({ error: 'Token does not exist.' });
  };
  try{
    const user = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = createAccessJWT({ id: user.id, email: user.email });
    res.send({ accessToken: newAccessToken });
  } catch(err){
    res.status(403).send({ error: 'Invalid or expired refresh token.' });
  };
};

const register = async (req, res) => {
  const { email, username, password, gender } = req.body;
  if(!email || !username || !password || !gender){
    return res.status(400).send({ error: 'Missing required fields, please enter - email, username, password, and gender.' });
  };
  const newUser = {
    _id: genID(),
    email: email,
    username: username,
    password: await bcrypt.hash(password, 12),
    gender: gender,
    role: 'user'
  };
  const client = await connectToDB();
  try{
    const user = await client.db('Final_Project').collection('users').findOne({ email });
    if(user){
      return res.status(409).send({ error: `User with email: [${user.email}] already exists.` });
    };
    await client.db('Final_Project').collection('users').insertOne(newUser);
    res.status(201).send({ success: `[${newUser.email}] was registered successfully.` });
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with server.` });
  } finally{
    await client.close();
  };
};

const editUser = async (req, res) => {
  const { id } = req.params;
  const client = await connectToDB();

  if(!uuidValidate(id)){
    console.error({ error: `[${id}] is not a valid id. The id must be a valid uuid.` });
    return res.status(400).send({ error: `[${id}] is not a valid id. The id must be a valid uuid.` });
  };

  try{
    let filter = { _id: id };
    // disallow editing of id and role
    if('_id' in req.body || 'role' in req.body){
      return res.status(400).send({ error: 'Editing [id] or [role] is forbidden.' });
    };

    // define editable fields, check for invalid fields in request body and disallow editing other than the fields listed in editableFields array
    const editableFields = ['email', 'username', 'password', 'gender'];

    const invalidFields = Object.keys(req.body).filter(field => !editableFields.includes(field));
    if(invalidFields.length){
      return res.status(400).send({ error: `Trying to edit invalid fields: [${invalidFields.join(', ')}]. Fields allowed to edit: [${editableFields.join(', ')}].` });
    };

    const updateFields = Object.keys(req.body)
      .filter(field => editableFields.includes(field))
      .reduce((user, field) => {
        user[field] = req.body[field];
        return user;
      }, {});

    if(updateFields.password){
      updateFields.password = await bcrypt.hash(updateFields.password, 12);
    };

    let update = { $set: updateFields };
    const DB_Response = await client.db('Final_Project').collection('users').updateOne(filter, update);
    if(DB_Response.matchedCount === 0){
      return res.status(404).send({ error: `User with ID: ${id} was not found.`});
    };
    res.send({ success: `User with ID: ${id} was updated successfully.` });
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with server.` });
  } finally{
    await client.close();
  };
};

export { login, autoLogin, refreshLogin, register, editUser };