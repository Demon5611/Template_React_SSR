import session from 'express-session';
import store from 'session-file-store';

require('dotenv').config();

const FileStore = store(session);

const sessionParser = session({
  name: process.env.COOKIE_NAME,
  store: new FileStore({}),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 12,
    httpOnly: true,
  },
});

export default sessionParser;
