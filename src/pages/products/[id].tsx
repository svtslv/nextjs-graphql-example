import React from 'react';
import { useRouter } from 'next/router';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Form, Input, Button, Row, Card, message, Popconfirm, Switch } from 'antd';
import { PageHeader } from '../../components/PageHeader';
import { GTypes } from '../../__generated__/GTypes';
import { CategorySelect, categorySelectFragment } from '../../components/CategorySelect';
import { FileUploader } from '../../components/FileUploader';

const query = gql`
  ${categorySelectFragment}
  query ProductPageQuery($id: Int!) {
    result: product(id: $id) {
      id
      name
      description
      image
      categoryId
      published
    }
    categories {
      ...CategorySelectFragment
    }
  }
`;

const createMutation = gql`
  mutation ProductPageCreateMutation($input: CreateProductInput!) {
    result: createProduct(input: $input) {
      id
      name
      description
      image
      categoryId
      published
    }
  }
`;

const updateMutation = gql`
  mutation ProductPageUpdateMutation($input: UpdateProductInput!) {
    result: updateProduct(input: $input) {
      id
      name
      description
      image
      categoryId
      published
    }
  }
`;

const deleteMutation = gql`
  mutation ProductPageDeleteMutation($id: Int!) {
    result: deleteProduct(id: $id) {
      id
    }
  }
`;

// noinspection JSUnusedGlobalSymbols
export default function ProductPage() {
  const router = useRouter();
  const isNew = Boolean(router.query.id === 'new');
  const id = router.query.id && parseInt(router.query.id as string, 10);

  const { data, loading, error } = useQuery<GTypes.ProductPageQuery, GTypes.ProductPageQueryVariables>(query, {
    variables: { id },
    skip: isNew,
  });
  const [createMutate, createMutationState] = useMutation<
    GTypes.ProductPageCreateMutation,
    GTypes.ProductPageCreateMutationVariables
  >(createMutation);
  const [updateMutate, updateMutationState] = useMutation<
    GTypes.ProductPageUpdateMutation,
    GTypes.ProductPageUpdateMutationVariables
  >(updateMutation);
  const [deleteMutate, deleteMutationState] = useMutation<
    GTypes.ProductPageDeleteMutation,
    GTypes.ProductPageDeleteMutationVariables
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
        router.push('/products/[id]', `/products/${res.data.result.id}`);
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
      router.push('/products');
    }
  };

  return (
    <div className="bg-white p-4 mb-4">
      <PageHeader title={isNew ? 'New Product' : `Product №${data?.result?.id}`} className="text-2xl mb-4" />
      <Card>
        <Form form={form} initialValues={data?.result || {}} onFinish={onSave} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="image" label="Image" rules={[{ required: true }]}>
            <FileUploader />
          </Form.Item>
          {/*<Form.Item name="categoryId" label="Category ID" rules={[{ required: true }]}>*/}
          {/*  <Input />*/}
          {/*</Form.Item>*/}
          <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
            <CategorySelect data={data?.categories} />
          </Form.Item>
          <Form.Item name="published" label="Published" valuePropName="checked">
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
