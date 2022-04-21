import Loader from '#/components/common/loaders/dots/dots';
import React from 'react';

const types: string[] = ['null'];

function TestPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
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
          {t} <Loader size={5} />
        </div>
      ))}
    </div>
  );
}

export default TestPage;
