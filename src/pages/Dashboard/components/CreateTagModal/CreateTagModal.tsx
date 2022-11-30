import FormFieldTitle from '@/components/Form/FormFieldTitle';
import { Input, Modal } from 'antd';
import styles from '@/pages/dashboard.less';
import React, { useEffect, useState } from 'react';
import { CreateTag } from '@/services/parami/Tag';
import { useModel } from 'umi';

const CreateTagModal: React.FC<{
    onCreate: () => void;
    onCancel: () => void
}> = ({ onCancel, onCreate }) => {
    const { dashboard } = useModel('currentUser');
    const [tag, setTag] = useState<string>('');
    const [tagExistWarning, setTagExistWarning] = useState<string>('');
    const [submitting, setSubmitting] = useState<boolean>();
    const { tagOptions } = useModel('tagOptions');

    useEffect(() => {
        setTagExistWarning('');
        if (tag) {
            if (tagOptions.find(t => t.tag === tag)) {
                setTagExistWarning('Tag already exists');
            }
        }
    }, [tag])

    const onCreateTag = async () => {
        if (!tag || tagExistWarning.length) {
            return;
        }
        setSubmitting(true);
        await CreateTag(tag, JSON.parse(dashboard?.accountMeta))
        setSubmitting(false);
        onCreate();
    }

    return (<>
        <Modal
            visible
            title="New Tag"
            onOk={() => onCreateTag()}
            onCancel={() => onCancel()}
            confirmLoading={submitting}
        >
            <div className={styles.field}>
                <div className={styles.title}>
                    <FormFieldTitle title={'Tag'} required />
                </div>
                <div className={styles.value}>
                    <Input
                        size='large'
                        onChange={(e) => setTag(e.target.value)}
                        placeholder='tag name'
                    />
                    {tagExistWarning.length > 0 && <span style={{ color: '#ff4d4f' }}>{tagExistWarning}</span>}
                </div>
            </div>
        </Modal>
    </>)
}

export default CreateTagModal;
