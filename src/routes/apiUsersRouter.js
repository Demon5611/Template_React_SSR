import express from 'express';
import { User } from '../../db/models';

const apiUsersRouter = express.Router();

apiUsersRouter.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const user = await User.findByPk(id);
    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();
    // Теперь обновим сессию, так как в ней всё ещё старые данные
    req.session.user = user;
    req.session.save();
    return res.json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default apiUsersRouter;

// deprecated res.json(obj, status): Use res.status(status).json(obj)
