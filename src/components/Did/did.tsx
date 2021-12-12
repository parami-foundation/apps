import { hexToDid } from '@/utils/common';
import { message } from 'antd';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useIntl } from 'umi';
import styles from './style.less';

const Did: React.FC<{
    did: string,
}> = ({ did }) => {
    const intl = useIntl();

    return (
        <CopyToClipboard
            text={hexToDid(did)}
            onCopy={() => message.success(
                intl.formatMessage({
                    id: 'common.copied',
                })
            )}
        >
            <div className={styles.value}>
                {hexToDid(did)}
            </div>
        </CopyToClipboard>
    )
}

export default Did;
