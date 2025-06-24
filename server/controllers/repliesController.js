import { v4 as genID } from 'uuid';

import { connectToDB, validateUUID } from "./helper.js";

// GET REPLIES OF A SPECIFIC POST
const getAllRepliesByPostId = async (req, res) => {
  const { id } = req.params;

  validateUUID(id, res);

  const client = await connectToDB();
  try{
    const DB_RESPONSE = await client.db('Final_Project').collection('replies').aggregate([
      { $match: { postId: id } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          replyId: '$_id',
          _id: 0,
          reply: 1,
          replyDate: 1,
          lastEditDate: 1,
          userId: 1,
          username: '$userInfo.username',
          avatar: '$userInfo.avatar'
        }
      },
      { $sort: { replyDate: 1 } }
    ]).toArray();


    // decide whether to show in console later
    if(!DB_RESPONSE.length){
      console.error({ error: `No replies were found.` });
      return res.status(404).send({ error: `No replies were found.` });
    };
    res.send(DB_RESPONSE);
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with the server.` });
  } finally{
    await client.close();
  };
};

const postReplyByPostId = async (req, res) => {
  const { id } = req.params;
  validateUUID(id, res);

  const { reply, userId } = req.body;
  validateUUID(userId, res);

  if(!reply || !userId){
    return res.status(400).send({ error: 'Missing required fields, please enter - reply, userId.'});
  };

  const client = await connectToDB();
  try{
    const user = await client.db('Final_Project').collection('users').findOne({ _id: userId });
    if(!user){
      return res.status(404).send({ error: 'User not found.' });
    };

    const newReply = {
      _id: genID(),
      postId: id,
      userId: user._id,
      reply: reply,
      replyDate: new Date()
    };

    await client.db('Final_Project').collection('replies').insertOne(newReply);
    res.send({ success: `Reply posted successfully.` });
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with the server.` });
  } finally{
    await client.close();
  };
};

// PATCH REPLY
const editReply = async (req, res) => {
  const { id } = req.params;
  validateUUID(id, res);

  const { reply } = req.body;
  const client = await connectToDB();
  try{
    let filter = { _id: id };
    if('_id' in req.body || 'replyDate' in req.body || 'userId' in req.body || 'postId' in req.body){
      return res.status(400).send({ error: 'Editing [id], [replyDate], [userId] or [postId] is forbidden.' });
    };

    const editableFields = ['reply'];

    const invalidFields = Object.keys(req.body).filter(field => !editableFields.includes(field));
    if(invalidFields.length){
      return res.status(400).send({ error: `Trying to edit invalid fields: [${invalidFields.join(', ')}]. Fields allowed to edit: [${editableFields.join(', ')}].` });
    };

        // server side validation of input fields
    if('reply' in req.body){
      if(reply.trim().length <= 10){
        return res.status(400).send({ error: 'Reply too short.' });
      };
      if(reply.trim().length > 1000){
        return res.status(400).send({ error: 'Reply too long.' });
      };
    };

    const updateFields = {};
    if('reply' in req.body){
      updateFields.reply = reply;
    };

    updateFields.lastEditDate = new Date();

    if(!Object.keys(req.body).length){
      return res.status(400).send({ error: 'No fields were provided for editing.' });
    };

    let update = { $set: updateFields };
    const DB_Response = await client.db('Final_Project').collection('replies').updateOne(filter, update);
    if(DB_Response.matchedCount === 0){
      return res.status(404).send({ error: `Reply with ID: ${id} was not found.`});
    };

    res.send({ success: `Reply with ID: ${id} was updated successfully.` });
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with the server.` });
  } finally{
    await client.close();
  };
};

const deleteReply = async (req, res) => {
  const { id } = req.params;
  validateUUID(id, res);

  const client = await connectToDB();
  try{
    let filter = { _id: id };
    const DB_Response = await client.db('Final_Project').collection('replies').deleteOne(filter);

    if(!DB_Response.deletedCount){
      return res.status(404).send({ error: `Reply with ID: ${id} was not found.`});
    }
    res.send({ success: `Reply with ID: ${id} was deleted successfully.` });
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with the server.` });
  } finally{
    await client.close();
  };
};

export { getAllRepliesByPostId, postReplyByPostId, editReply, deleteReply };