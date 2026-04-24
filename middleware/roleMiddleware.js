const isAdmin = (req, res, next) => {
  console.log(req.user.user_role);
  if (req.user.user_role === "user") {
   
    return res.status(403).json({ message: 'Nincs jogosultság!' })
  }
  next()
}

module.exports = { isAdmin }