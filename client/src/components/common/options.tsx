import React, { ComponentType } from 'react';

// Possibility to show/hide a component
interface InjectedPropsForOptionalShow {
  isShown?: boolean;
}

const defaultPropsInjectedPropsForOptionalShow = {
  isShown: true,
};

function withOptionalShow<T extends object>(Component: ComponentType<T>) {
  function Wrapper(props: T & InjectedPropsForOptionalShow) {
    const { isShown, ...rest } = props;

    if (!isShown) {
      return null;
    }

    return <Component {...(rest as T)} />;
  }

  Wrapper.defaultProps = {
    // ...Component.defaultProps,
    ...defaultPropsInjectedPropsForOptionalShow,
  };

  return Wrapper;
}

// final exports
export { withOptionalShow };
