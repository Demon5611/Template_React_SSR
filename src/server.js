import express from 'express';
import morgan from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import jsxRender from './utils/jsxRender';
import apiAuthRouter from './routes/apiAuthRouter';
import indexRouter from './routes/indexRouter';
import resLocals from './middlewares/resLocals';
import sessionParser from './middlewares/sessionParser';

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

app.use('/', indexRouter);
app.use('/api/auth', apiAuthRouter);

app.listen(PORT, () => console.log(`App has started on port ${PORT}`));
