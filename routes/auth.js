const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const router = express.Router();
const request = require('request');

const redirect_uri = 'http://127.0.0.1:3000/auth';
// redirect to oauth provider
router.get('/login', (req, res, next) => {
  const client_id = process.env.SLACK_CLIENT_ID;
  const url = 'https://slack.com/oauth/authorize';
  const scope = 'users.profile:read';
  const state = 'meow';
  const queryParams = `client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}`;
  res.redirect(url + '?' + queryParams);
});

router.get('/', (req, res, next) => {
  // console.log('req.query.code', req.query.code);
  const code = req.query.code;
  const data = {
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    code: code,
    redirect_uri: redirect_uri
  }
  // console.log('this is data', data);
  var options = {
    method: 'GET',
    uri: 'https://slack.com/api/oauth.access?code=' + code + '&client_id=' + process.env.SLACK_CLIENT_ID + '&client_secret=' + process.env.SLACK_CLIENT_SECRET + '&redirect_uri=' + redirect_uri
  }
  request(options, (err, response, body) => {
    // console.log(response);
    if (!err && response.statusCode === 200) {
      const data = JSON.parse(body);
      req.session.access_token = data.access_token;
      // console.log(response);
      console.log(body);
      // res.send(JSON.parse(body));
      res.redirect('/profile');
    }
  });
});


module.exports = router;
