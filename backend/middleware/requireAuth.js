const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  // 1. Check if the request has an "Authorization" header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  // 2. The header looks like: "Bearer <token_string>"
  // We need to split the string to get just the token part
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. Invalid token format." });
  }

  try {
    // 3. Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Attach the user info to the request object
    // Now, every route after this can just use "req.user" to know who is logged in!
    req.user = decoded; 
    
    next(); // Let them pass to the next step

  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = requireAuth;