/* eslint-disable @typescript-eslint/no-unused-vars */
import RightContent from '@/components/RightContent';
import ProLayout from '@ant-design/pro-layout';
import React, { useState } from 'react';
import { history, useModel } from 'umi';
import routes from './routes';
import { useEffect } from 'react';
import { web3Enable } from '@polkadot/extension-dapp';

const Layout: React.FC = (props) => {
    const apiWs = useModel('apiWs');
    const [pathname, setPathname] = useState('');

    const init = async () => {
        await web3Enable('Parami Dashboard');
    }

    useEffect(() => {
        if (apiWs) {
            init();
            const path = window.location.pathname;
            setPathname(path);
        }
    }, [apiWs]);

    return (
        <ProLayout
            {...routes}
            location={{
                pathname,
            }}
            menuItemRender={(item, dom) => (
                <a
                    onClick={() => {
                        setPathname(item.path as string);
                        history.push(item.path as string);
                    }}
                >
                    {dom}
                </a>
            )}
            rightContentRender={() => <RightContent />}
            disableContentMargin={true}
            logo={'/images/logo-round-core.svg'}
            title={'Dashboard'}
            headerHeight={70}
            siderWidth={260}
            navTheme='light'
            headerTheme='light'
            layout='mix'
        >
            {props.children}
        </ProLayout>
    )
};

export default Layout;
