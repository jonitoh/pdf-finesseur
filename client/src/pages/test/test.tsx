import React, { Fragment } from 'react';
import withInnerNavigation from '#pages/wrapper/options';
import Placeholder from '#common/placeholder/placeholder';
// les tests
import Icon from '#components/common/icon';
import Button from '#common/buttons/button';
import ApparentButton from '#common/buttons/apparent-button';
import styles from './test.module.css';

function TestPage() {
  return (
    <Fragment>
      <div>Test ici</div>
      <Placeholder>test 3</Placeholder>
      <Button
        type="button"
        className={styles.close}
        icon={<Icon.Close />}
        variant="basic"
        label="button test"
      />
      <ApparentButton
        className={styles.close}
        icon={<Icon.Close />}
        variant="basic"
        label="apparent button test"
      />
    </Fragment>
  );
}

export default withInnerNavigation(TestPage);
