import * as React from 'react';
import { notification } from 'antd';
import { gql, useMutation, useQuery } from '@apollo/client';
import { SignIn } from './SignIn';
import { GTypes } from '../__generated__/GTypes';
import { EmptyLayout } from './EmptyLayout';
import { removeItem, setItem } from '../utils/localStorage';

const query = gql`
  query AuthProviderQuery {
    auth {
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

const signInMutation = gql`
  mutation AuthProviderSignInMutation($input: CreateAuthInput!) {
    payload: createAuth(input: $input) {
      jwtToken
    }
  }
`;

const signOutMutation = gql`
  mutation AuthProviderSignOutMutation {
    payload: deleteAuth {
      jwtToken
    }
  }
`;

const AuthContext = React.createContext(null);

type UseAuthType = GTypes.AuthProviderQuery['auth'] & {
  signOut: () => void;
};

export const useAuth = (): UseAuthType => React.useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { data, error, loading, refetch } = useQuery<GTypes.AuthProviderQuery>(query);

  const [signInMutate] = useMutation<GTypes.AuthProviderSignInMutation, GTypes.AuthProviderSignInMutationVariables>(
    signInMutation,
  );

  const [signOutMutate] = useMutation<GTypes.AuthProviderSignOutMutation, GTypes.AuthProviderSignOutMutationVariables>(
    signOutMutation,
  );

  const signIn = (input: { email: string; password: string }) => {
    signInMutate({ variables: { input } })
      .then((result) => {
        setItem('token', result.data.payload.jwtToken);
        refetch().catch((error) => {
          notification.error({
            message: 'RefetchError',
            description: error.message,
          });
        });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        notification.error({
          message: 'MutateError',
          description: error.message,
        });
      });
  };

  const signOut = () => {
    signOutMutate()
      .then(() => {
        removeItem('token');
        refetch().catch((error) => {
          notification.error({
            message: 'RefetchError',
            description: error.message,
          });
        });
      })
      .catch((error) => {
        notification.error({
          message: 'MutateError',
          description: error.message,
        });
      });
  };

  if (error) {
    return <EmptyLayout>Error: {error.message}</EmptyLayout>;
  }

  if (loading) {
    return <EmptyLayout>Loading...</EmptyLayout>;
  }

  if (!data?.auth?.user) {
    return <SignIn signIn={signIn} />;
  }

  return <AuthContext.Provider value={{ ...data.auth, signOut }}>{children}</AuthContext.Provider>;
};
