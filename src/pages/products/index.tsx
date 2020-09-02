import React from 'react';
import Link from 'next/link';
import { gql } from '@apollo/client';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/PageHeader';
import { GTypes } from '../../__generated__/GTypes';
import { CustomTable, useTableRequest } from '../../components/CustomTable';

const productsPageQuery = gql`
  query ProductsPageQuery($input: ProductsInput) {
    data: products(input: $input) {
      totalCount
      nodes {
        id
        name
        description
        image
        published
        categoryId
        category {
          name
        }
      }
    }
  }
`;

type Record = NonNullable<NonNullable<GTypes.ProductsPageQuery['data']>['nodes'][0]>;

// noinspection JSUnusedGlobalSymbols
export default function ProductsPage() {
  const { request } = useTableRequest<GTypes.ProductsPageQuery, Record>({
    query: productsPageQuery,
    extract: (res) => res.data,
  });

  return (
    <div className="bg-white p-4 mb-4">
      <PageHeader title="Products" className="text-2xl mb-4" />
      <CustomTable<Record>
        rowKey="id"
        request={request}
        toolBarRender={() => [
          <Link href="/products/[id]" as="/products/new" key={1}>
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
              <Link href={`/products/[id]`} as={`/products/${row.id}`}>
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
            title: 'Category',
            dataIndex: 'categoryId',
            sorter: true,
            render: (_, row) => row.category.name,
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
