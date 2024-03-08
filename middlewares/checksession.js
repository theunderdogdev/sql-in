/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
*/
const checkSession = (req, res, next) => {
    const hasUserId = req.session.userId !== undefined;
    const hasExpiration = req.session.cookie.expires !== undefined;
    const now = new Date();
    if (hasUserId && hasExpiration && req.session.cookie.expires > now) {
      return next();
    }
    return res.status(401).json({ msg: "Session Expired" });
  };

  module.exports.checkSession = checkSession;