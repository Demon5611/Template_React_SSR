import bcrypt from 'bcrypt';
import express from 'express';
import { User } from '../../db/models';

const authRouter = express.Router();

// регистрация пользователя
authRouter.post('/reg', async (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Заполни все поля' });
  }
  const hashPassword = await bcrypt.hash(password, 5);
  const [user, created] = await User.findOrCreate({
    where: { email },
    defaults: {
      email,
      name,
      password: hashPassword,
    },
  });

  if (!created) {
    return res.status(400).json({ message: 'Такое email уже занят!!!!' });
  }
  delete user.dataValues.password;
  req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email,
  };
  res.sendStatus(200);
});

// авторизация пользователя
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Заполни все поля' });
  }

  const userSet = await User.findOne({ where: { email } });
  if (!userSet) {
    console.error('Пользователь не найден или не инициализирован.');
    return res.status(400).json({ message: 'Пользователь не найден или не инициализирован.' });
  }
  const isValidPass = await bcrypt.compare(password, userSet.password);

  if (!isValidPass) {
    console.error('Неверный email, password');
    return res.status(400).json({ message: 'Неверный email или password' });
  }
  delete userSet.dataValues.password;
  req.session.user = {
    id: userSet.id,
    name: userSet.name,
    email: userSet.email,
  };
  res.json('user setup==>', 200);
});

authRouter.get('/logout', async (req, res) => {
  req.session.destroy();
  res.clearCookie('user_sid');
  res.redirect('/');
});

export default authRouter;
