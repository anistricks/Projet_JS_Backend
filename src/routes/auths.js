var express = require("express");
var router = express.Router();
const { Users } = require("../model/users.js");
const userModel = new Users();

/* Register a user : POST /auths/register */
router.post("/register", async function (req, res, next) {
  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("username") && req.body.username.length === 0) ||
    (req.body.hasOwnProperty("password") && req.body.password.length === 0)
  )
    return res.status(400).end();

  const authenticatedUser = await userModel.register(
    req.body.username,
    req.body.password
  );
  // Error code '409 Conflict' if the username already exists
  if (!authenticatedUser) return res.status(409).end();

  // Create the session data (to be put into a cookie)
  req.session.username = authenticatedUser.username;
  req.session.token = authenticatedUser.token;

  return res.json({ username: authenticatedUser.username });
});

/* login a user : POST /auths/login */
router.post("/login", async function (req, res, next) {
  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("username") && req.body.username.length === 0) ||
    (req.body.hasOwnProperty("password") && req.body.password.length === 0)
  )
    return res.status(400).end();

  const authenticatedUser = await userModel.login(
    req.body.username,
    req.body.password
  );
  // Error code '401 Unauthorized' if the user could not be authenticated
  if (!authenticatedUser) return res.status(401).end();

  // Create the session data (to be put into a cookie)
  req.session.username = authenticatedUser.username;
  req.session.token = authenticatedUser.token;

  return res.json({ username: authenticatedUser.username });
});

/* Logout a user : POST /auths/logout */
router.get("/logout", async function (req, res, next) {
  req.session = null;
  return res.status(200).end();
});


/*
router.post("/score/:username", authorize , function (req , res, next) {

  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("highScore") && req.body.highScore.length === 0) ||
    (req.body.hasOwnProperty("username") && req.body.username.length === 0)
  )
    return res.status(400).end();

  const highScore = userModel.getHighscore(req.body.username);
  if(req.body)
  const score = userModel.updateHighScore(req.body.username, {highScore: req.body.highScore} )
  });
*/

router.post("/score", function (req, res) {
  console.log(`POST /auths/score/${req.body.username}`);
  
  //let highScore = userModel.getHighscore(req.body.username);
  //const user = userModel.updateOne(req.body.username, req.body.highScore);
  const user = userModel.updateHighScore(req.body.username, req.body)
  // Send an error code 'Not Found' if the user was not found :
  if (!user) return res.status(404).end();
  //let highScore = userModel.getHighscore();
  return res.json(user);
});

  


module.exports = router;
