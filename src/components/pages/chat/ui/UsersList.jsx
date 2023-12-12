import React from 'react';
import { Stack } from 'react-bootstrap';
import DotOnlineIcon from './icons/DotOnlineIcon';

export default function UsersList({ users }) {
  return (
    <Stack>
      {users.map((user) => (
        <div className="p-2" key={user.id}>
          <DotOnlineIcon />
          {user.name}
        </div>
      ))}
    </Stack>
  );
}
