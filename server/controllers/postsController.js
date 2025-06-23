import { validate as uuidValidate, v4 as genID } from 'uuid';

import { connectToDB, validateUUID } from "./helper.js";
import { postsQuery } from './postsQuery.js';

// GET POSTS
const getAllPosts = async (req, res) => {
  const client = await connectToDB();
  try{
    const settings = postsQuery(req.query);
    // const DB_RESPONSE = await client.db('Final_Project').collection('posts').find(settings.filter).sort(settings.sort).skip(settings.skip).limit(settings.limit).toArray();

    // copy settings.filter, then delete replyCount, so that it is not used too early, because replyCount is created later in the aggregation pipeline
    const initialFilter = { ...settings.filter };
    delete initialFilter.replyCount;

    // get posts with number of replies
    const DB_RESPONSE = await client.db('Final_Project').collection('posts').aggregate([
      { $match: initialFilter },
      {
        '$lookup': {
          'from': 'replies', 
          'localField': '_id', 
          'foreignField': 'postId', 
          'as': 'replies'
        }
      },
      {
        '$addFields': {
          'replyCount': {
            '$size': '$replies'
          }
        }
      },
      ...(settings.filter?.replyCount ?
      [{ $match: { replyCount: settings.filter.replyCount } }] : []),
      settings.sortStage ?
      { $sort: settings.sortStage } :
      { $sort: settings.sort },
      { $skip: settings.skip },
      { $limit: settings.limit },
      {
        '$project': {
          'postedBy': 1, 
          'score': 1, 
          'lastEditDate': 1, 
          'topic': 1, 
          'postDate': 1, 
          '_id': 1, 
          'title': 1, 
          'content': 1, 
          'replyCount': 1
        }
      }
    ]).toArray();


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

// GET POSTS COUNT
const getPostCount = async (req, res) => {
  const client = await connectToDB();
  try{
    const settings = postsQuery(req.query);
    const initialFilter = { ...settings.filter };
    delete initialFilter.replyCount;

    const DB_RESPONSE = await client.db('Final_Project').collection('posts').aggregate([
      { $match: initialFilter },
      {
        $lookup: {
          from: 'replies',
          localField: '_id',
          foreignField: 'postId',
          as: 'replies'
        }
      },
      {
        $addFields: {
          replyCount: { $size: '$replies' }
        }
      },
      ...(settings.filter?.replyCount ?
      [{ $match: { replyCount: settings.filter.replyCount } }] : []),
      { $count: 'count' }
    ]).toArray();

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

// GET POST BY ID
const getPostById = async (req, res) => {
  const { id } = req.params;
  const client = await connectToDB();

  validateUUID(id, res);

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

const topics = [ 'Misc', 'General', 'Releases', 'Collecting', 'Concerts', 'Rock-Blues', 'Pop-Dance', 'Metal-Hard Rock', 'Jazz', 'Classical', 'Electronic', 'Country-Folk', 'Soul-Rap', 'Alternative'];

// POST POST
const createPost = async (req, res) => {
  const { title, content, topic, userId } = req.body;

  validateUUID(userId, res);

  if(!title || !content || !topic || !userId){
    return res.status(400).send({ error: 'Missing required fields, please enter - title, content, topic, userId.'});
  };

  // server side validation of input fields
  if(title.trim().length <= 5){
    return res.status(400).send({ error: 'Title too short.' });
  };
  if(title.trim().length > 100){
    return res.status(400).send({ error: 'Title too long.' });
  };
  if(content.trim().length <= 20){
    return res.status(400).send({ error: 'Content too short.' });
  };
  if(content.trim().length > 2000){
    return res.status(400).send({ error: 'Content too long.' });
  };
  if(!topics.includes(topic)){
    return res.status(400).send({ error: `Incorrect topic. Allowed topics: ${topics.join(', ')}.` });
  };

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

// PATCH POST
const editPost = async (req, res) => {
  const { id } = req.params;
  const { title, content, topic } = req.body;
  const client = await connectToDB();

  validateUUID(id, res);

  try{
    let filter = { _id: id };
    // disallow editing of id and postDate, postedBy
    if('_id' in req.body || 'postDate' in req.body || 'postedBy' in req.body){
      return res.status(400).send({ error: 'Editing [id], [postDate] or [postedBy] is forbidden.' });
    };

    // define eitable fields, so that new random fields cannot be added
    const editableFields = ['title', 'content', 'topic'];

    const invalidFields = Object.keys(req.body).filter(field => !editableFields.includes(field));
    if(invalidFields.length){
      return res.status(400).send({ error: `Trying to edit invalid fields: [${invalidFields.join(', ')}]. Fields allowed to edit: [${editableFields.join(', ')}].` });
    };

    // server side validation of input fields
    if('title' in req.body){
      if(title.trim().length <= 5){
        return res.status(400).send({ error: 'Title too short.' });
      };
      if(title.trim().length > 100){
        return res.status(400).send({ error: 'Title too long.' });
      };
    };
    if('content' in req.body){
      if(content.trim().length <= 20){
        return res.status(400).send({ error: 'Content too short.' });
      };
      if(content.trim().length > 2000){
        return res.status(400).send({ error: 'Content too long.' });
      };
    };
    if('topic' in req.body){
      if(!topics.includes(topic)){
        return res.status(400).send({ error: `Incorrect topic. Allowed topics: ${topics.join(', ')}.` });
      };
    };

    const updateFields = {};
    if('title' in req.body){
      updateFields.title = title;
    };
    if('content' in req.body){
      updateFields.content = content;
    };
    if('topic' in req.body){
      updateFields.topic = topic;
    };

    updateFields.lastEditDate = new Date();

    if(!Object.keys(req.body).length){
      return res.status(400).send({ error: 'No fields were provided for editing.' });
    };

    let update = { $set: updateFields };
    const DB_Response = await client.db('Final_Project').collection('posts').updateOne(filter, update);
    if(DB_Response.matchedCount === 0){
      return res.status(404).send({ error: `Post with ID: ${id} was not found.`});
    };

    res.send({ success: `Post with ID: ${id} was updated successfully.` });
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with server.` });
  } finally{
    await client.close();
  };
};

// DELETE POST
const deletePost = async (req, res) => {
  const { id } = req.params;
  const client = await connectToDB();

  validateUUID(id, res);

  try{ 
    let filter = { _id: id };
    const DB_Response = await client.db('Final_Project').collection('posts').deleteOne(filter);

    if(!DB_Response.deletedCount){
      return res.status(404).send({ error: `Post with ID: ${id} was not found.`});
    };

    // delete associated replies
    await client.db('Final_Project').collection('replies').deleteMany({ postId: id });
    // delete saved post id from users
    await client.db('Final_Project').collection('users').updateMany(
      { savedPosts: id },
      { $pull: { savedPosts: id } }
    );

    res.send({ success: `Post with ID: ${id} was deleted successfully.` });
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with server.` });
  } finally{
    await client.close();
  }
};

export { getAllPosts, getPostById, createPost, editPost, deletePost, getPostCount };