import { validate as uuidValidate } from 'uuid';

import { connectToDB } from "./helper.js";

const getAllUsers = async (req, res) => {
  const client = await connectToDB();
  try{
    const DB_RESPONSE = await client.db('Final_Project').collection('users').find().sort().skip(0).limit(25).toArray();
    if(!DB_RESPONSE.length){
      console.error({ error: `No users were found.` });
      return res.status(404).send({ error: `No users were found.` });
    };
    res.send(DB_RESPONSE);
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with the server.` });
  } finally{
    await client.close();
  };
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  const client = await connectToDB();

  if(!uuidValidate(id)){
    console.error({ error: `[${id}] is not a valid id. The id must be a valid uuid.` });
    return res.status(400).send({ error: `[${id}] is not a valid id. The id must be a valid uuid.` });
  };

  let filter = { _id: id };
  try{
    const DB_RESPONSE = await client.db('Final_Project').collection('users').findOne(filter);
    if(!DB_RESPONSE){
      console.error({ error: `User [id: ${id}] was not found.`});
      return res.status(404).send({ error: `User [id: ${id}] was not found.`});
    };
    res.send(DB_RESPONSE);
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with the server.` });
  } finally{
    await client.close();
  };
};

export { getAllUsers, getUserById };