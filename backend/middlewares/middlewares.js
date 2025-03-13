const authMiddleware = (req, res, next) => {
    // Logique d'authentification (par exemple, vérification du token JWT)
    next();
  };
  
  module.exports = {authMiddleware};
  