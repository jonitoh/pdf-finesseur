import React, { Fragment } from 'react';
import withInnerNavigation from '#pages/wrapper/options';
import Placeholder from '#common/placeholder/placeholder';
// les tests
import Icon from '#components/common/icon';
import Button from '#common/buttons/button';
import styles from './test.module.css';

function TestPage() {
  return <div>yeah</div>;
}

export default withInnerNavigation(TestPage);
