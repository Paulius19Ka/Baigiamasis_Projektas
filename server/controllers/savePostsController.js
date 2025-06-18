import { connectToDB, createAccessJWT, validateUUID } from "./helper.js";

// SAVE POST
const savePost = async (req, res) => {
  const { userId, postId } = req.params;

  validateUUID(userId, res);
  validateUUID(postId, res);

  const client = await connectToDB();
  try{
    let filter = { _id: userId };
    // adds value to array, if the value is not already present
    let update = { $addToSet: { savedPosts: postId } };
    const DB_Response = await client.db('Final_Project').collection('users').updateOne(filter, update);
    if(DB_Response.matchedCount === 0){
      return res.status(404).send({ error: `User with ID: ${userId} was not found.`});
    };

    const editedUser = await client.db('Final_Project').collection('users').findOne(filter);
    const { password, ...userData } = editedUser;
    const accessToken = createAccessJWT(userData);
    res.header('Authorization', accessToken).send({ success: `Post saved successfully.`, updatedToken: accessToken });
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with server.` });
  } finally{
    await client.close();
  };
};

// GET ALL SAVED POSTS
const getSavedPosts = async (req, res) => {
  const { userId } = req.params;

  validateUUID(userId, res);

  const client = await connectToDB();
  try{
    let filter = { _id: userId };
    const DB_Response = await client.db('Final_Project').collection('users').findOne(filter);
    if(!DB_Response){
      return res.status(404).send({ error: `User with ID: ${userId} was not found.`});
    };

    res.send({ savedPosts: DB_Response.savedPosts });
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with server.` });
  } finally{
    await client.close();
  };
};

// REMOVE SAVED POST
const removeSavedPost = async (req, res) => {
  const { userId, postId } = req.params;

  validateUUID(userId, res);
  validateUUID(postId, res);

  const client = await connectToDB();
  try{
    let filter = { _id: userId };
    // removes all isntances of the value from array
    let update = { $pull: { savedPosts: postId } };
    const DB_Response = await client.db('Final_Project').collection('users').updateOne(filter, update);
    if(DB_Response.matchedCount === 0){
      return res.status(404).send({ error: `User with ID: ${userId} was not found.`});
    };

    res.send({ success: `Post removed from saved posts successfully.` });
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with server.` });
  } finally{
    await client.close();
  };
};

export { savePost, getSavedPosts, removeSavedPost };