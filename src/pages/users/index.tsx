import React from 'react';
import Link from 'next/link';
import { gql } from '@apollo/client';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/PageHeader';
import { GTypes } from '../../__generated__/GTypes';
import { CustomTable, useTableRequest } from '../../components/CustomTable';

const usersPageQuery = gql`
  query UsersPageQuery($input: UsersInput) {
    data: users(input: $input) {
      totalCount
      nodes {
        id
        firstName
        lastName
        email
        isAdmin
      }
    }
  }
`;

type Record = NonNullable<NonNullable<GTypes.UsersPageQuery['data']>['nodes'][0]>;

// noinspection JSUnusedGlobalSymbols
export default function UsersPage() {
  const { request } = useTableRequest<GTypes.UsersPageQuery, Record>({
    query: usersPageQuery,
    extract: (res) => res.data,
  });

  return (
    <div className="bg-white p-4 mb-4">
      <PageHeader title="Users" className="text-2xl mb-4" />
      <CustomTable<Record>
        rowKey="id"
        request={request}
        toolBarRender={() => [
          <Link href="/users/[id]" as="/users/new" key={1}>
            <Button type="primary">
              <PlusOutlined />
              New
            </Button>
          </Link>,
        ]}
        columns={[
          {
            title: 'ID',
            dataIndex: 'id',
            sorter: true,
            render: (_, row) => (
              <Link href={`/users/[id]`} as={`/users/${row.id}`}>
                <a className="text-blue-500">{row.id}</a>
              </Link>
            ),
          },
          {
            title: 'Firs Name',
            dataIndex: 'firstName',
            sorter: true,
          },
          {
            title: 'Last Name',
            dataIndex: 'lastName',
            sorter: true,
          },
          {
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
          },
          {
            title: 'Is Admin',
            dataIndex: 'isAdmin',
            sorter: true,
            render: (_, row) => (row.isAdmin ? 'True' : 'False'),
          },
        ]}
      />
    </div>
  );
}
