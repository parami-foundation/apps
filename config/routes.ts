﻿export default [
  {
    path: '/',
    name: 'index',
    hideInMenu: true,
    component: './Index',
  },
  {
    path: '/create',
    name: 'create',
    hideInMenu: true,
    hideChildrenInMenu: true,
    routes: [
      {
        path: '/create',
        name: 'create',
        component: './Identity/CreateAccount',
      },
      {
        path: '/create/:platfrom',
        name: 'create',
        component: './Identity/CreateAccount',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/recover',
    name: 'recover',
    hideInMenu: true,
    component: './Identity/RecoverAccount',
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
        component: './Wallet/Dashboard',
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
        path: '/wallet/charge',
        name: 'wallet.charge',
        component: './Wallet/Charge',
      },
      {
        component: './404',
      },
    ],
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
    path: '/profile',
    name: 'account',
    icon: 'UserOutlined',
    access: 'canUser',
    hideChildrenInMenu: true,
    component: './Account/Profile',
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
    path: '/creator',
    name: 'creator',
    icon: 'TrophyOutlined',
    access: 'canUser',
    hideChildrenInMenu: true,
    component: './Creator/Dashboard',
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
        menuRender: false,
      },
      {
        path: '/dashboard/did',
        name: 'DID',
        component: './Dashboard/pages/Did',
        access: 'canDashboard',
      },
      {
        path: '/dashboard/ads',
        name: 'Ads',
        component: './Dashboard/pages/Ads',
        access: 'canDashboard',
      },
      {
        path: '/dashboard/bridge',
        name: 'Bridge',
        component: './Dashboard/pages/Bridge',
        access: 'canDashboard',
      },
      {
        path: '/dashboard/stake',
        name: 'Stake',
        component: './Dashboard/pages/Stake',
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
    path: '/did:kol',
    hideInMenu: true,
    exact: true,
    headerRender: false,
    component: './Creator/Explorer',
  },
  {
    component: './404',
  },
];
