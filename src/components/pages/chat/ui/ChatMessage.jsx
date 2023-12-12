import React from 'react';
import { Card, CloseButton } from 'react-bootstrap';

export default function ChatMessage({ deleteMessageHandler, message, user }) {
  if (!user || typeof user !== 'object' || !loggedUser.id) {
    console.error('Invalid or missing loggedUser:', loggedUser);
    // Handle the case where loggedUser is not properly initialized
    return null; // or provide a default behavior
  }

  const isAuthor = loggedUser.id === message?.User?.id; // Check if the logged user is the author of the message
  const userName = message?.User?.name || 'Unknown User';
  const messageId = message?.id || null;

  const justifyContent = isAuthor ? 'justify-content-end' : 'justify-content-start';

  return (
    <div className={`d-flex ${justifyContent}`}>
      <Card style={{ width: '15rem' }}>
        <Card.Body>
          <Card.Subtitle className="mb-2 text-muted d-flex justify-content-between">
            <p>{userName}</p>
            {isAuthor && (
              <CloseButton
                disabled={!isAuthor}
                onClick={() => deleteMessageHandler(messageId)}
                aria-label="Close"
              />
            )}
          </Card.Subtitle>
          <Card.Text>{message?.text}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
