import React from 'react';
import Link from 'next/link';
import { gql } from '@apollo/client';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/PageHeader';
import { CustomTable, useTableRequest } from '../../components/CustomTable';
import { GTypes } from '../../__generated__/GTypes';

const categoriesPageQuery = gql`
  query CategoriesPageQuery($input: CategoriesInput) {
    data: categories(input: $input) {
      totalCount
      nodes {
        id
        name
        description
        published
      }
    }
  }
`;

type Record = NonNullable<NonNullable<GTypes.CategoriesPageQuery['data']>['nodes'][0]>;

// noinspection JSUnusedGlobalSymbols
export default function CategoriesPage() {
  const { request } = useTableRequest<GTypes.CategoriesPageQuery, Record>({
    query: categoriesPageQuery,
    extract: (res) => res.data,
  });

  return (
    <div className="bg-white p-4 mb-4">
      <PageHeader title="Categories" className="text-2xl mb-4" />
      <CustomTable<Record>
        rowKey="id"
        request={request}
        toolBarRender={() => [
          <Link href="/categories/[id]" as="/categories/new" key={1}>
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
              <Link href={`/categories/[id]`} as={`/categories/${row.id}`}>
                <a className="text-blue-500">{row.id}</a>
              </Link>
            ),
          },
          {
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
          },
          {
            title: 'Description',
            dataIndex: 'description',
            sorter: true,
          },
          {
            title: 'Published',
            dataIndex: 'published',
            sorter: true,
            render: (_, row) => (row.published ? 'True' : 'False'),
          },
        ]}
      />
    </div>
  );
}
