import React, { useState } from 'react';
import { useModel } from 'umi';
import Marquee from 'react-fast-marquee';
import { Alert } from 'antd';
import BigModal from '@/components/ParamiModal/BigModal';
import Mnemonic from '../Mnemonic';
import './ExportMnemonicAlert.less';

export interface ExportMnemonicAlertProps { }

function ExportMnemonicAlert({ }: ExportMnemonicAlertProps) {
    const { wallet } = useModel('currentUser');

    const [exportModal, setExportModal] = useState<boolean>(false);

    return <>
        {!wallet.mnemonicExported && <>
            <Alert banner message={
                <Marquee pauseOnHover gradient={false}>
                    You haven't export your mnemonic yet. Please click this banner to export your mnemonic and store them safely.
                </Marquee>
            } style={{ height: '50px', fontSize: '1.2rem' }} onClick={() => setExportModal(true)}
            />
        </>}

        {exportModal && <BigModal
            visable
            title="Export Mnemonic"
            content={
                <Mnemonic onConfirm={() => setExportModal(false)}></Mnemonic>
            }
            width={1000}
            footer={false}
            close={() => { setExportModal(false) }}
        />}
    </>;
};

export default ExportMnemonicAlert;
