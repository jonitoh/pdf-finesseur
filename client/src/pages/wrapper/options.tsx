import React, { ComponentType } from 'react';
import Wrapper, { Props as WrapperProps } from './wrapper';

export type Options = Partial<Omit<WrapperProps, 'children'>>;

export default function withInnerNavigation<T extends object>(
  Component: ComponentType<T>,
  options?: Options
) {
  function NewWrapper(props: T) {
    return (
      <Wrapper {...options}>
        <Component {...props} />
      </Wrapper>
    );
  }

  NewWrapper.defaultProps = {
    // ...Component.defaultProps,
  };

  return NewWrapper;
}
