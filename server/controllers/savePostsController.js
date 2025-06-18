import { connectToDB } from "./helper.js";

const savePost = async (req, res) => {
  const { userId, postId } = req.params;
  const client = await connectToDB();
  try{
    let filter = { _id: userId };
    // adds value to array, if the value is not already present
    let update = { $addToSet: { savedPosts: postId } };
    const DB_Response = await client.db('Final_Project').collection('users').updateOne(filter, update);
    if(DB_Response.matchedCount === 0){
      return res.status(404).send({ error: `User with ID: ${userId} was not found.`});
    };

    res.send({ success: `Post saved successfully.` });
  } catch(err){
    console.error(err);
    res.status(500).send({ error: err, message: `Something went wrong with server.` });
  } finally{
    await client.close();
  };
};

export { savePost };