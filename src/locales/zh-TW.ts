import common from './zh-TW/common';
import error from './zh-TW/error';
import component from './zh-TW/component';
import globalHeader from './zh-TW/globalHeader';
import menu from './zh-TW/menu';
import pwa from './zh-TW/pwa';
import modal from './zh-TW/modal';

import account from './zh-TW/account';
import creator from './zh-TW/creator';
import index from './zh-TW/index';
import miner from './zh-TW/miner';
import record from './zh-TW/record';
import social from './zh-TW/social';
import wallet from './zh-TW/wallet';
import visa from './zh-TW/visa';
import dashboard from './zh-TW/dashboard';

export default {
    'navBar.lang': '語言',
    'layout.user.link.help': '幫助',
    'layout.user.link.privacy': '隱私',
    'layout.user.link.terms': '條款',
    ...modal,
    ...globalHeader,
    ...menu,
    ...pwa,
    ...component,
    ...common,
    ...error,

    ...account,
    ...creator,
    ...index,
    ...miner,
    ...record,
    ...social,
    ...wallet,
    ...visa,
    ...dashboard,
};
