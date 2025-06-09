import { validateJWT } from '../controllers/helper.js';

const verifyJWT = (req, res, next) => {
  // extract authetication header from request, contains the JWT token in format { Authorization: Bearer <token> }
  const authHeader = req.headers.authorization;
  // if thea authentication header is empty, send a message that user needs to re-authenticate
  if(!authHeader){
    return res.status(401).send({ error: 'Token does not exist. Please log in again.' });
  };
  // extract the access token from the header and validate
  const accessToken = authHeader.split(' ')[1];
  const verifyResults = validateJWT(accessToken);
  if(verifyResults.error){
    return res.status(verifyResults.status).send(verifyResults);
  };
  req.user = verifyResults;
  next();
};

const verifyAdmin = (req, res, next) => {
  if(req.headers.role === 'admin'){
    next();
  } else {
    res.status(401).send({ error: `You do not have permission to access this information.` });
  };
};

export { verifyJWT, verifyAdmin };