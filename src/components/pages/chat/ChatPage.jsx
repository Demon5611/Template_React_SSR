import React, { useEffect, useRef, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import UsersList from './ui/UsersList';
import ChatComponent from './ui/ChatComponent';
import {
  ADD_MESSAGE,
  DELETE_MESSAGE,
  HIDE_MESSAGE,
  SEND_MESSAGE,
  SET_USERS,
  SET_TYPER,
  STARTED_TYPING,
  STOPPED_TYPING,
} from '../utils/constants';

// const initUsers = [{ name: 'Alex' }, { name: 'Bob' }, { name: 'Carl' }];

export default function ChatPage({ messages: initMessages, user: loggedUser }) {
  const [messages, setMessages] = useState(initMessages);
  const [users, setUsers] = useState([]); // задали состояния для отображения юзеров
  const socketRef = useRef(null); // Создаем ссылку на сокет скрола (обращаемся к последнему сообщению). useRef предоставляет доступ к DOM-элементу  - ОБЯЗАТЕЛЬНО ПРИ СОЗД ЧАТА на сокетах
  const [wsConect, setwsConect] = useState(false); // для отображения 'CHAT' красной если не подключен и зеленый, если подключен к сокетам
  const [writer, setwriter] = useState(null); // делаем индикацию кто печатает nuul | User['name']

  // поместили всю логику в useEffect и запускаем его только один раз и только при первом рендере компонента, когда он монтируется. Запускается сервер, запускается фронт и открывается соединение
  useEffect(() => {
    function createSocket() {
      const socket = new WebSocket('ws://localhost:3000'); // обьявили перем котор подкл к WS - идем на сервер и прописываем все там
      console.log('Creating WebSocket connection...=====>>>>');
      socket.onopen = () => {
        // при откр сокета уст-м соединение с сервером
        socketRef.current = socket; // положили соединение в обьект current.  изменяемые стейты сокета мы не можем хранить в useEffect (useEffect хранит в себе сост котор вызыв перерисовку компонента при изменении ), поэтому исп useRef
        console.log('Socket connected');
        setwsConect(true); // отображаем 'CHAT'  зеленый, когда подключен
      };

      socket.onclose = () => {
        console.log('Socket disconnected');
        setTimeout(createSocket, 2000); // сделали переконект сокетов на случай. если свет моргнул и все отвалилось
      };

      socket.onerror = (error) => console.error(error);

      socket.onmessage = (event) => {
        const actionFromBackend = JSON.parse(event.data);
        const { type, payload } = actionFromBackend; // принимаем с бэка из reducers из connection.js
        switch (type) {
          case SET_USERS: // на бэк это тоже 'SET_USERS'
            setUsers(payload);
            break;
          case ADD_MESSAGE: // на бэк это  'SEND_MESSAGE'
            setMessages((prev) => [...prev, payload]);
            break;
          case SET_TYPER:
            setwriter(payload);
            break;

          case HIDE_MESSAGE: // на бэк это  'DELETE_MESSAGE'
            setMessages((prev) => prev.filter((post) => post.id !== payload));
            break;
          default:
            break;
        }
      };
    }
    createSocket();
  }, []);

  const submitMessageHandler = (inputText) => {
    if (!socketRef.current) return;
    const action = { type: SEND_MESSAGE, payload: inputText };
    socketRef.current.send(JSON.stringify(action));
  };

  const deleteMessageHandler = (id) => {
    if (!socketRef.current) return;
    const action = { type: DELETE_MESSAGE, payload: id };
    socketRef.current.send(JSON.stringify(action));
  };

  const typingHandler = (isTyping) => {
    if (isTyping && socketRef.current)
      socketRef.current.send(JSON.stringify({ type: STARTED_TYPING }));
    else if (!isTyping && socketRef.current)
      socketRef.current.send(JSON.stringify({ type: STOPPED_TYPING }));
  };

  return (
    <Container>
      <Row>
        <Col xs={2}>
          <UsersList users={users} />
        </Col>
        <Col xs={10}>
          <ChatComponent
            deleteMessageHandler={deleteMessageHandler}
            submitMessageHandler={submitMessageHandler}
            typingHandler={typingHandler}
            messages={messages}
            loggedUser={loggedUser}
          />
          {writer && `${writer} is typing...`}
        </Col>
      </Row>
    </Container>
  );
}
