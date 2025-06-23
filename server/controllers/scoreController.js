import { connectToDB, validateUUID } from "./helper.js";

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

export { scorePost };