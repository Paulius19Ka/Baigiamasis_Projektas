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
  }
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
  }
};

export { getAllRepliesByPostId, postReplyByPostId };