import Loader, { Props as LoaderProps } from '#/components/common/loaders/dots/dots';
import React from 'react';

type T = NonNullable<LoaderProps['type']>;

const types: T[] = ['basic', 'wave'];
// const types: T[] = ['wave'];

function TestPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#fffff0',
        width: '60%',
        rowGap: '20px',
      }}
    >
      {types.map((t) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
          key={t}
        >
          {t} <Loader size={10} style={{ width: '200px', height: '50px' }} type={t} color="basic" />
        </div>
      ))}
    </div>
  );
}

export default TestPage;
