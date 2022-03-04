import common from './en-US/common';
import error from './en-US/error';
import component from './en-US/component';
import globalHeader from './en-US/globalHeader';
import menu from './en-US/menu';
import pwa from './en-US/pwa';
import modal from './en-US/modal';

import identity from './en-US/identity';
import creator from './en-US/creator';
import index from './en-US/index';
import stake from './en-US/stake';
import record from './en-US/record';
import social from './en-US/social';
import wallet from './en-US/wallet';
import visa from './en-US/visa';

import dashboardIndex from './en-US/dashboard/index';
import dashboardDid from './en-US/dashboard/did';
import dashboardAds from './en-US/dashboard/ads';

export default {
  'navBar.lang': 'Language',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  ...modal,
  ...globalHeader,
  ...menu,
  ...pwa,
  ...component,
  ...common,
  ...error,

  ...identity,
  ...creator,
  ...index,
  ...stake,
  ...record,
  ...social,
  ...wallet,
  ...visa,

  ...dashboardIndex,
  ...dashboardDid,
  ...dashboardAds,
};
