import * as React from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { EmptyLayout } from './EmptyLayout';

type Props = {
  signIn: (input: { email: string; password: string }) => void;
};

export const SignIn = ({ signIn }: Props) => {
  const [form] = Form.useForm();

  return (
    <EmptyLayout>
      <Form form={form} onFinish={signIn} style={{ width: '300px' }}>
        <Form.Item name="email" rules={[{ required: true }]}>
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true }]}>
          <Input prefix={<LockOutlined />} placeholder="Password" type="password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Sign in
          </Button>
        </Form.Item>
      </Form>
    </EmptyLayout>
  );
};
