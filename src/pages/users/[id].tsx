import React from 'react';
import { useRouter } from 'next/router';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Form, Input, Button, Row, message, Popconfirm, Card, Switch } from 'antd';
import { PageHeader } from '../../components/PageHeader';
import { GTypes } from '../../__generated__/GTypes';

const query = gql`
  query UserPageQuery($id: Int!) {
    result: user(id: $id) {
      id
      firstName
      lastName
      email
      isAdmin
    }
  }
`;

const createMutation = gql`
  mutation UserPageCreateMutation($input: CreateUserInput!) {
    result: createUser(input: $input) {
      id
      firstName
      lastName
      email
      isAdmin
    }
  }
`;

const updateMutation = gql`
  mutation UserPageUpdateMutation($input: UpdateUserInput!) {
    result: updateUser(input: $input) {
      id
      firstName
      lastName
      email
      isAdmin
    }
  }
`;

const deleteMutation = gql`
  mutation UserPageDeleteMutation($id: Int!) {
    result: deleteUser(id: $id) {
      id
    }
  }
`;

// noinspection JSUnusedGlobalSymbols
export default function UserPage() {
  const router = useRouter();
  const isNew = Boolean(router.query.id === 'new');
  const id = router.query.id && parseInt(router.query.id as string, 10);

  const { data, loading, error } = useQuery<GTypes.UserPageQuery, GTypes.UserPageQueryVariables>(query, {
    variables: { id },
    skip: isNew,
  });
  const [createMutate, createMutationState] = useMutation<
    GTypes.UserPageCreateMutation,
    GTypes.UserPageCreateMutationVariables
  >(createMutation);
  const [updateMutate, updateMutationState] = useMutation<
    GTypes.UserPageUpdateMutation,
    GTypes.UserPageUpdateMutationVariables
  >(updateMutation);
  const [deleteMutate, deleteMutationState] = useMutation<
    GTypes.UserPageDeleteMutation,
    GTypes.UserPageDeleteMutationVariables
  >(deleteMutation);

  const saving = updateMutationState.loading || createMutationState.loading;
  const deleting = deleteMutationState.loading;

  const [form] = Form.useForm();

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (loading && !isNew) {
    return <div>Loading...</div>;
  }

  if (!data && !isNew) {
    return <div>Not found</div>;
  }

  const onSave = async (values: any) => {
    if (isNew) {
      const res = await createMutate({
        variables: {
          input: values,
        },
      });

      if (res.data) {
        // noinspection ES6MissingAwait
        router.push('/users/[id]', `/users/${res.data.result.id}`);
      }
    } else {
      await updateMutate({
        variables: {
          input: {
            id,
            ...values,
          },
        },
      });
    }

    message.info('Saved');
  };

  const onDelete = async () => {
    const res = await deleteMutate({
      variables: {
        id,
      },
    });

    if (res?.data?.result.id) {
      // noinspection ES6MissingAwait
      router.push('/users');
    }
  };

  return (
    <div className="bg-white p-4 mb-4">
      <PageHeader title={isNew ? 'New User' : `User №${data?.result?.id}`} className="text-2xl mb-4" />
      <Card>
        <Form form={form} initialValues={data?.result || {}} onFinish={onSave} layout="vertical">
          <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: isNew }]}>
            <Input />
          </Form.Item>
          <Form.Item name="isAdmin" label="Is admin" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Row justify="space-between">
            <div>
              {!isNew && (
                <Popconfirm title="Confirm?" onConfirm={onDelete}>
                  <Button type="default" htmlType="button" loading={deleting}>
                    Delete
                  </Button>
                </Popconfirm>
              )}
            </div>
            <Button type="primary" htmlType="submit" loading={saving}>
              Save
            </Button>
          </Row>
        </Form>
      </Card>
    </div>
  );
}
