import { Input, Modal, Select, Tooltip, Image } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from '@/pages/dashboard.less';
import FormFieldTitle from '@/components/FormFieldTitle';
import { ExclamationCircleFilled } from '@ant-design/icons';

const { Option, OptGroup } = Select;

enum IntentType {
    TWEET = 'tweet',
    REPLY_TWEET = 'replay_tweet',
    RETWEET = 'retweet',
    LIKE_TWEET = 'like_tweet',
    FOLLOW_USER = 'follow_user'
}

const TwitterIntentPrefix = 'https://twitter.com/intent';

export interface TwitterIntentModalProps {
    onCreateTwitterIntent: (url: string) => void;
    onCancel: () => void;
}

function TwitterIntentModal({ onCreateTwitterIntent, onCancel }: TwitterIntentModalProps) {
    const [intentType, setIntentType] = useState<IntentType>(IntentType.FOLLOW_USER);
    const [tweetText, setTweetText] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [tweetId, setTweetId] = useState<string>('');

    const [intentUrl, setIntentUrl] = useState<string>('');

    useEffect(() => {
        setIntentUrl('');

        switch (intentType) {
            case IntentType.FOLLOW_USER:
                if (username) {
                    setIntentUrl(`${TwitterIntentPrefix}/follow?screen_name=${username}`);
                }
                break;
            case IntentType.TWEET:
                if (tweetText) {
                    setIntentUrl(`${TwitterIntentPrefix}/tweet?text=${encodeURIComponent(tweetText)}`);
                }
                break;
            case IntentType.LIKE_TWEET:
                if (tweetId) {
                    setIntentUrl(`${TwitterIntentPrefix}/like?tweet_id=${tweetId}`);
                }
                break;
            case IntentType.REPLY_TWEET:
                if (tweetId) {
                    setIntentUrl(`${TwitterIntentPrefix}/tweet?in_reply_to=${tweetId}`);
                }
                break;
            case IntentType.RETWEET:
                if (tweetId) {
                    setIntentUrl(`${TwitterIntentPrefix}/retweet?tweet_id=${tweetId}`);
                }
                break;
            default:
                console.log('unknown intent type', intentType);
        }
    }, [intentType, tweetText, username, tweetId])

    return <>
        <Modal
            visible
            title="Twitter Intent"
            onOk={() => {
                onCreateTwitterIntent(intentUrl);
            }}
            onCancel={onCancel}
            okButtonProps={{
                disabled: !intentUrl
            }}
        >
            <div className={styles.field}>
                <div className={styles.title}>
                    <FormFieldTitle title={'Twitter Intent Type'} required />
                </div>
                <div className={styles.value}>
                    <Select defaultValue={IntentType.FOLLOW_USER} style={{ width: '100%' }} onChange={(value) => setIntentType(value)}>
                        <OptGroup label="Tweet">
                            <Option value={IntentType.TWEET}>Tweet a Tweet</Option>
                            <Option value={IntentType.REPLY_TWEET}>Reply to a Tweet</Option>
                            <Option value={IntentType.RETWEET}>Retweet a Tweet</Option>
                            <Option value={IntentType.LIKE_TWEET}>Like a Tweet</Option>
                        </OptGroup>
                        <OptGroup label="User">
                            <Option value={IntentType.FOLLOW_USER}>Follow a User</Option>
                        </OptGroup>
                    </Select>
                </div>
            </div>

            {intentType === IntentType.TWEET && <>
                <div className={styles.field}>
                    <div className={styles.title}>
                        <FormFieldTitle title={'Tweet Text'} required />
                    </div>
                    <div className={styles.value}>
                        <Input
                            size='large'
                            onChange={(e) => setTweetText(e.target.value)}
                        />
                    </div>
                </div>
            </>}

            {intentType === IntentType.FOLLOW_USER && <>
                <div className={styles.field}>
                    <div className={styles.title}>
                        <FormFieldTitle title={'User name'} required />
                    </div>
                    <div className={styles.value}>
                        <Input
                            size='large'
                            prefix='@'
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                </div>
            </>}

            {(intentType === IntentType.LIKE_TWEET || intentType === IntentType.REPLY_TWEET || intentType === IntentType.RETWEET) && <>
                <div className={styles.field}>
                    <div className={styles.title}>
                        <FormFieldTitle title={<>
                            {'Tweet Id '}
                            <Tooltip overlayInnerStyle={{ width: '350px' }} title={<>
                                You can find the tweet id at the end of tweet url
                                <Image src='/images/tip/tweet_id_tip.png'></Image>
                            </>}>
                                <ExclamationCircleFilled
                                    className={styles.labalIcon}
                                />
                            </Tooltip>
                        </>} required />
                    </div>
                    <div className={styles.value}>
                        <Input
                            size='large'
                            onChange={(e) => setTweetId(e.target.value)}
                        />
                    </div>
                </div>
            </>}

            {intentUrl && <>
                <div className={styles.field}>
                    <div className={styles.title}>
                        <FormFieldTitle title={'Twitter Intent Url'} />
                    </div>
                    <div className={styles.value}>
                        <a href={intentUrl} target="_blank">{intentUrl}</a>
                    </div>
                </div>
            </>}
        </Modal>
    </>;
};

export default TwitterIntentModal;
