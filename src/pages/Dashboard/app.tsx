import RightContent from '@/components/RightContent';
import ProLayout from '@ant-design/pro-layout';
import React, { useState } from 'react';
import { history } from 'umi';
import routes from './routes';
import { useEffect } from 'react';
import { web3Enable } from '@polkadot/extension-dapp';

const Layout: React.FC = (props) => {
    const [pathname, setPathname] = useState('');

    const init = async () => {
        await web3Enable('Parami Dashboard');
    }

    useEffect(() => {
        init();
        const path = window.location.pathname;
        setPathname(path);
    }, []);

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
            title={'Para Identity Dashboard'}
            headerHeight={70}
            siderWidth={260}
            navTheme='light'
            headerTheme='dark'
            layout='mix'
        >
            {props.children}
        </ProLayout>
    )
};

export default Layout;
