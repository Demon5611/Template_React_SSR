import React from 'react';
import { Stack } from 'react-bootstrap';
import ChatMessage from './ChatMessage';

export default function MessagesList({ deleteMessageHandler, messages, loggedUser }) {
  return (
    <div className="overflow-auto" style={{ height: '23rem' }}>
      <Stack>
        {messages.map((message) => (
          <ChatMessage
            deleteMessageHandler={deleteMessageHandler}
            message={message}
            key={message.id}
            loggedUser={loggedUser}
          />
        ))}
      </Stack>
    </div>
  );
}
