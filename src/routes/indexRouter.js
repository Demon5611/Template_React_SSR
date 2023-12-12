import express from 'express';
import { Message, User } from '../../db/models';

const router = express.Router();

router.get('/', async (req, res) => {
  const initState = { hello: 'world' };
  res.render('Layout', initState);
});

router.get('/chat', async (req, res) => {
  const messages = await Message.findAll({ include: User });
  res.render('Layout', { messages });
});

router.get('/login', async (req, res) => {
  res.render('Layout');
});

router.get('/reg', (req, res) => {
  res.render('Layout');
});
router.get('/logout', async (req, res) => {
  req.session.destroy();
  res.clearCookie('user_sid');
  res.redirect('/');
});

export default router;
