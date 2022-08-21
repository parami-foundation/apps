import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import config from '@/config/config';
import Loading from './components/Loading/Loading';
import { notification } from 'antd';
import { access } from '@/access';
import type { VoidFn } from '@polkadot/api/types';
import type { ApiPromise } from '@polkadot/api';
import NoFoundPage from './pages/404';
import { QueryCurrentUser } from './services/parami/currentUser';
import { Merge } from './services/parami/Merge';

declare global {
  interface Window {
    apiWs: ApiPromise;
    unsubParami: VoidFn;
  }
}

export const initialStateConfig = {
  loading: <Loading />,
};

export async function getInitialState(): Promise<{
  collapsed?: boolean | undefined;
  settings?: Partial<LayoutSettings>;
  currentInfo?: API.Info;
}> {
  await Merge();

  const currentInfo = await QueryCurrentUser();

  if (access({ currentInfo: currentInfo }).canPreDID && window.location.toString().indexOf('create') < 0 && currentInfo?.wallet?.inProcess === 'createAccount') {
    if (!window.location.href.includes('oauth')) {
      window.location.href = config.page.createPage;
    }
  };
  if (access({ currentInfo: currentInfo }).canPreDID && window.location.toString().indexOf('create') < 0 && currentInfo?.wallet?.inProcess === 'recoverAccount') {
    window.location.href = config.page.recoverPage;
  };

  return {
    collapsed: false,
    settings: {},
    currentInfo,
  };
};

export const request: RequestConfig = {
  errorHandler: (error: any) => {
    const { response } = error;

    if (!response) {
      notification.error({
        key: 'networkException',
        message: 'Network exception',
        description: 'An exception has occurred in your network. Cannot connect to the server. Please refresh and try again after changing the network environment.',
        duration: null,
      });
    }
    throw new Error('Network exception');
  },
};

export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: true,
    footerRender: () => <Footer />,
    headerTitleRender: () => (
      <>
        <div
          className="headerLogo"
          onClick={() => {
            window.location.href = config.page.homePage;
          }}
        >
          <img src="/images/logo-text.svg" />
        </div>
      </>
    ),
    menuHeaderRender: () => (
      <>
        <div
          className="headerLogo"
          onClick={() => {
            window.location.href = config.page.homePage;
          }}
        >
          <img src="/images/logo-text.svg" />
        </div>
      </>
    ),
    menuExtraRender: () => (
      <>
        <div
          className="headerLogo"
          style={{
            display: 'block'
          }}
          onClick={() => {
            window.location.href = config.page.homePage;
          }}
        >
          <img src="/images/logo-text.svg" />
        </div>
      </>
    ),
    onPageChange: () => {
      setInitialState({ ...initialState, collapsed: true });
    },
    collapsed: initialState?.collapsed,
    onCollapse: (collapsed) => {
      setInitialState({ ...initialState, collapsed });
    },
    headerTheme: "light",
    headerHeight: 70,
    unAccessible: <NoFoundPage />,
    ...initialState?.settings,
    childrenRender: (children) => {
      return (
        <>
          {children}
        </>
      );
    },
  };
};
