import { Modal, Button, Input } from 'antd';
import React, { useState } from 'react';
import styles from './InputPassphraseModal.less';

export interface InputPassphraseModalProps {
    title?: string;
    onCancel: () => void;
    onSubmit: (passphrase: string) => void;
}

function InputPassphraseModal({ title, onCancel, onSubmit }: InputPassphraseModalProps) {
    const [passphrase, setPassphrase] = useState<string>('');

    const handleInputChange = (e) => {
        if (!!e) {
            setPassphrase(e.target.value);
        } else {
            setPassphrase('');
        }
    }

    return <Modal
        title={title ?? 'Input Passphrase'}
        closable={false}
        centered
        visible
        width={400}
        footer={
            <div className={styles.buttons}>
                <Button
                    type="text"
                    shape="round"
                    size="large"
                    className={styles.button}
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    type="primary"
                    shape="round"
                    size="large"
                    className={styles.button}
                    onClick={() => {
                        onSubmit(passphrase);
                    }}
                    disabled={!passphrase || passphrase.length < 6}
                >
                    Confirm
                </Button>
            </div>
        }
    >
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
            }}
        >
            <div className={styles.codeInput}>
                <div className={styles.verifyForm}>
                    <span className={passphrase?.slice(0) && !passphrase?.slice(1, 5) && styles.highLight}>
                        {passphrase?.slice(0, 1).replace(/[^]/, '✱')}
                    </span>
                    <span className={passphrase?.slice(1) && !passphrase?.slice(2, 5) && styles.highLight}>
                        {passphrase?.slice(1, 2).replace(/[^]/, '✱')}
                    </span>
                    <span className={passphrase?.slice(2, 3) && !passphrase?.slice(3, 5) && styles.highLight}>
                        {passphrase?.slice(2, 3).replace(/[^]/, '✱')}
                    </span>
                    <span className={passphrase?.slice(3, 4) && !passphrase?.slice(4, 5) && styles.highLight}>
                        {passphrase?.slice(3, 4).replace(/[^]/, '✱')}
                    </span>
                    <span className={passphrase?.slice(4, 5) && !passphrase?.slice(5) && styles.highLight}>
                        {passphrase?.slice(4, 5).replace(/[^]/, '✱')}
                    </span>
                    <span className={passphrase?.slice(5) && styles.highLight}>{passphrase?.slice(5).replace(/[^]/, '✱')}</span>
                </div>
                <Input.Password
                    autoFocus
                    autoComplete="new-password"
                    size="large"
                    className={styles.verifyInput}
                    onChange={handleInputChange}
                    value={passphrase}
                    maxLength={6}
                    visibilityToggle={false}
                />
            </div>
        </div>
    </Modal>;
};

export default InputPassphraseModal;
