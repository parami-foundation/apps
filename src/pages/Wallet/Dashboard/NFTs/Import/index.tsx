import React, {useEffect, useState} from 'react';
import style from './style.less';
import {useIntl} from 'umi';
import BigModal from '@/components/ParamiModal/BigModal';
import {Button, Col, Form, Image, Input, message, notification, Row, Table} from 'antd';
import {PortNFT} from '@/services/parami/nft';
import {contractAddresses} from '../config';
import {useModel} from "@@/plugin-model/useModel";
import {BigNumber, ethers} from "ethers";
import WrapperABI from "../abi/ParamiHyperlink.json";
import {JsonRpcSigner} from "@ethersproject/providers";

type Erc721 = {
  tokenId: string,
  name: string,
  tokenURI: string
}
type Selected = {
  tokenID: string,
  image: string
}
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: '50%',
  },
  {
    title: 'TokenId',
    dataIndex: 'tokenId',
    width: '50%',
    render: (r: BigNumber) => {
      return r.toString()
    }
  }
];
const ImportNFTModal: React.FC<{
  setImportModal: React.Dispatch<React.SetStateAction<boolean>>;
  password: string;
  keystore: string;
}> = ({setImportModal, password, keystore}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [tokenData, setTokenData] = useState<Erc721[]>([]);
  const [selected, setSelected] = useState<Selected>({tokenID: '', image: ''});
  const {
    Account,
    Signer,
    Provider,
    ChainId,
    connect
  } = useModel("web3");
  const intl = useIntl();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      const events = await PortNFT(password, keystore, 'Rinkeby', contractAddresses.wrap[4], values.tokenID);
      console.log(events);
      setLoading(false);
      setImportModal(false);
      form.resetFields();
    } catch (e: any) {
      notification.error({
        message: e.message,
      });
      setLoading(false);
      return;
    }
  };

  useEffect(() => {
    connect().then();
  }, []);

  async function getNfts(signer: JsonRpcSigner) {
    const wrapper = new ethers.Contract(contractAddresses.wrap[1], WrapperABI.abi, signer);
    //wrapper.connect(Signer)
    const balanceKinds: BigNumber = await wrapper.balanceOf(Account);
    console.log("balanceKinds", balanceKinds);
    if (!balanceKinds) {
      setLoading(false);
      return [];
    }
    const tokenIndexArray: number[] = [];
    for (let i = 0; i < balanceKinds.toNumber(); i++) {
      tokenIndexArray.push(i);
    }
    const tokenIdPromises = tokenIndexArray.map(async (i) => {
      const tokenId = await wrapper?.tokenOfOwnerByIndex(Account, i);
      if (parseInt(tokenId) == NaN) {
        return -1;
      }
      return tokenId;
    });
    const tokenIds = await Promise.all(tokenIdPromises);
    console.log("tokenIds", tokenIds);
    const positionPromises = tokenIds.map(async (tokenId) => {
      const name = await wrapper.getOriginalName(tokenId);
      const tokenURI = await wrapper.tokenURI(tokenId);
      const token = {
        tokenId,
        name,
        tokenURI,
      }
      return token;
    });
    const data = await Promise.all(positionPromises);
    console.log("data", data);
    setLoading(false);
    return data;
  };

  async function importNft(){
    console.log(selected.tokenID)
    return await PortNFT(password,keystore,'Ethereum',contractAddresses.wrap[1],selected.tokenID);
  }
  useEffect(() => {
    if (!!Account) {
      if (ChainId !== 1 && ChainId !== 4) {
        return;
      }
      if (!Provider || !Signer) {
        return;
      }
      getNfts(Signer).then(r => setTokenData(r));
    }
  }, [Account, Provider, Signer, ChainId]);

  return (
    <div className={style.importContainer}>
      <Col>
        <Button onClick={() => {
          setLoading(true);
          try{
            importNft().then(
              ()=>{
                setLoading(false);
              }
            );
          }catch (e) {
            setLoading(false);
          }
        }}
        disabled={selected.tokenID===''}
        >import</Button>
        <Row>
          <Table
            onRow={
              record => {
                return {
                  onClick: event => {
                    // 29 = length of "data:application/json;base64,"
                    const json = Buffer.from(record.tokenURI.substring(29), 'base64').toString('utf8');
                    const result = JSON.parse(json);
                    setSelected({tokenID: record.tokenId.toString(), image: result.image});
                  }, // 点击行
                  onDoubleClick: event => {
                  },
                  onContextMenu: event => {
                  },
                  onMouseEnter: event => {
                  }, // 鼠标移入行
                  onMouseLeave: event => {
                  },
                };
              }
            }
            rowClassName={(record) => {
              return record.tokenId === selected.tokenID ? style.active : style.inactive;
            }}
            columns={columns}
            rowKey={record => record.tokenId}
            dataSource={tokenData}
            loading={loading}
          />
          <Image
            src={selected.image}
          ></Image>
        </Row>
      </Col>
    </div>
  )
};

const Import: React.FC<{
  importModal: boolean;
  setImportModal: React.Dispatch<React.SetStateAction<boolean>>;
  password: string;
  keystore: string;
}> = ({importModal, setImportModal, password, keystore}) => {
  const intl = useIntl();

  return (
    <BigModal
      visable={importModal}
      title={intl.formatMessage({
        id: 'wallet.nfts.import',
      })}
      content={
        <ImportNFTModal
          setImportModal={setImportModal}
          password={password}
          keystore={keystore}
        />
      }
      footer={false}
      close={() => {
        setImportModal(false)
      }}
    />
  )
};

export default Import;
