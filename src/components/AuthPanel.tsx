import * as React from 'react';
import { Button } from 'antd';
import { useAuth } from './AuthProvider';

export const AuthPanel = () => {
  const { user, signOut } = useAuth();

  return (
    <div>
      <span className="mr-2">
        {user.firstName} {user.lastName}
      </span>
      <Button onClick={signOut} size="small">
        Sign out
      </Button>
    </div>
  );
};
