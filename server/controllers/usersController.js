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

export { getAllUsers };