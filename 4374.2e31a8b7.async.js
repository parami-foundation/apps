(self.webpackChunkparami_app=self.webpackChunkparami_app||[]).push([[4374],{44019:function(x){x.exports={trade:"trade___5DCR_",pairCoins:"pairCoins___30AFB",pairCoinsItem:"pairCoinsItem___3j3Cy",tokenCoin:"tokenCoin___Rj0cZ",pairCoin:"pairCoin___1fXNK",downIcon:"downIcon___x0UKv",pairCoinsSelect:"pairCoinsSelect___1Mxk8",pairCoinsItemIcon:"pairCoinsItemIcon___2cM1U",pairCoinsItemLabel:"pairCoinsItemLabel___2VXNO",pairCoinsItemText:"pairCoinsItemText___2P6QM",pairCoinsItemInput:"pairCoinsItemInput___2Z-fh",pairCoinsBalance:"pairCoinsBalance___2quET",balance:"balance___gTvLr",warning:"warning___3GZFj",warningText:"warningText___1yrSa",maxButton:"maxButton___k7yah",pairCoinsSwitchButton:"pairCoinsSwitchButton___3ewlN",pairCoinsFlat:"pairCoinsFlat___3k2iZ",submitButton:"submitButton___qNSug"}},54374:function(x,H,s){"use strict";var G=s(49111),F=s(19650),B=s(57663),k=s(71577),D=s(77883),K=s(70507),se=s(12968),N=s(62462),ne=s(74379),y=s(38648),p=s(3182),l=s(2824),o=s(402),m=s(3887),T=s(94043),n=s.n(T),u=s(67294),v=s(55909),$=s.n(v),z=s(44019),r=s.n(z),W=s(43581),Pe=s(13580),be=s(32689),L=s(33044),Oe=s(96534),re=s(1615),te=s(3548),ie=s(57254),le=s(57651),Se=s(46656),Be=s(86326),d=s(59749),a=s(85893),ke=m.Z.Title;function ye(Z){var V,X,_=Z.assetId,_e=Z.onSelectAsset,ue=Z.onSwapped,oe=Z.canSelectAsset,je=oe===void 0?!0:oe,Q=Z.initTokenNumber,I=(0,W.YB)(),de=(0,W.tT)("apiWs"),Ue=(0,W.tT)("currentUser"),f=Ue.wallet,We=(0,W.tT)("balance"),C=We.balance,ce=(0,W.tT)("assets"),P=ce.assets,me=ce.getAssets,Le=(0,u.useState)(""),pe=(0,l.Z)(Le,2),Ze=pe[0],ve=pe[1],Re=(0,u.useState)(),fe=(0,l.Z)(Re,2),A=fe[0],Ke=fe[1],Ne=(0,u.useState)(),Ee=(0,l.Z)(Ne,2),Y=Ee[0],we=Ee[1],xe=(0,u.useState)("ad3ToToken"),Me=(0,l.Z)(xe,2),c=Me[0],He=Me[1],Ge=(0,u.useState)(""),Ce=(0,l.Z)(Ge,2),b=Ce[0],j=Ce[1],Fe=(0,u.useState)(""),ge=(0,l.Z)(Fe,2),O=ge[0],S=ge[1],$e=(0,u.useState)(!1),De=(0,l.Z)($e,2),ze=De[0],Ae=De[1],Ve=(0,u.useState)(""),he=(0,l.Z)(Ve,2),J=he[0],Xe=he[1],Qe=(0,u.useState)(!1),Te=(0,l.Z)(Qe,2),Ye=Te[0],q=Te[1],Je=(0,u.useState)(!1),Ie=(0,l.Z)(Je,2),R=Ie[0],ee=Ie[1];(0,u.useEffect)(function(){f&&me(f.account)},[me,f]);var qe=function(){var t=(0,p.Z)(n().mark(function i(E){var g,h;return n().wrap(function(M){for(;;)switch(M.prev=M.next){case 0:return ve(""),M.prev=1,M.next=4,(0,be.T9)(E);case 4:g=M.sent,h=g.data,h!=null&&h.token&&ve(h.token.icon),M.next=12;break;case 9:M.prev=9,M.t0=M.catch(1),console.error(M.t0);case 12:case"end":return M.stop()}},i,null,[[1,9]])}));return function(E){return t.apply(this,arguments)}}(),ea=function(){var t=(0,p.Z)(n().mark(function i(E){var g,h,U;return n().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,Pe.Ay)(E);case 2:if(g=e.sent,!g.isEmpty){e.next=6;break}return y.default.error({message:"Loading Asset Error",description:"tokenAssetId: ".concat(E)}),e.abrupt("return");case 6:return h=g.toHuman(),Ke(h),e.next=10,(0,L.Vo)(E,(0,Oe.Vm)("1"));case 10:U=e.sent,we(U.toString());case 12:case"end":return e.stop()}},i)}));return function(E){return t.apply(this,arguments)}}();(0,u.useEffect)(function(){de&&_&&(ea(_),qe(_),j(""),Q?(S(Q),w(Q)):S(""))},[_,de]);var aa=function(){var t=(0,p.Z)(n().mark(function i(E,g){var h,U;return n().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!(!!f&&!!(f!=null&&f.keystore)&&!!_)){e.next=33;break}e.t0=c,e.next=e.t0==="ad3ToToken"?4:e.t0==="tokenToAd3"?17:30;break;case 4:return e.prev=4,e.next=7,(0,re.Ht)(_,(0,d.HM)(O,18).toString(),(0,d.HM)(b,18).toString(),J,f==null?void 0:f.keystore,E,g);case 7:if(h=e.sent,!(E&&g)){e.next=10;break}return e.abrupt("return",h);case 10:e.next=16;break;case 12:return e.prev=12,e.t1=e.catch(4),y.default.error({message:e.t1.message||e.t1,duration:null}),e.abrupt("return");case 16:return e.abrupt("break",30);case 17:return e.prev=17,e.next=20,(0,re.Ro)(_,(0,d.HM)(O,18).toString(),(0,d.HM)(b,18).toString(),J,f==null?void 0:f.keystore,E,g);case 20:if(U=e.sent,!(E&&g)){e.next=23;break}return e.abrupt("return",U);case 23:e.next=29;break;case 25:return e.prev=25,e.t2=e.catch(17),y.default.error({message:e.t2.message||e.t2,duration:null}),e.abrupt("return");case 29:return e.abrupt("break",30);case 30:ue&&ue(),e.next=34;break;case 33:y.default.error({key:"accessDenied",message:I.formatMessage({id:"error.accessDenied"}),duration:null});case 34:case"end":return e.stop()}},i,null,[[4,12],[17,25]])}));return function(E,g){return t.apply(this,arguments)}}(),ae=(0,u.useCallback)(function(t){_&&(c==="ad3ToToken"&&(0,L.hM)(_,(0,d.HM)(t,18).toString()).then(function(i){S((0,d.mI)(i,18))}),c==="tokenToAd3"&&(0,L.__)(_,(0,d.HM)(t,18).toString()).then(function(i){S((0,d.mI)(i,18))}))},[_,c]),w=(0,u.useCallback)(function(t){_&&(c==="tokenToAd3"&&(0,L.Vo)(_,(0,d.HM)(t,18).toString()).then(function(i){j((0,d.mI)(i,18))}),c==="ad3ToToken"&&(0,L.UG)(_,(0,d.HM)(t,18).toString()).then(function(i){j((0,d.mI)(i,18))}))},[_,c]),sa=(0,u.useCallback)(function(){var t=(0,d.mI)(C==null?void 0:C.free,18);j(t),ae(t)},[C,c,ae]),na=(0,u.useCallback)(function(){if(_&&P){var t,i=(0,d.mI)((t=P.get(_))===null||t===void 0?void 0:t.balance,18);S(i),w(i)}},[c,_,P,w]);return(0,u.useEffect)(function(){if(c==="ad3ToToken"){if(C!=null&&C.free&&b){ee((0,d.HM)(b,18)>BigInt(C.free));return}}else if(_&&P&&O){var t;ee((0,d.HM)(O,18)>BigInt((t=P.get(_))===null||t===void 0?void 0:t.balance));return}ee(!1)},[c,C,b,O,_,P]),(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)("div",{className:r().trade,children:[(0,a.jsx)(ke,{level:5,style:{fontWeight:"bold",textAlign:"center"},className:$().title,children:I.formatMessage({id:"creator.explorer.trade"})}),(0,a.jsxs)("div",{className:r().pairCoins,style:{flexFlow:c==="ad3ToToken"?"column":"column-reverse"},children:[(0,a.jsxs)("div",{className:r().pairCoinsItem,children:[(0,a.jsxs)("div",{className:r().pairCoinsSelect,children:[(0,a.jsxs)("div",{className:r().pairCoin,children:[(0,a.jsx)(N.Z,{src:"/images/logo-round-core.svg",preview:!1,className:r().pairCoinsItemIcon}),(0,a.jsx)("span",{className:r().pairCoinsItemLabel,children:"AD3"})]}),(0,a.jsx)(K.Z,{autoFocus:!1,size:"large",placeholder:"0",bordered:!1,value:b,className:r().pairCoinsItemInput,stringMode:!0,onChange:function(i){j(i),ae(i)}})]}),(0,a.jsxs)("div",{className:r().pairCoinsBalance,children:[(0,a.jsxs)("span",{className:"".concat(r().balance," ").concat(c==="ad3ToToken"&&R?r().warning:""),children:[I.formatMessage({id:"creator.explorer.trade.balance",defaultMessage:"Balance"}),": ",(0,a.jsx)(te.Z,{value:C==null?void 0:C.free}),c==="ad3ToToken"&&R&&(0,a.jsx)("span",{className:r().warningText,children:"(insufficient balance)"})]}),(0,a.jsx)(k.Z,{type:"link",size:"middle",className:r().maxButton,onClick:sa,children:I.formatMessage({id:"creator.explorer.trade.balance.max",defaultMessage:"MAX"})})]})]}),(0,a.jsx)(k.Z,{type:"primary",shape:"circle",size:"middle",icon:(0,a.jsx)(ie.Z,{}),className:r().pairCoinsSwitchButton,onClick:function(){He(c==="ad3ToToken"?"tokenToAd3":"ad3ToToken"),j(""),S("")}}),(0,a.jsxs)("div",{className:"".concat(r().pairCoinsItem," ").concat(r().tokenCoin),children:[(0,a.jsxs)("div",{className:r().pairCoinsSelect,children:[(0,a.jsxs)("div",{className:r().pairCoin,onClick:function(){return je&&q(!0)},children:[A&&(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(N.Z,{src:Ze||"/images/default-avatar.svg",preview:!1,className:r().pairCoinsItemIcon}),(0,a.jsx)("span",{className:r().pairCoinsItemLabel,children:A==null?void 0:A.symbol})]}),!A&&(0,a.jsx)(a.Fragment,{children:(0,a.jsx)("span",{className:r().pairCoinsItemText,children:"Select Asset"})}),(0,a.jsx)(ie.Z,{className:r().downIcon})]}),(0,a.jsx)(K.Z,{autoFocus:!1,size:"large",placeholder:"0",bordered:!1,value:O,className:r().pairCoinsItemInput,stringMode:!0,onChange:function(i){S(i),w(i)}})]}),(0,a.jsxs)("div",{className:r().pairCoinsBalance,children:[(0,a.jsxs)("span",{className:"".concat(r().balance," ").concat(c==="tokenToAd3"&&R?r().warning:""),children:[I.formatMessage({id:"creator.explorer.trade.balance",defaultMessage:"Balance"}),": ",(0,a.jsx)(le.Z,{value:(V=(X=P.get(_!=null?_:""))===null||X===void 0?void 0:X.balance)!==null&&V!==void 0?V:"",symbol:A==null?void 0:A.symbol}),c==="tokenToAd3"&&R&&(0,a.jsx)("span",{className:r().warningText,children:"(insufficient balance)"})]}),(0,a.jsx)(k.Z,{type:"link",size:"middle",className:r().maxButton,onClick:na,children:I.formatMessage({id:"creator.explorer.trade.balance.max",defaultMessage:"MAX"})})]})]})]}),(0,a.jsx)("div",{className:r().pairCoinsFlat,children:(0,a.jsxs)(F.Z,{children:[(0,a.jsx)(le.Z,{value:(0,d.HM)("1",18).toString(),symbol:A==null?void 0:A.symbol}),(0,a.jsx)("span",{children:"\u2248"}),(0,a.jsx)(te.Z,{value:Y!=null?Y:""})]})}),(0,a.jsx)(k.Z,{block:!0,type:"primary",size:"large",shape:"round",className:r().submitButton,disabled:!b||!O||R||!_,onClick:function(){Ae(!0)},children:I.formatMessage({id:"creator.explorer.trade.swap",defaultMessage:"Swap"})})]}),(0,a.jsx)(Se.Z,{visable:ze,setVisable:Ae,passphrase:J,setPassphrase:Xe,func:aa}),Ye&&(0,a.jsx)(Be.Z,{onClose:function(){return q(!1)},onSelectAsset:function(i){q(!1),_e&&_e(i)}})]})}H.Z=ye},13580:function(x,H,s){"use strict";s.d(H,{Ay:function(){return K},f5:function(){return se},r7:function(){return N},L7:function(){return ne},jd:function(){return y}});var G=s(11849),F=s(2824),B=s(3182),k=s(94043),D=s.n(k),K=function(){var p=(0,B.Z)(D().mark(function l(o){var m;return D().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,window.apiWs.query.assets.metadata(Number(o));case 2:return m=n.sent,n.abrupt("return",m);case 4:case"end":return n.stop()}},l)}));return function(o){return p.apply(this,arguments)}}(),se=function(){var p=(0,B.Z)(D().mark(function l(o){var m;return D().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,window.apiWs.query.assets.asset(Number(o));case 2:return m=n.sent,n.abrupt("return",m);case 4:case"end":return n.stop()}},l)}));return function(o){return p.apply(this,arguments)}}(),N=function(){var p=(0,B.Z)(D().mark(function l(o){var m;return D().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,window.apiWs.query.assets.account.entries(o);case 2:return m=n.sent,n.abrupt("return",m);case 4:case"end":return n.stop()}},l)}));return function(o){return p.apply(this,arguments)}}(),ne=function(){var p=(0,B.Z)(D().mark(function l(o,m){var T,n;return D().wrap(function(v){for(;;)switch(v.prev=v.next){case 0:return v.next=2,window.apiWs.query.assets.account(Number(m),o);case 2:if(T=v.sent,!T.isEmpty){v.next=5;break}return v.abrupt("return",null);case 5:return n=T.toHuman(),v.abrupt("return",n);case 7:case"end":return v.stop()}},l)}));return function(o,m){return p.apply(this,arguments)}}(),y=function(){var p=(0,B.Z)(D().mark(function l(){var o,m;return D().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,window.apiWs.query.assets.metadata.entries();case 2:return o=n.sent,m=(o!=null?o:[]).map(function(u){var v=(0,F.Z)(u,2),$=v[0],z=v[1],r=$.toHuman();return r?(0,G.Z)((0,G.Z)({},z.toHuman()),{},{id:r[0].replaceAll(",","")}):null}).filter(Boolean),n.abrupt("return",m);case 5:case"end":return n.stop()}},l)}));return function(){return p.apply(this,arguments)}}()}}]);