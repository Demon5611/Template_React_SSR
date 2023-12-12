// eslint-disable-next-line import/no-extraneous-dependencies
import { WebSocketServer } from 'ws';
import sessionParser from '../middlewares/sessionParser';

export const wsServer = new WebSocketServer({
  clientTracking: false, // отключаем трекинг клиентов, т.к. мы его запускаем отдельно
  noServer: true, // отключаем сервер, т.к. мы его запускаем отдельно
});

export const upgradeCb = (request, socket, head) => {
  socket.on('error', (err) => {
    console.log('Socket error:', err);
  });

  console.log('Parsing session from request...');
  sessionParser(request, {}, () => {
    if (!request.session.user) {
      socket.write('HTTP/1.1 401 Unauthorized\n\n');
      socket.destroy(); // закрываем сокет если не авторизован
      return;
    }
    console.log('Session is parsed!');

    socket.removeListener('error', (err) => {
      console.log('Socket error:', err);
    });

    wsServer.handleUpgrade(request, socket, head, (ws) => {
      wsServer.emit('connection', ws, request); // отправляем всем подключенным клиентам обновленный клиент
    });
  });
};

// мидлвара для обработки запросов от клиента, проверяем залогинен ли он или нет и отдаем все в апгрейд колбэк upgradeCb
