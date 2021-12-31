import BigModal from '@/components/ParamiModal/BigModal';
import React from 'react';
import { useIntl } from 'umi';
import Main from './Main';

const Edit: React.FC<{
    modalVisable: boolean;
    setModalVisable: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ modalVisable, setModalVisable }) => {
    const intl = useIntl();

    return (
        <BigModal
            visable={modalVisable}
            title={intl.formatMessage({
                id: 'wallet.avatar.edit',
            })}
            content={
                <Main
                    setModalVisable={setModalVisable}
                />
            }
            footer={false}
        />
    )
}

export default Edit;
