import React from 'react';
import { Button, Input, Table, Select, Form } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { DocumentNode } from 'graphql';
import { apolloClient } from '../utils/apolloClient';

export function useTableRequest<T extends any, P extends any, Record = P>({
  query,
  extract,
}: {
  query: DocumentNode;
  extract: (res: any) => { nodes: Record[]; totalCount: number };
}) {
  const request = async (input) => {
    try {
      const res = await apolloClient.query<T>({
        query,
        variables: { input: input },
        fetchPolicy: 'network-only',
      });

      const data = extract(res.data);

      if (!data) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error('data not extracted');
      }

      return {
        data: data.nodes.filter(Boolean).map((i: any) => ({ ...i })) as Record[],
        total: data.totalCount,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return {
        data: [] as Record[],
        total: 0,
      };
    }
  };

  return { request };
}

type PropsType<T> = {
  rowKey: string;
  columns: ColumnsType<T>;
  request: (variables: any) => Promise<any>;
  toolBarRender?: () => React.ReactElement[];
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const CustomTable = <T extends object>({ rowKey, columns, request, toolBarRender }: PropsType<T>) => {
  const [form] = Form.useForm();
  const [variables, setVariables] = React.useState({
    orderBy: {
      order: 'DESC',
      column: 'id',
    },
  } as any);
  const [response, setResponse] = React.useState({
    data: [],
    totalCount: 0,
  });

  const setResponseWrapper = () => {
    request(variables)
      .then((data) => {
        setResponse(data);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('error', error);
      });
  };

  React.useEffect(() => {
    setResponseWrapper();
  }, []);

  React.useEffect(() => {
    setResponseWrapper();
  }, [variables]);

  const onChange = (pagination, filters, sorter, extra) => {
    // eslint-disable-next-line no-console
    console.log('params', pagination, filters, sorter, extra);

    if (sorter && sorter.order) {
      setVariables((variables) => ({
        ...variables,
        orderBy: {
          order: sorter.order === 'ascend' ? 'ASC' : 'DESC',
          column: sorter.field,
        },
      }));
    }
  };

  const onFinish = (filters) => {
    setVariables((variables) => ({
      ...variables,
      filters: filters.expression ? filters : undefined,
    }));
  };

  return (
    <div>
      <div className="justify-between flex overflow-auto">
        <div>
          {columns?.[0] && (
            <Form
              form={form}
              onFinish={onFinish}
              initialValues={{
                column: 'id',
                operation: 'equals',
              }}
              layout="horizontal"
              className="flex -ml-1"
            >
              <Form.Item name="column" className="mx-1">
                <Select style={{ width: 100 }}>
                  {columns.map((column: any) => {
                    return (
                      <Select.Option value={column.dataIndex} key={column.dataIndex}>
                        {column.dataIndex}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item name="operation" className="mx-1">
                <Select style={{ width: 100 }}>
                  <Select.Option value="equals">equals</Select.Option>
                  <Select.Option value="like">like</Select.Option>
                  <Select.Option value="ilike">ilike</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="expression" className="mx-1">
                <Input placeholder="value" />
              </Form.Item>
              <Button type="primary" htmlType="submit" className="mx-1">
                Search
              </Button>
            </Form>
          )}
        </div>
        <div>{toolBarRender && toolBarRender()}</div>
      </div>
      <Table<T>
        scroll={{ x: 400 }}
        bordered
        rowKey={rowKey}
        columns={columns}
        dataSource={response.data}
        onChange={onChange}
        pagination={{
          pageSize: 10,
          total: response.totalCount,
        }}
      />
    </div>
  );
};
