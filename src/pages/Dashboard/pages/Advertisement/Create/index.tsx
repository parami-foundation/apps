import React, { useEffect, useRef, useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import { Button, Input, message, notification, Select, Tag, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { parseAmount } from '@/utils/common';
import BigModal from '@/components/ParamiModal/BigModal';
import { CreateAds } from '@/services/parami/Advertisement';
import { CreateTag, ExistTag } from '@/services/parami/Tag';
import FormFieldTitle from '@/components/FormFieldTitle';
import FormErrorMsg from '@/components/FormErrorMsg';

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
  const [tags, setTags] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<string>();
  const [rewardRate, setRewardRate] = useState<number>(0);
  const [lifetime, setLifetime] = useState<number>();
  const [tagInputVisible, setTagInputVisible] = useState<boolean>(false);
  const [tagInputValue, setTagInputValue] = useState<string>('');
  const [tagEditInputIndex, setTagEditInputIndex] = useState<number>(-1);
  const [tagEditInputValue, setTagEditInputValue] = useState<string>('');
  const [createTag, setCreateTag] = useState<boolean>(false);

  const tagInputRef = useRef<Input>(null);

  const intl = useIntl();
  const { Search } = Input;
  const { Option } = Select;

  const existTag = async (tag: string) => {
    try {
      const res = await ExistTag(tag);
      if (!res.toHuman()) {
        return false;
      }
      return true;
    } catch (e: any) {
      notification.error({
        message: e.message || e,
        duration: null,
      });
      return false;
    }
  };

  const newTag = async (tag: string) => {
    if (!!dashboard && !!dashboard?.accountMeta) {
      setSubmiting(true);
      try {
        await CreateTag(tag, JSON.parse(dashboard?.accountMeta));
        let Tags = tags;
        if (tagInputValue && tags.indexOf(tagInputValue) === -1) {
          Tags = [...tags, tagInputValue];
        }
        setTags(Tags);
        setTagInputVisible(false);
        setTagInputValue('');
        setSubmiting(false);
      } catch (e: any) {
        notification.error({
          message: intl.formatMessage({ id: e.message || e }),
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

  const handleTagInputConfirm = async () => {
    const exist = await existTag(tagInputValue);
    if (!exist) {
      setCreateTag(true);
      return;
    }
    let Tags = tags;
    if (tagInputValue && tags.indexOf(tagInputValue) === -1) {
      Tags = [...tags, tagInputValue];
    }
    setTags(Tags);
    setTagInputVisible(false);
    setTagInputValue('');
  };

  const handleTagEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[tagEditInputIndex] = tagEditInputValue;

    setTags(newTags);
    setTagEditInputIndex(0);
    setTagEditInputValue('');
  };

  const handleTagClose = (removedTag: any) => {
    const Tags = tags.filter(tag => tag !== removedTag);
    setTags(Tags);
  };

  const handleSubmit = async () => {
    if (!!dashboard && !!dashboard?.accountMeta) {
      setSubmiting(true);
      try {
        await CreateAds(tags, metadata as string, rewardRate.toString(), (lifetime as number), parseAmount(payoutBase.toString()), parseAmount(payoutMin.toString()), parseAmount(payoutMax.toString()), JSON.parse(dashboard?.accountMeta));
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

  return (
    <>
      <div className={styles.modalBody}>
        <div className={styles.field}>
          <div className={styles.title}>
            <FormFieldTitle title={intl.formatMessage({
              id: 'dashboard.ads.create.tag',
            })} required />
          </div>
          <div className={styles.value}>
            {tags.map((tag, index) => {
              if (tagEditInputIndex === index) {
                return (
                  <Search
                    key={tag}
                    size="large"
                    className="tag-input"
                    enterButton={intl.formatMessage({
                      id: 'common.confirm',
                    })}
                    loading={submiting}
                    onChange={(e) => {
                      setTagEditInputValue(e.target.value);
                    }}
                    onSearch={() => {
                      if (!tagEditInputValue) {
                        message.error('Please Input Tag');
                        return;
                      }
                      handleTagEditInputConfirm();
                    }}
                  />
                );
              }

              const isLongTag = tag.length > 20;

              const tagElem = (
                <Tag
                  className={style.tag}
                  color="volcano"
                  key={tag}
                  closable={true}
                  onClose={() => handleTagClose(tag)}
                >
                  <span
                    onDoubleClick={() => {
                      setTagEditInputIndex(index);
                      setTagEditInputValue(tag);
                      focus();
                    }}
                  >
                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                  </span>
                </Tag>
              );
              return isLongTag ? (
                <Tooltip
                  title={tag}
                  key={tag}
                >
                  {tagElem}
                </Tooltip>
              ) : (
                tagElem
              );
            })}
            {tagInputVisible && (
              <Search
                ref={tagInputRef}
                type="text"
                size="large"
                enterButton={intl.formatMessage({
                  id: 'common.confirm',
                })}
                className={style.tagInput}
                loading={submiting}
                onChange={(e) => {
                  setTagInputValue(e.target.value);
                }}
                onSearch={() => {
                  if (!tagInputValue) {
                    message.error('Please Input Tag');
                    return;
                  }
                  handleTagInputConfirm();
                }}
              />
            )
            }
            {!tagInputVisible && (
              <Tag
                className={style.tag}
                color="volcano"
                onClick={() => {
                  setTagInputVisible(true);
                  tagInputRef.current?.focus();
                }}
              >
                <PlusOutlined />
                {intl.formatMessage({
                  id: 'dashboard.ads.create.tag.new',
                })}
              </Tag>
            )
            }
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.title}>
            <FormFieldTitle title={intl.formatMessage({
              id: 'dashboard.ads.create.metadata',
            })} required />
          </div>
          <div className={styles.value}>
            <Input
              size='large'
              onChange={(e) => setMetadata(`ipfs://${e.target.value}`)}
              placeholder='<CID>/<path>'
              prefix={'ipfs://'}
            />
          </div>
        </div>
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
            />
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
            disabled={!tags || !metadata || !lifetime || !rewardRate || !payoutBase || !!payoutMaxError || !!payoutMinError}
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

      <BigModal
        visable={createTag}
        title={tagInputValue}
        content={intl.formatMessage({
          id: 'dashboard.ads.create.tag.create',
        })}
        footer={
          <>
            <Button
              block
              shape='round'
              type='primary'
              size='large'
              onClick={() => {
                newTag(tagInputValue);
                setCreateTag(false);
              }}
            >
              {intl.formatMessage({
                id: 'common.submit',
              })}
            </Button>
          </>
        }
        close={() => {
          setCreateTag(false)
        }}
      />
    </>
  )
}

export default Create;
