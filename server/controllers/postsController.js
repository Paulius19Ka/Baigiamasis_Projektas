import { validate as uuidValidate, v4 as genID } from 'uuid';

import { connectToDB } from "./helper.js";

const getAllPosts = async (req, res) => {
  const client = await connectToDB();
  try{
    const DB_RESPONSE = await client.db('Final_Project').collection('posts').find().sort().skip(0).limit(25).toArray();
    if(!DB_RESPONSE.length){
      console.error({ error: `No posts were found.` });
      return res.status(404).send({ error: `No posts were found.` });
    };
    res.send(DB_RESPONSE);
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with the server.` });
  } finally{
    await client.close();
  };
};

const getPostById = async (req, res) => {
  const { id } = req.params;
  const client = await connectToDB();

  if(!uuidValidate(id)){
    console.error({ error: `[${id}] is not a valid id. The id must be a valid uuid.` });
    return res.status(400).send({ error: `[${id}] is not a valid id. The id must be a valid uuid.` });
  };

  let filter = { _id: id };
  try{
    const DB_RESPONSE = await client.db('Final_Project').collection('posts').findOne(filter);
    if(!DB_RESPONSE){
      console.error({ error: `Post [id: ${id}] was not found.`});
      return res.status(404).send({ error: `Post [id: ${id}] was not found.`});
    };
    res.send(DB_RESPONSE);
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with the server.` });
  } finally{
    await client.close();
  };
};

const topics = [ 'Misc', 'General', 'Releases', 'Cllecting', 'Concerts', 'Rock/Blues', 'Pop/Dance', 'Metal/Hard Rock', 'Jazz', 'Classical', 'Electronic', 'Country/Folk', 'Soul/Rap', 'Alternative'];

const createPost = async (req, res) => {
  const { title, content, topic, userId } = req.body;

  if(!uuidValidate(userId)){
    console.error({ error: `[${userId}] is not a valid id. The id must be a valid uuid.` });
    return res.status(400).send({ error: `[${userId}] is not a valid id. The id must be a valid uuid.` });
  };

  if(!title || !content || !topic || !userId){
    return res.status(400).send({ error: 'Missing required fields, please enter - title, content, topic, userId.'});
  };

  if(!topics.includes(topic)){
    return res.status(400).send({ error: `Incorrect topic. Allowed topics: ${topics.join(', ')}.` });
  }

  const client = await connectToDB();
  try{
    const user = await client.db('Final_Project').collection('users').findOne({ _id: userId });
    if(!user){
      return res.status(404).send({ error: 'User not found.' });
    };

    const newPost = {
      _id: genID(),
      postDate: new Date(),
      postedBy: {
        username: user.username,
        userId: user._id
      },
      title: title,
      content: content,
      topic: topic,
      score: 0
    };
    await client.db('Final_Project').collection('posts').insertOne(newPost);
    res.send({ success: `Post created successfully.` });
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with the server.` });
  } finally{
    await client.close();
  };
};

export { getAllPosts, getPostById, createPost };