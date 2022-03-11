import { Footer } from 'antd/lib/layout/layout';
import { useIntl } from 'umi';

import styles from './index.less';

export default () => {
  const intl = useIntl();

  return (
    <Footer className={styles.footer}>
      {intl.formatMessage({
        id: 'common.copyright.produced',
      })}
    </Footer>
  );
};
