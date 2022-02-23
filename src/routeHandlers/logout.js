/**
 * This route handler implements /logout
 */

module.exports.handleLogout = (req, res) => {
  res.clearCookie('jwt');
  res.redirect('/');
};
