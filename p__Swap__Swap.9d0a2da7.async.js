(self.webpackChunkparami_app=self.webpackChunkparami_app||[]).push([[7485],{32177:function(k){k.exports={trade:"trade___f-hm1",pairCoins:"pairCoins___1MCUa",pairCoinsItem:"pairCoinsItem___3vJ5H",tokenCoin:"tokenCoin___1NNyk",pairCoin:"pairCoin___2zcBp",downIcon:"downIcon___I9VTR",pairCoinsSelect:"pairCoinsSelect___3ywAj",pairCoinsItemIcon:"pairCoinsItemIcon___12I2L",pairCoinsItemLabel:"pairCoinsItemLabel___3yr8a",pairCoinsItemInput:"pairCoinsItemInput___1f5IS",pairCoinsBalance:"pairCoinsBalance___2Nr_K",balance:"balance___1EKab",maxButton:"maxButton___WQyhO",pairCoinsSwitchButton:"pairCoinsSwitchButton___3uCJD",pairCoinsFlat:"pairCoinsFlat___2pDVm",submitButton:"submitButton___28swB",tradeModal:"tradeModal___-2nNj",input:"input___3rDPE",field:"field___2SzQp",title:"title___SeO2h",value:"value___1bnZn"}},11385:function(k,x,s){"use strict";s.r(x);var Xe=s(20228),ie=s(11382),Ye=s(58024),oe=s(39144),we=s(49111),_e=s(19650),qe=s(57663),g=s(71577),ea=s(77883),H=s(70507),aa=s(12968),z=s(62462),sa=s(74379),T=s(38648),b=s(3182),m=s(2824),na=s(402),de=s(3887),ue=s(94043),I=s.n(ue),o=s(67294),D=s(43581),ve=s(51615),me=s(55909),U=s.n(me),ce=s(32177),r=s.n(ce),P=s(33044),F=s(3548),pe=s(46656),V=s(57254),$=s(57651),G=s(1615),Ee=s(51625),Me=s(13580),fe=s(96534),_=s(59749),Ce=s(43002),Ie=s(1115),n=s(85893),De=de.Z.Title,Pe=function(){var L,W,j,J=(0,D.tT)("apiWs"),Oe=(0,D.tT)("currentUser"),c=Oe.wallet,he=(0,D.tT)("balance"),f=he.balance,ge=(0,D.tT)("assets"),A=ge.assets,Te=(0,o.useState)(""),Q=(0,m.Z)(Te,2),Ae=Q[0],Se=Q[1],Be=(0,o.useState)(),X=(0,m.Z)(Be,2),p=X[0],ye=X[1],be=(0,o.useState)(),Y=(0,m.Z)(be,2),R=Y[0],Ue=Y[1],Le=(0,o.useState)(!0),w=(0,m.Z)(Le,2),We=w[0],C=w[1],je=(0,o.useState)("ad3ToToken"),q=(0,m.Z)(je,2),v=q[0],Re=q[1],Ke=(0,o.useState)(""),ee=(0,m.Z)(Ke,2),S=ee[0],O=ee[1],Ne=(0,o.useState)(""),ae=(0,m.Z)(Ne,2),B=ae[0],h=ae[1],Ze=(0,o.useState)(!1),se=(0,m.Z)(Ze,2),ke=se[0],ne=se[1],xe=(0,o.useState)(""),te=(0,m.Z)(xe,2),K=te[0],He=te[1],ze=(0,o.useState)(!1),re=(0,m.Z)(ze,2),Fe=re[0],y=re[1],E=(0,D.YB)(),a=(0,ve.UO)(),Ve=function(){var l=(0,b.Z)(I().mark(function t(d){var u,i,M;return I().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,(0,Ce.yI)(d);case 3:return u=e.sent,e.next=6,(0,P.CC)(u);case 6:i=e.sent,!!(i!=null&&i.avatar)&&(i==null?void 0:i.avatar.indexOf("ipfs://"))>-1&&(M=i==null?void 0:i.avatar.substring(7),Se(Ee.Z.ipfs.endpoint+M)),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0),console.error(e.t0);case 14:case"end":return e.stop()}},t,null,[[0,11]])}));return function(d){return l.apply(this,arguments)}}(),$e=function(){var l=(0,b.Z)(I().mark(function t(d){var u,i,M;return I().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,Me.Ay)(d);case 2:if(u=e.sent,!u.isEmpty){e.next=6;break}return T.default.error({message:"Loading Asset Error",description:"tokenAssetId: ".concat(d)}),e.abrupt("return");case 6:return i=u.toHuman(),ye(i),e.next=10,(0,P.Vo)(d,(0,fe.Vm)("1"));case 10:M=e.sent,Ue(M.toString()),C(!1);case 13:case"end":return e.stop()}},t)}));return function(d){return l.apply(this,arguments)}}();(0,o.useEffect)(function(){if(!(a!=null&&a.assetId)){y(!0);return}J&&($e(a==null?void 0:a.assetId),Ve(a==null?void 0:a.assetId))},[a,J]);var Ge=function(){var l=(0,b.Z)(I().mark(function t(d,u){var i,M;return I().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!(!!c&&!!(c!=null&&c.keystore)&&!!(a!=null&&a.assetId))){e.next=37;break}C(!0),e.t0=v,e.next=e.t0==="ad3ToToken"?5:e.t0==="tokenToAd3"?20:35;break;case 5:return e.prev=5,e.next=8,(0,G.Ht)(a==null?void 0:a.assetId,(0,_.HM)(B,18).toString(),(0,_.HM)(S,18).toString(),K,c==null?void 0:c.keystore,d,u);case 8:if(i=e.sent,C(!1),!(d&&u)){e.next=12;break}return e.abrupt("return",i);case 12:e.next=19;break;case 14:return e.prev=14,e.t1=e.catch(5),T.default.error({message:e.t1.message||e.t1,duration:null}),C(!1),e.abrupt("return");case 19:return e.abrupt("break",35);case 20:return e.prev=20,e.next=23,(0,G.Ro)(a==null?void 0:a.assetId,(0,_.HM)(B,18).toString(),(0,_.HM)(S,18).toString(),K,c==null?void 0:c.keystore,d,u);case 23:if(M=e.sent,C(!1),!(d&&u)){e.next=27;break}return e.abrupt("return",M);case 27:e.next=34;break;case 29:return e.prev=29,e.t2=e.catch(20),T.default.error({message:e.t2.message||e.t2,duration:null}),C(!1),e.abrupt("return");case 34:return e.abrupt("break",35);case 35:e.next=39;break;case 37:T.default.error({key:"accessDenied",message:E.formatMessage({id:"error.accessDenied"}),duration:null}),C(!1);case 39:case"end":return e.stop()}},t,null,[[5,14],[20,29]])}));return function(d,u){return l.apply(this,arguments)}}(),N=(0,o.useCallback)(function(l){a!=null&&a.assetId&&(v==="ad3ToToken"&&(0,P.hM)(a==null?void 0:a.assetId,(0,_.HM)(l,18).toString()).then(function(t){h((0,_.mI)(t,18))}),v==="tokenToAd3"&&(0,P.__)(a==null?void 0:a.assetId,(0,_.HM)(l,18).toString()).then(function(t){h((0,_.mI)(t,18))}))},[a,v]),Z=(0,o.useCallback)(function(l){a!=null&&a.assetId&&(v==="tokenToAd3"&&(0,P.Vo)(a==null?void 0:a.assetId,(0,_.HM)(l,18).toString()).then(function(t){O((0,_.mI)(t,18))}),v==="ad3ToToken"&&(0,P.UG)(a==null?void 0:a.assetId,(0,_.HM)(l,18).toString()).then(function(t){O((0,_.mI)(t,18))}))},[a,v]),Je=(0,o.useCallback)(function(){var l=(0,_.mI)(f==null?void 0:f.free,18);O(l),N(l)},[f,v,N]),Qe=(0,o.useCallback)(function(){if(a!=null&&a.assetId&&A){var l,t=(0,_.mI)((l=A.get(a==null?void 0:a.assetId))===null||l===void 0?void 0:l.balance,18);h(t),Z(t)}},[v,a,A,Z]);return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(ie.Z,{tip:E.formatMessage({id:"common.loading"}),spinning:We,wrapperClassName:U().spinContainer,children:(0,n.jsx)(oe.Z,{className:U().card,bodyStyle:{width:"100%",padding:"24px 8px"},style:{marginTop:50,maxWidth:"600px"},children:(0,n.jsxs)("div",{className:r().trade,children:[(0,n.jsx)(De,{level:5,style:{fontWeight:"bold",textAlign:"center"},className:U().title,children:E.formatMessage({id:"creator.explorer.trade"})}),(0,n.jsxs)("div",{className:r().pairCoins,style:{flexFlow:v==="ad3ToToken"?"column":"column-reverse"},children:[(0,n.jsxs)("div",{className:r().pairCoinsItem,children:[(0,n.jsxs)("div",{className:r().pairCoinsSelect,children:[(0,n.jsxs)("div",{className:r().pairCoin,children:[(0,n.jsx)(z.Z,{src:"/images/logo-round-core.svg",preview:!1,className:r().pairCoinsItemIcon}),(0,n.jsx)("span",{className:r().pairCoinsItemLabel,children:"AD3"})]}),(0,n.jsx)(H.Z,{autoFocus:!1,size:"large",placeholder:"0",bordered:!1,value:S,className:r().pairCoinsItemInput,stringMode:!0,onChange:function(t){O(t),N(t)}})]}),(0,n.jsxs)("div",{className:r().pairCoinsBalance,children:[(0,n.jsxs)("span",{className:r().balance,children:[E.formatMessage({id:"creator.explorer.trade.balance",defaultMessage:"Balance"}),": ",(0,n.jsx)(F.Z,{value:f==null?void 0:f.free})]}),(0,n.jsx)(g.Z,{type:"link",size:"middle",className:r().maxButton,onClick:Je,children:E.formatMessage({id:"creator.explorer.trade.balance.max",defaultMessage:"MAX"})})]})]}),(0,n.jsx)(g.Z,{type:"primary",shape:"circle",size:"middle",icon:(0,n.jsx)(V.Z,{}),className:r().pairCoinsSwitchButton,onClick:function(){Re(v==="ad3ToToken"?"tokenToAd3":"ad3ToToken"),O(""),h("")}}),(0,n.jsxs)("div",{className:"".concat(r().pairCoinsItem," ").concat(r().tokenCoin),children:[(0,n.jsxs)("div",{className:r().pairCoinsSelect,children:[(0,n.jsxs)("div",{className:r().pairCoin,onClick:function(){return y(!0)},children:[(0,n.jsx)(z.Z,{src:Ae||"/images/logo-round-core.svg",preview:!1,className:r().pairCoinsItemIcon}),(0,n.jsx)("span",{className:r().pairCoinsItemLabel,children:p==null?void 0:p.symbol}),(0,n.jsx)(V.Z,{className:r().downIcon})]}),(0,n.jsx)(H.Z,{autoFocus:!1,size:"large",placeholder:"0",bordered:!1,value:B,className:r().pairCoinsItemInput,stringMode:!0,onChange:function(t){h(t),Z(t)}})]}),(0,n.jsxs)("div",{className:r().pairCoinsBalance,children:[(0,n.jsxs)("span",{className:r().balance,children:[E.formatMessage({id:"creator.explorer.trade.balance",defaultMessage:"Balance"}),": ",(0,n.jsx)($.Z,{value:(L=(W=A.get((j=a==null?void 0:a.assetId)!==null&&j!==void 0?j:""))===null||W===void 0?void 0:W.balance)!==null&&L!==void 0?L:"",symbol:p==null?void 0:p.symbol})]}),(0,n.jsx)(g.Z,{type:"link",size:"middle",className:r().maxButton,onClick:Qe,children:E.formatMessage({id:"creator.explorer.trade.balance.max",defaultMessage:"MAX"})})]})]})]}),(0,n.jsx)("div",{className:r().pairCoinsFlat,children:(0,n.jsxs)(_e.Z,{children:[(0,n.jsx)($.Z,{value:(0,_.HM)("1",18).toString(),symbol:p==null?void 0:p.symbol}),(0,n.jsx)("span",{children:"\u2248"}),(0,n.jsx)(F.Z,{value:R!=null?R:""})]})}),(0,n.jsx)(g.Z,{block:!0,type:"primary",size:"large",shape:"round",className:r().submitButton,disabled:!S||!B,onClick:function(){ne(!0)},children:E.formatMessage({id:"creator.explorer.trade.swap",defaultMessage:"Swap"})})]})})}),(0,n.jsx)(pe.Z,{visable:ke,setVisable:ne,passphrase:K,setPassphrase:He,func:Ge}),Fe&&(0,n.jsx)(Ie.Z,{onClose:function(){return y(!1)},onSelectAsset:function(t){D.m8.push("/swap/".concat(t.id)),y(!1)}})]})};x.default=Pe}}]);