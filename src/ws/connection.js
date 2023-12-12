import { Message, User } from '../../db/models';
import {
  ADD_MESSAGE,
  DELETE_MESSAGE,
  HIDE_MESSAGE,
  SEND_MESSAGE,
  STARTED_TYPING,
  STOPPED_TYPING,
} from './actions';

const map = new Map();

const connectionCb = (socket, request) => {
  //
  const userId = request.session.user.id;

  map.set(userId, { ws: socket, user: request.session.user });

  function sendUsers(activeConnections) {
    activeConnections.forEach(({ ws }) => {
      ws.send(
        JSON.stringify({
          type: 'SET_USERS', // уведомили всех юзеров, что новый юзер стал онлайн
          payload: [...map.values()].map(({ user }) => user), // данные, которые отправляются как часть сообщения. ...map - коллекция и метод values()
          // используется для получения всех значений коллекции.
          // Затем используется map, чтобы преобразовать каждое значение, оставив только свойство user из каждого объекта.
        }),
      );
    });
  }

  sendUsers(map);

  socket.on('error', () => {
    map.delete(userId);
    sendUsers(map);
  });
  // самый основной блок
  socket.on('message', async (message) => {
    const actionFromFront = JSON.parse(message); // получили с клиента message  делаем из строки объект и достаем из него тип и данные
    const { type, payload } = actionFromFront; // достаем из объекта тип и данные payload
    switch (
      // пишем ф-цию-reducer switch-case
      type // в зав-ти от типа делаем нужную операцию
    ) {
      case SEND_MESSAGE:
        Message.create({ text: payload, authorId: userId }).then(async (newMessage) => {
          // записали в БД (поля ( text: , authorId: ), как в БД)
          const newMessageWithAuthor = await Message.findOne({
            // добавили автора сообщения для отправки на клиент
            where: { id: newMessage.id }, // ищем сообщение по его id
            include: User, // и добавляем автора
          });
          map.forEach(({ ws }) => {
            // применили forEach что бы отправить ответ всем бзерам на клиент (что бы каждый у себя увидел ответ)
            ws.send(
              JSON.stringify({
                // отправили на клиент все целиком
                type: ADD_MESSAGE,
                payload: newMessageWithAuthor,
              }),
            );
          });
        });
        break;
      case STARTED_TYPING:
        const actionStartedTyping = { type: STARTED_TYPING, payload: map.get(userId).user.name };
        map.forEach(({ ws }) => {
          ws.send(JSON.stringify(actionStartedTyping));
        });
        break;

      case STOPPED_TYPING:
        const actionStoppedTyping = { type: STOPPED_TYPING, payload: null };
        map.forEach(({ ws }) => {
          ws.send(JSON.stringify(actionStoppedTyping));
        });
        break;

      case DELETE_MESSAGE:
        Message.findOne({ where: { id: payload } }).then(async (targetMessage) => {
          if (targetMessage.authorId !== userId) return;
          await Message.destroy({ where: { id: payload } });
          map.forEach(({ ws }) => {
            ws.send(
              JSON.stringify({
                type: HIDE_MESSAGE,
                payload,
              }),
            );
          });
        });
        break;

      default:
        break;
    }
    console.log(`Received message ${message} from user ${userId}`);
  });

  socket.on('close', () => {
    map.delete(userId); // удалили юзера из списка подключенных юзеров
    sendUsers(map); // обновили список пользователей без юзера
  });
};

export default connectionCb;

// socket.on  - ф-ция reducer (switch\case)
// здесь описана основная логика работы сокета
// нужно прописать 4 листенера onlose, onerror, onmessage, onopen. как описали все здесь - возвращаемся на фронт в Chatpage и
// описываем логику (что будет, когда фронт (actionFromBackend) примет ADD_MESSAGE - ответ бэк)

// с клиента из ChatPage приходят запросы сюда на сервер. сервер обраьатывает и отдает обратно
// JSON.stringify({
//   type: ADD_MESSAGE,
//   payload,
// }),
