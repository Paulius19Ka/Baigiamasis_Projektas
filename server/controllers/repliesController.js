import { connectToDB } from "./helper.js";

// GET REPLIES OF A SPECIFIC POST
const getAllRepliesByPostId = async (req, res) => {
  const { id } = req.params;
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
  const client = await connectToDB();
  try{

  } catch(err){

  } finally{
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with the server.` });
  }
};

export { getAllRepliesByPostId, postReplyByPostId };