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
  const scope = 'users:read';
  const state = 'meow';
  // const team = 'the-wanderers';
  const queryParams = `client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}`;
  res.redirect(url + '?' + queryParams);
});

router.get('/', (req, res, next) => {
  console.log('req.query.code', req.query.code);
  const code = req.query.code;
  const data = {
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    code: code,
    redirect_uri: redirect_uri
    // state: req.query.state
  }
  console.log('this is data', data);
  const options = {
    method: 'POST',
    url: 'https://slack.com/api/oauth.access',
    headers: {
     // { 'Accept': 'application/json'},
      'content-type': 'application/json; charset=utf-8'
    },
    // contentType: 'application/json',
    // contentType: 'application/json;charset=ISO-8859-15',
    json: data
  }
  request(options, (err, response, body) => {
    // console.log(response);
    if (!err && response.statusCode === 200) {
      req.session.access_token = body.access_token;
      // res.redirect('/profile');
      // console.log(response);
      console.log(body);
      res.send(body);
    }
    // else {
    //   console.log(body);
    //   res.send(body);
    // }
  });
});


module.exports = router;
