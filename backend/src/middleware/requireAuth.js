module.exports = function requireAuth(role) {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect("/");
    }

    if (role && req.user.role !== role) {
      return res.status(403).send("Access Denied");
    }

    next();
  };
};
