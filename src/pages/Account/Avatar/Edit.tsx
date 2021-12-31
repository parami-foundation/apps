import BigModal from '@/components/ParamiModal/BigModal';
import React from 'react';
import { useIntl } from 'umi';

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
                // <AvatarMain
                //     setModalVisable={setModalVisable}
                // />
            }
            footer={false}
        />
    )
}

export default Edit;
