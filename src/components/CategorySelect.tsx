import React from 'react';
import { gql } from '@apollo/client';
import { Select } from 'antd';
import { GTypes } from '../__generated__/GTypes';

export const categorySelectFragment = gql`
  fragment CategorySelectFragment on Categories {
    nodes {
      id
      name
    }
  }
`;

type PropsType<T> = {
  data: GTypes.CategorySelectFragment;
};

export const CategorySelect = <T extends any>({ data, ...selectProps }: PropsType<T>) => {
  return (
    <Select {...selectProps}>
      {data.nodes.map((category) => (
        <Select.Option key={category.id} value={category.id}>
          {category.name}
        </Select.Option>
      ))}
    </Select>
  );
};
