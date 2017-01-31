const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/', (req, res, next) => {
  const access_token = req.session.access_token;
  // console.log('ACCESS TOKEN ', access_token);
  const url = `https://slack.com/api/users.profile.get?token=${access_token}&pretty=1`;
  const options = {
    method: 'GET',
    url: url
  }
  request(options, (err, response, body) => {
    // if (!err && response.statusCode === 200) {
      const user = JSON.parse(body);
      // console.log(user);
      res.render('profile', {user: user.profile});
    // }
  });
});

router.get('/logout', (req, res, next) => {
  const access_token = req.session.access_token;
  const url = `https://slack.com/api/auth.revoke?token=${access_token}&pretty=1`;
  const options = {
    method: 'GET',
    url: url
  }
  request(options, (err, response, body) => {
    console.log('user logged out');
    // res.send('user logged out');
    // res.send(response);
    res.redirect('/');
  })
})

module.exports = router;
