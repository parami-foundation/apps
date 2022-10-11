import React, { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import { Button, Input, message, notification, Select, Tag, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { didToHex, parseAmount } from '@/utils/common';
import { CreateAds } from '@/services/parami/Advertisement';
import FormFieldTitle from '@/components/FormFieldTitle';
import FormErrorMsg from '@/components/FormErrorMsg';
import config from '@/config/config';
import { uploadIPFS } from '@/services/parami/IPFS';
import CreateUserInstruction, { UserInstruction } from './CreateUserInstruction/CreateUserInstruction';
import ParamiScoreTag from '@/pages/Creator/Explorer/components/ParamiScoreTag/ParamiScoreTag';
import ParamiScore from '@/pages/Creator/Explorer/components/ParamiScore/ParamiScore';

const NUM_BLOCKS_PER_DAY = 24 * 60 * 60 / 12;

const Create: React.FC<{
  setCreateModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setCreateModal }) => {
  const { dashboard } = useModel('currentUser');
  const [submiting, setSubmiting] = useState<boolean>(false);
  const [payoutBase, setPayoutBase] = useState<number>(0);
  const [payoutMin, setPayoutMin] = useState<number>(0);
  const [payoutMax, setPayoutMax] = useState<number>(0);
  const [payoutMinError, setPayoutMinError] = useState<string>('');
  const [payoutMaxError, setPayoutMaxError] = useState<string>('');
  const [title, setTitle] = useState<string>();
  const [sponsorName, setSponsorName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [mediaUrl, setMediaUrl] = useState<string>();
  const [iconUrl, setIconUrl] = useState<string>();

  const [rewardRate, setRewardRate] = useState<number>(0);
  const [lifetime, setLifetime] = useState<number>();
  const [delegatedDid, setDelegatedDid] = useState<string>('did:ad3:izgyiwwftd7s1D3XaREJZBR2kvZ');
  const [createInstructionModal, setCreateInstructionModal] = useState<boolean>(false);
  const [instructions, setInstructions] = useState<UserInstruction[]>([]);

  const intl = useIntl();
  const { Option } = Select;

  const handleSubmit = async () => {
    if (!!dashboard && !!dashboard?.accountMeta) {
      setSubmiting(true);
      try {
        let adMetadata = {
          title,
          media: mediaUrl,
          icon: iconUrl,
          description,
          instructions,
          sponsorName
        };

        const bufferred = await Buffer.from(JSON.stringify(adMetadata));
        const { response, data } = await uploadIPFS(bufferred);
        if (!response.ok) {
          throw ('Create Metadata Error');
        }

        const delegatedDidHex = didToHex(delegatedDid);
        const allTags = Array.from(new Set([...instructions.map(ins => ins.tag).filter(Boolean)]));
        await CreateAds(allTags, `ipfs://${data.Hash}`, rewardRate.toString(), (lifetime as number), parseAmount(payoutBase.toString()), parseAmount(payoutMin.toString()), parseAmount(payoutMax.toString()), JSON.parse(dashboard?.accountMeta), delegatedDidHex);
        setSubmiting(false);
        setCreateModal(false);
        window.location.reload();
      } catch (e: any) {
        notification.error({
          message: e.message || e,
          duration: null,
        });
        setSubmiting(false);
      }
    } else {
      notification.error({
        key: 'accessDenied',
        message: intl.formatMessage({
          id: 'error.accessDenied',
        }),
        duration: null,
      })
    }
  };

  useEffect(() => {
    setPayoutMaxError('');
    setPayoutMinError('');
    if (payoutMax < payoutMin) {
      setPayoutMaxError('Payout Max cannot be less than Payout Min')
    }
  }, [payoutMax]);

  useEffect(() => {
    setPayoutMaxError('');
    setPayoutMinError('');
    if (payoutMin > payoutMax) {
      setPayoutMinError('Payout Min cannot be more than Payout Max')
    }
  }, [payoutMin]);

  const handleUploadOnChange = (imageType: string) => {
    return (info) => {
      if (info.file.status === 'done') {
        const ipfsHash = info.file.response.Hash;
        const imageUrl = config.ipfs.endpoint + ipfsHash;
        imageType === 'poster' ? setMediaUrl(imageUrl) : setIconUrl(imageUrl);
        return;
      }
      if (info.file.status === 'error') {
        message.error('Upload Image Error');
      }
    }
  }

  return (
    <>
      <div className={styles.modalBody}>
        <div className={styles.field}>
          <div className={styles.title}>
            <FormFieldTitle title={'Title'} required />
          </div>
          <div className={styles.value}>
            <Input
              size='large'
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Advertisement Title'
            />
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.title}>
            <FormFieldTitle title={'Sponsor Name'} required />
          </div>
          <div className={styles.value}>
            <Input
              size='large'
              onChange={(e) => setSponsorName(e.target.value)}
              placeholder='Advertisement Sponsor Name'
            />
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.title}>
            <FormFieldTitle title={'Description'} required />
          </div>
          <div className={styles.value}>
            <Input
              size='large'
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Advertisement Description'
            />
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.title}>
            <FormFieldTitle title={'Ad Icon'} required />
          </div>
          <div className={styles.value}>
            <Upload
              showUploadList={false}
              action={config.ipfs.upload}
              onChange={handleUploadOnChange('icon')}
            >
              {iconUrl
                ? <img src={iconUrl} style={{ width: '100%' }} />
                : <Button icon={<UploadOutlined />}>Click to Upload</Button>}
            </Upload>
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.title}>
            <FormFieldTitle title={'Poster'} required />
          </div>
          <div className={styles.value}>
            <Upload
              showUploadList={false}
              action={config.ipfs.upload}
              onChange={handleUploadOnChange('poster')}
            >
              {mediaUrl
                ? <img src={mediaUrl} style={{ width: '100%' }} />
                : <Button icon={<UploadOutlined />}>Click to Upload</Button>}
            </Upload>
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.title}>
            <FormFieldTitle title="instructions" required />
          </div>
          <div className={styles.value}>
            <Button onClick={() => setCreateInstructionModal(true)}>Add New Instruction</Button>
          </div>
        </div>
        {instructions.length > 0 &&
          <div className={styles.field}>
            {instructions.map(instruction => <p>
              <Tag closable onClose={(e) => {
                e.preventDefault();
                setInstructions(instructions.filter(ins => ins !== instruction))
              }}>
                {instruction.text}
                {!!instruction.tag && <ParamiScoreTag tag={instruction.tag} />}
                {!!instruction.score && <ParamiScore score={instruction.score} />}
                {!!instruction.link && <a href={instruction.link} target="_blank">(link)</a>}
              </Tag>
            </p>)}
          </div>
        }
        <div className={styles.field}>
          <div className={styles.title}>
            <FormFieldTitle title={intl.formatMessage({
              id: 'dashboard.ads.create.rewardRate',
            })} required />
          </div>
          <div className={styles.value}>
            <Input
              className={styles.withAfterInput}
              placeholder="0.00"
              size='large'
              type='number'
              maxLength={18}
              min={0}
              onChange={(e) => setRewardRate(Number(e.target.value))}
              suffix="%"
            />
            <span className={style.fieldInfo}>Referrer gets {rewardRate}% from each referral.</span>
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.title}>
            <FormFieldTitle title={intl.formatMessage({
              id: 'dashboard.ads.create.lifetime',
            })} required />
          </div>
          <div className={styles.value}>
            <Select
              size='large'
              style={{
                width: '100%',
              }}
              placeholder={'Please select a lifetime'}
              onChange={(value) => {
                setLifetime(Number(value));
              }}
            >
              <Option value={3 * NUM_BLOCKS_PER_DAY}>
                {intl.formatMessage({
                  id: 'dashboard.ads.create.lifetime.3days',
                })}
              </Option>
              <Option value={7 * NUM_BLOCKS_PER_DAY}>
                {intl.formatMessage({
                  id: 'dashboard.ads.create.lifetime.7days',
                })}
              </Option>
              <Option value={15 * NUM_BLOCKS_PER_DAY}>
                {intl.formatMessage({
                  id: 'dashboard.ads.create.lifetime.15days',
                })}
              </Option>
            </Select>
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.title}>
            <FormFieldTitle title={intl.formatMessage({
              id: 'dashboard.ads.create.payoutBase',
            })} required />
          </div>
          <div className={styles.value}>
            <Input
              className={styles.withAfterInput}
              placeholder="0.00"
              size='large'
              type='number'
              maxLength={18}
              min={0}
              onChange={(e) => setPayoutBase(Number(e.target.value))}
            />
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.title}>
            <FormFieldTitle title={intl.formatMessage({
              id: 'dashboard.ads.create.payoutMin',
            })} required />
          </div>
          <div className={styles.value}>
            <Input
              className={`${styles.withAfterInput} ${payoutMinError ? style.inputError : ''}`}
              placeholder="0.00"
              size='large'
              type='number'
              maxLength={18}
              min={0}
              max={payoutMax}
              onChange={(e) => setPayoutMin(Number(e.target.value))}
            />
            {payoutMinError && <FormErrorMsg msg={payoutMinError} />}
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.title}>
            <FormFieldTitle title={intl.formatMessage({
              id: 'dashboard.ads.create.payoutMax',
            })} required />
          </div>
          <div className={styles.value}>
            <Input
              className={`${styles.withAfterInput} ${payoutMaxError ? style.inputError : ''}`}
              placeholder="0.00"
              size='large'
              type='number'
              maxLength={18}
              min={payoutMin}
              onChange={(e) => setPayoutMax(Number(e.target.value))}
            />
            {payoutMaxError && <FormErrorMsg msg={payoutMaxError} />}
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.title}>
            <FormFieldTitle title={'Delegated Account'} />
          </div>
          <div className={styles.value}>
            <Input
              size='large'
              value={delegatedDid}
              onChange={(e) => setDelegatedDid(e.target.value)}
              placeholder={'did:ad3:......'}
            />
          </div>
        </div>
        <div
          className={styles.field}
          style={{
            marginTop: 50
          }}
        >
          <Button
            block
            size='large'
            shape='round'
            type='primary'
            disabled={!lifetime || !rewardRate || !payoutBase || !!payoutMaxError || !!payoutMinError}
            loading={submiting}
            onClick={() => {
              handleSubmit()
            }}
          >
            {intl.formatMessage({
              id: 'common.submit',
            })}
          </Button>
        </div>
      </div>

      {createInstructionModal && <>
        <CreateUserInstruction
          onCancel={() => setCreateInstructionModal(false)}
          onCreateInstruction={newInstruction => {
            setInstructions([...instructions, newInstruction]);
            setCreateInstructionModal(false);
          }}
        ></CreateUserInstruction>
      </>}

    </>
  )
}

export default Create;
