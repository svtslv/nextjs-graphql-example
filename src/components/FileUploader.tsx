import * as React from 'react';
import { notification, Input, Button } from 'antd';
import { gql, useMutation } from '@apollo/client';
import { GTypes } from '../__generated__/GTypes';

const createMutation = gql`
  mutation FileUploaderCreateFileMutation($input: CreateFileInput!) {
    result: createFile(input: $input) {
      url
      putUrl
    }
  }
`;

type Props<T> = any;

export const FileUploader = <T extends any>({ value, onChange }: Props<T>) => {
  const [createMutate] = useMutation<
    GTypes.FileUploaderCreateFileMutation,
    GTypes.FileUploaderCreateFileMutationVariables
  >(createMutation);

  const fileRef = React.useRef(null);

  const handleChange = (e: any) => {
    if (e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];

    createMutate({
      variables: {
        input: { name: file.name },
      },
    })
      .then((response) => {
        const { url, putUrl } = response.data.result;

        fetch(putUrl, {
          method: 'PUT',
          body: file,
        })
          .then(() => {
            if (onChange) {
              onChange(url);
            }
          })
          .catch((error) => {
            notification.error({
              message: 'FetchError',
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

  return (
    <>
      <div className="hidden">
        <input ref={fileRef} type="file" onChange={handleChange} accept="image/*" />
      </div>
      <div className="flex">
        <Input value={value} disabled className="mr-2" />
        <Button onClick={() => fileRef.current.click()}>Choose file</Button>
      </div>
    </>
  );
};
