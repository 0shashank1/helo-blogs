const { validateToken } = require("../services/authentication");

//validates token
function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error) { 
      console.error("Token validation failed:", error.message);
      res.redirect("/");
    }

    return next();
  };
}

module.exports = {
  checkForAuthenticationCookie,
};
