import React from 'react';
import { Stack } from 'react-bootstrap';
import MessageForm from './MessageForm';
import MessagesList from './MessagesList';

export default function ChatComponent({
  deleteMessageHandler,
  messages,
  loggedUser,
  submitMessageHandler,
  typingHandler,
}) {
  const writes = true;
  return (
    <Stack>
      <MessagesList
        deleteMessageHandler={deleteMessageHandler}
        messages={messages}
        loggedUser={loggedUser}
      />
      <div className="fs-6 fw-light">{writes ? 'Alex печатает...' : `\xa0`}</div>
      <MessageForm submitMessageHandler={submitMessageHandler} typingHandler={typingHandler } />
    </Stack>
  );
}
// {writes ? 'Alex печатает...' : `\xa0`}
// проверяет условие writes. Если writes истинно, то отображается текст 'Alex печатает...', в противном случае отображается неразрываемый пробел (\xa0).
// Таким образом, когда условие ложно, компонент отображает пустой текстовый узел, который содержит только неразрываемый пробел.
