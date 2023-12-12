import express from 'express';
import morgan from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';

import { createServer } from 'http'; // импорт из node
import { upgradeCb, wsServer } from './ws/wsServer';
import connectionCb from './ws/connection';

import 'dotenv/config';
import jsxRender from './utils/jsxRender';
import apiAuthRouter from './routes/apiAuthRouter';
import indexRouter from './routes/indexRouter';
import resLocals from './middlewares/resLocals';
import sessionParser from './middlewares/sessionParser';
import apiUsersRouter from './routes/apiUsersRouter';

const PORT = process.env.PORT || 3000;
const app = express();

app.engine('jsx', jsxRender);
app.set('view engine', 'jsx');
app.set('views', path.join(__dirname, 'components'));

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(sessionParser);
app.use(resLocals);

const server = createServer(app);
server.on('upgrade', upgradeCb); // слушатель апгрейд колбэк.
wsServer.on('connection', connectionCb); // коннекшн-коллбэк - тут вся логика

app.use('/', indexRouter);
app.use('/api/auth', apiAuthRouter);
app.use('/api/users', apiUsersRouter);

app.listen(PORT, () => console.log(`App has started on port ${PORT}`));
