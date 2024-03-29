﻿
export default [
  {
    path: '/',
    name: 'index',
    hideInMenu: true,
    headerRender: false,
    footerRender: false,
    component: './Index',
  },
  {
    path: '/create',
    name: 'create',
    hideInMenu: true,
    headerRender: false,
    footerRender: false,
    routes: [
      {
        path: '/create',
        name: 'create',
        component: './Identity/Create',
      },
      {
        path: '/create/:type',
        name: 'create',
        component: './Identity/Create',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/oauth/:platform',
    name: 'oauth',
    hideInMenu: true,
    headerRender: false,
    footerRender: false,
    component: './Oauth/Oauth'
  },
  {
    path: '/recover',
    name: 'recover',
    hideInMenu: true,
    headerRender: false,
    footerRender: false,
    component: './Identity/Recover',
  },
  {
    path: '/wallet',
    name: 'wallet',
    icon: 'WalletFilled',
    access: 'canUser',
    hideChildrenInMenu: true,
    routes: [
      {
        path: '/wallet',
        name: 'wallet',
        component: './Wallet',
      },
      {
        path: '/wallet/send',
        name: 'wallet.send',
        component: './Wallet/Send',
      },
      {
        path: '/wallet/receive',
        name: 'wallet.receive',
        component: './Wallet/Receive',
      },
      {
        path: '/wallet/buy',
        name: 'wallet.buy',
        component: './Wallet/Buy',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/profile',
    name: 'account',
    icon: 'UserOutlined',
    access: 'canUser',
    hideChildrenInMenu: true,
    component: './Account',
  },
  {
    path: '/profile/:bind',
    name: 'account',
    icon: 'UserOutlined',
    access: 'canUser',
    hideInMenu: true,
    hideChildrenInMenu: true,
    component: './Account',
  },
  {
    path: '/record',
    name: 'record',
    icon: 'HistoryOutlined',
    access: 'canUser',
    hideChildrenInMenu: true,
    component: './Record/Record',
  },
  {
    path: '/staking',
    name: 'staking',
    icon: 'DeploymentUnitOutlined',
    access: 'canUser',
    hideChildrenInMenu: true,
    component: './Stake/Staking',
  },
  {
    path: '/creator',
    name: 'creator',
    icon: 'CrownOutlined',
    access: 'canUser',
    hideChildrenInMenu: true,
    component: './Creator/NFTs',
  },
  {
    path: '/visa',
    name: 'visa',
    icon: 'FileProtectOutlined',
    access: 'canUser',
    hideInMenu: true,
    component: './Visa/Visa',
    headerRender: false,
    footerRender: false,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'BlockOutlined',
    hideInMenu: true,
    headerRender: false,
    footerRender: false,
    component: './Dashboard/app',
    routes: [
      {
        path: '/dashboard',
        name: 'Index',
        component: './Dashboard/pages/Index',
        hideInMenu: true,
        headerRender: false,
        footerRender: false,
        menuRender: false,
      },
      {
        path: '/dashboard/did',
        name: 'DID',
        component: './Dashboard/pages/Did',
        access: 'canDashboard',
      },
      {
        path: '/dashboard/advertisement',
        name: 'Advertisement',
        component: './Dashboard/pages/Advertisement',
        access: 'canDashboard',
      },
      {
        path: '/dashboard/bridge',
        name: 'Bridge',
        component: './Dashboard/pages/Bridge',
        access: 'canDashboard',
      },
      {
        path: '/dashboard/farm',
        name: 'Farm',
        component: './Dashboard/pages/Farm',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/square',
    name: 'square',
    icon: 'NotificationOutlined',
    access: 'canUser',
    hideChildrenInMenu: true,
    component: './Square/Index',
    hideInMenu: true,
    headerRender: false,
    footerRender: false,
  },
  {
    path: '/claim/:adId/:nftId',
    hideInMenu: true,
    exact: true,
    headerRender: false,
    footerRender: false,
    component: './ClaimWithScore/ClaimWithScore',
  },
  {
    path: '/clockInClaim/:nftId',
    hideInMenu: true,
    exact: true,
    headerRender: false,
    footerRender: false,
    component: './ClockInClaim/ClockInClaim',
  },
  {
    path: '/adClaim/:adId/:nftId',
    hideInMenu: true,
    exact: true,
    headerRender: false,
    footerRender: false,
    component: './Claim/Claim',
  },
  {
    path: '/ad',
    hideInMenu: true,
    exact: true,
    headerRender: false,
    footerRender: false,
    component: './Ad/Ad'
  },
  {
    path: '/lottery',
    hideInMenu: true,
    exact: true,
    headerRender: false,
    footerRender: false,
    component: './Lottery/Lottery'
  },
  {
    path: '/dao',
    hideInMenu: true,
    exact: true,
    headerRender: false,
    component: './Creator/Explorer/DAO/DAO',
  },
  {
    path: '/ipo',
    hideInMenu: true,
    exact: true,
    component: './Creator/IPO/IPO'
  },
  {
    path: '/did:kol/:nftID',
    redirect: '/ad/?nftId=:nftID',
  },
  {
    path: '/downloads',
    name: 'downloads',
    hideInMenu: true,
    headerRender: false,
    footerRender: false,
    component: './Downloads/Downloads',
  },
  {
    path: '/swap',
    name: 'Swap',
    icon: 'SwapOutlined',
    access: 'canUser',
    hideChildrenInMenu: true,
    component: './Swap/Swap',
  },
  {
    path: '/swap/:assetId',
    name: 'Swap',
    hideInMenu: true,
    access: 'canUser',
    hideChildrenInMenu: true,
    component: './Swap/Swap',
  },
  {
    path: '/claimHnft/:nftId',
    name: 'Claim HNFT',
    hideInMenu: true,
    access: 'canUser',
    hideChildrenInMenu: true,
    component: './ClaimHNFT/ClaimHNFT'
  },
  {
    path: '/bid/:nftId',
    name: 'Bid on HNFT',
    hideInMenu: true,
    access: 'canUser',
    hideChildrenInMenu: true,
    component: './BidHNFT/BidHNFT'
  },
  {
    path: '/batch/create/ad',
    name: 'Batch Create Ad',
    hideInMenu: true,
    access: 'canUser',
    hideChildrenInMenu: true,
    component: './BatchCreateAd/BatchCreateAd'
  },
  {
    component: './404',
  },
];
