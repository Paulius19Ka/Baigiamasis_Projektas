import { v4 as genID } from 'uuid';
import bcrypt from 'bcrypt';

import { connectToDB, createAccessJWT, validateUUID } from "./helper.js";

// LOGIN
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

// AUTO LOGIN
const autoLogin = async (req, res) => {
  res.send({ success: 'User was authenticated.', userData: req.user });
};

// REFRESH LOGIN
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

// REGISTER
const register = async (req, res) => {
  const { email, username, password, gender, avatar } = req.body;
  if(!email || !username || !password || !gender || avatar === undefined){
    return res.status(400).send({ error: 'Missing required fields, please enter - email, username, password, avatar, gender.' });
  };
  const newUser = {
    _id: genID(),
    email: email,
    username: username,
    password: await bcrypt.hash(password, 12),
    gender: gender,
    avatar: avatar || "",
    role: 'user',
    savedPosts: []
  };
  const client = await connectToDB();
  try{
    const user = await client.db('Final_Project').collection('users').findOne({ $or: [{ email }, { username }] });
    if(user){
      if(user.email === email && user.username === username){
        return res.status(409).send({ error: `User with email: [${user.email}] and username: [${user.username}] already exists.` });
      } else if(user.email === email){
        return res.status(409).send({ error: `User with email: [${user.email}] already exists.` });
      } else if(user.username === username){
        return res.status(409).send({ error: `User with username: [${user.username}] already exists.` });
      };
    };
    await client.db('Final_Project').collection('users').insertOne(newUser);
    const { password, ...userData } = newUser;
    const JWT_accessToken = createAccessJWT(userData);
    res.status(201).header('Authorization', JWT_accessToken).send({ success: `[${newUser.email}] was registered successfully.`, userData });
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with server.` });
  } finally{
    await client.close();
  };
};

// GET USER ID
const getId = async (req, res) => {
  const client = await connectToDB();
  try{
    const DB_RESPONSE = await client.db('Final_Project').collection('users').findOne({ email: req.user.email });
    if(!DB_RESPONSE){
      console.error({ error: `User not found.` });
      return res.status(404).send({ error: `User not found.` });
    };
    res.send({ id: DB_RESPONSE._id });
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with server.` });
  } finally{
    await client.close();
  };
};

// EDIT USER
const editUser = async (req, res) => {
  const { id } = req.params;
  const client = await connectToDB();

  validateUUID(id, res);

  try{
    let filter = { _id: id };
    // disallow editing of id and role
    if('_id' in req.body || 'role' in req.body){
      return res.status(400).send({ error: 'Editing [id] or [role] is forbidden.' });
    };

    // define editable fields, check for invalid fields in request body and disallow editing other than the fields listed in editableFields array
    const editableFields = ['email', 'username', 'oldPassword', 'password', 'gender', 'avatar'];

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

    // if editing password, enter the old password, check if they match, then hash and update the password
    if(updateFields.password){
      if(!req.body.oldPassword){
        return res.status(400).send({ error: `To edit Your password, the old password must be entered.` });
      };

      const user = await client.db('Final_Project').collection('users').findOne(filter);
      if(!user){
        return res.status(404).send({ error: `User with ID: ${id} was not found.`});
      };

      const passwordsMatch = await bcrypt.compare(req.body.oldPassword, user.password);
      if(!passwordsMatch){
        return res.status(400).send({ error: `The old password is incorrect.`});
      };
      updateFields.password = await bcrypt.hash(updateFields.password, 12);
    };

    delete updateFields.oldPassword; // exclude old password from updated fields

    let update = { $set: updateFields };
    const DB_Response = await client.db('Final_Project').collection('users').updateOne(filter, update);
    if(DB_Response.matchedCount === 0){
      return res.status(404).send({ error: `User with ID: ${id} was not found.`});
    };
    
    const editedUser = await client.db('Final_Project').collection('users').findOne(filter);
    const { password, _id, ...userData } = editedUser;
    // create and send an updated access token
    const accessToken = createAccessJWT(userData);
    res.header('Authorization', accessToken).send({ success: `User with ID: ${id} was updated successfully.`, updatedToken: accessToken });
    // res.send({ success: `User with ID: ${id} was updated successfully.` });
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with server.` });
  } finally{
    await client.close();
  };
};

export { login, autoLogin, refreshLogin, register, editUser, getId };