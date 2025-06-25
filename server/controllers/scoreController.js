import { connectToDB, validateUUID, createAccessJWT } from "./helper.js";

const scorePost = async (req, res) => {
  const { id } = req.params;
  const { plusOrMinus } = req.body;
  const client = await connectToDB();

  validateUUID(id, res);

  if(!['+1', '-1'].includes(plusOrMinus)){
    return res.status(400).send({ error: 'Value must be either [+1] or [-1].' });
  };
  try{
    let filter = { _id: id };
    // mongoDB - increment operator to increment or decrement numeric values
    let update = {  $inc: { score: Number(plusOrMinus) } };
    const DB_Response = await client.db('Final_Project').collection('posts').updateOne(filter, update);
    if(DB_Response.matchedCount === 0){
      return res.status(404).send({ error: `Post with ID: ${id} was not found.`});
    };
    res.send({ success: `Score of Post with ID: ${id} was updated successfully.` });
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with server.` });
  } finally{
    await client.close();
  };
};

// LIKE POST
const likePost = async (req, res) => {
  const { userId, postId } = req.params;

  validateUUID(userId, res);
  validateUUID(postId, res);

  const client = await connectToDB();
  try{
    let filter = { _id: userId };
    const user = await client.db('Final_Project').collection('users').findOne(filter);
    if(!user){
      return res.status(404).send({ error: `User with ID: ${userId} was not found.`});
    };
    const alreadyLiked = user.likedPosts.includes(postId);
    const alreadyDisliked = user.dislikedPosts.includes(postId);
    let scoreDelta = 0;
    if(alreadyLiked){
      await client.db('Final_Project').collection('users').updateOne(
        filter,
        {
          $pull: { likedPosts: postId }
        });
      scoreDelta = -1;
    } else{
      // adds value to array, if the value is not already present, pulls the value from disliked posts array
      await client.db('Final_Project').collection('users').updateOne(
        filter,
        {
          $pull: { dislikedPosts: postId },
          $addToSet: { likedPosts: postId }
        });
      scoreDelta = alreadyDisliked ? 2 : 1;
    };
    await client.db('Final_Project').collection('posts').updateOne(
      { _id: postId },
      { $inc: { score: scoreDelta } }
    );

    const editedUser = await client.db('Final_Project').collection('users').findOne(filter);
    const { password, ...userData } = editedUser;
    const accessToken = createAccessJWT(userData);
    res.header('Authorization', accessToken).send({ success: `Post liked successfully.`, updatedToken: accessToken });
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with server.` });
  } finally{
    await client.close();
  };
};

// DISLIKE POST
const dislikePost = async (req, res) => {
  const { userId, postId } = req.params;

  validateUUID(userId, res);
  validateUUID(postId, res);

  const client = await connectToDB();
  try{
    let filter = { _id: userId };
    const user = await client.db('Final_Project').collection('users').findOne(filter);
    if(!user){
      return res.status(404).send({ error: `User with ID: ${userId} was not found.`});
    };
    const alreadyDisliked = user.dislikedPosts.includes(postId);
    const alreadyLiked = user.likedPosts.includes(postId);
    let scoreDelta = 0;
    if(alreadyDisliked){
      await client.db('Final_Project').collection('users').updateOne(
        filter,
        {
          $pull: { dislikedPosts: postId }
        });
      scoreDelta = 1;
    } else{
      // adds value to array, if the value is not already present, pulls the value from disliked posts array
      await client.db('Final_Project').collection('users').updateOne(
        filter,
        {
          $pull: { likedPosts: postId },
          $addToSet: { dislikedPosts: postId }
        });
      scoreDelta = alreadyLiked ? -2 : -1;
    };
    await client.db('Final_Project').collection('posts').updateOne(
      { _id: postId },
      { $inc: { score: scoreDelta } }
    );

    const editedUser = await client.db('Final_Project').collection('users').findOne(filter);
    const { password, ...userData } = editedUser;
    const accessToken = createAccessJWT(userData);
    res.header('Authorization', accessToken).send({ success: `Post disliked successfully.`, updatedToken: accessToken });
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with server.` });
  } finally{
    await client.close();
  };
};

export { scorePost, likePost, dislikePost };