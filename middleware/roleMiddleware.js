const isAdmin = (req, res, next) => {
  if (req.user.user_role === "user") {
    // console.log('asd');
    return res.status(403).json({ message: 'Nincs jogosultság!' })
  }
  next()
}

module.exports = { isAdmin }