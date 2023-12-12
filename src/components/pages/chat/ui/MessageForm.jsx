import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import SendIcon from '../ui/icons/SendIcon';

export default function MessageForm({ submitMessageHandler, typingHandler }) {
  const [input, setInput] = useState('');
  const handleChange = (e) => setInput(e.target.value);

  // создаем useEffect который будет следить за инпутом, что бы подсветить индикацию кто печатает

  useEffect(() => {
    if (input.length) typingHandler(true);
    else typingHandler(false);
  }, [input]);
  // дописать код на бэк в connection - принять/  допишем STARTED_TYPING

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        submitMessageHandler(input);
        setInput('');
      }}
    >
      <InputGroup className="mb-3">
        <Form.Control
          onChange={handleChange}
          value={input}
          placeholder="Recipient's username"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
        />
        <InputGroup.Text id="basic-addon2">
          <Button type="submit" variant="outline-primary">
            <SendIcon />
          </Button>
        </InputGroup.Text>
      </InputGroup>
    </Form>
  );
}
