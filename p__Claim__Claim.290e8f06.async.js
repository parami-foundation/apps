(self.webpackChunkparami_app=self.webpackChunkparami_app||[]).push([[2627],{19273:function(f,u,e){"use strict";e.d(u,{Z:function(){return y}});function y(M){if(M==null)throw new TypeError("Cannot destructure undefined")}},55133:function(f){f.exports={modal:"modal___1O81X",codeInput:"codeInput___1b6is",verifyForm:"verifyForm___3o9Cw",highLight:"highLight___wTtyW",verifyInput:"verifyInput___29jF0",buttons:"buttons___2s-8l",button:"button___13mjZ",title:"title___35CCk",confirmContainer:"confirmContainer___3-95Y",alertContainer:"alertContainer___HBKri",field:"field___mBf3w",labal:"labal___1ZC5A",small:"small___1qvTc",labalIcon:"labalIcon___Wx-BW",value:"value___16uzM"}},31639:function(f){f.exports={ad3:"ad3___22MgQ",unit:"unit___UR_Yf"}},55248:function(f){f.exports={container:"container___rtU1m"}},69764:function(f,u,e){"use strict";var y=e(71194),M=e(50146),U=e(57663),P=e(71577),R=e(402),o=e(3887),N=e(67294),L=e(55133),d=e.n(L),O=e(54549),c=e(85893),v=o.Z.Title,$=function(T){var V=T.visable,E=T.title,C=T.content,B=T.footer,W=T.close,X=T.bodyStyle,t=T.width;return(0,c.jsx)(M.Z,{title:E?(0,c.jsx)(v,{level:5,className:d().title,children:E}):null,closable:!!W,closeIcon:(0,c.jsx)(c.Fragment,{children:(0,c.jsx)(P.Z,{shape:"circle",size:"middle",type:"ghost",icon:(0,c.jsx)(O.Z,{onClick:W})})}),className:d().modal,centered:!0,visible:V,width:t!=null?t:650,footer:B,bodyStyle:X,children:C})};u.Z=$},46656:function(f,u,e){"use strict";var y=e(71194),M=e(50146),U=e(47673),P=e(32787),R=e(22385),o=e(31097),N=e(17462),L=e(76772),d=e(57663),O=e(71577),c=e(74379),v=e(38648),$=e(3182),H=e(2824),T=e(402),V=e(3887),E=e(94043),C=e.n(E),B=e(67294),W=e(43581),X=e(55133),t=e.n(X),le=e(3548),re=e(68855),ie=e(47832),w=e(43955),oe=e(51625),_=e(85893),de=V.Z.Title,q=function(S){var K=S.visable,g=S.setVisable,a=S.passphrase,Z=S.setPassphrase,k=S.func,h=S.changePassphrase,ee=S.directSubmit,Y=ee===void 0?!1:ee,z=(0,W.tT)("apiWs"),I=(0,W.tT)("currentUser"),s=I.wallet,Ee=(0,W.tT)("balance"),ae=Ee.balance,se=(0,B.useState)(!1),te=(0,H.Z)(se,2),J=te[0],x=te[1],_e=(0,B.useState)(),ne=(0,H.Z)(_e,2),b=ne[0],ce=ne[1],A=(0,W.YB)(),j=function(D){Z(D?D.target.value:"")},p=function(){var m=(0,$.Z)(C().mark(function D(){var l,F,r,Q,ve;return C().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:if(x(!0),s!=null&&s.passphrase&&Z(s==null?void 0:s.passphrase),!((!a||a.length<6)&&!(s!=null&&s.passphrase))){i.next=5;break}return x(!1),i.abrupt("return");case 5:if(l=(s==null?void 0:s.passphrase)||a,!(l&&s!==null&&s!==void 0&&s.keystore)){i.next=16;break}if(F=(0,ie.Gh)(l,s.keystore),F){i.next=13;break}return v.default.error({key:"passphraseError",message:A.formatMessage({id:"error.passphrase.error"}),duration:null}),Z(""),x(!1),i.abrupt("return");case 13:r=new w.ZP({type:"sr25519"}),Q=r.addFromUri(F),ve=Q.address,s!=null&&s.account&&s.account!==ve&&(localStorage.clear(),sessionStorage.clear(),window.location.href=oe.Z.page.homePage);case 16:if(!k){i.next=25;break}return i.prev=17,i.next=20,k();case 20:i.next=25;break;case 22:i.prev=22,i.t0=i.catch(17),console.log("security modal submit func error fallback",i.t0);case 25:g(!1),x(!1);case 27:case"end":return i.stop()}},D,null,[[17,22]])}));return function(){return m.apply(this,arguments)}}(),G=function(){var m=(0,$.Z)(C().mark(function D(){var l;return C().wrap(function(r){for(;;)switch(r.prev=r.next){case 0:if(!(!!z&&!!s.account)){r.next=11;break}return r.next=3,k(!0,s.account);case 3:if(l=r.sent,!l){r.next=8;break}ce(l.partialFee),r.next=11;break;case 8:if(h){r.next=11;break}return r.next=11,p();case 11:case"end":return r.stop()}},D)}));return function(){return m.apply(this,arguments)}}();return(0,B.useEffect)(function(){!!z&&!!(s!=null&&s.account)&&K&&!Y&&G()},[z,s==null?void 0:s.account,K,Y]),(0,B.useEffect)(function(){!!(s!=null&&s.passphrase)&&K&&!h&&Z(s==null?void 0:s.passphrase)},[s==null?void 0:s.passphrase,a,K,h]),(0,B.useEffect)(function(){a&&K&&Y&&p()},[a,K,Y]),(0,_.jsxs)(M.Z,{title:(0,_.jsx)(de,{level:3,children:A.formatMessage({id:"modal.security.title"})}),closable:!1,className:t().modal,centered:!0,visible:K,width:400,footer:(0,_.jsxs)("div",{className:t().buttons,children:[(0,_.jsx)(O.Z,{type:"text",shape:"round",size:"large",className:t().button,onClick:function(){g(!1),window.location.reload()},loading:J,children:A.formatMessage({id:"common.decline"})}),(0,_.jsx)(O.Z,{type:"primary",shape:"round",size:"large",className:t().button,onClick:function(){p()},disabled:!a||a.length<6,loading:J,children:A.formatMessage({id:"common.confirm"})})]}),children:[(0,_.jsxs)("div",{className:t().confirmContainer,children:[!!b&&!!(b!=null&&b.toString())>ae.free&&(0,_.jsx)(L.Z,{description:A.formatMessage({id:"error.balance.low"}),type:"warning",showIcon:!0,banner:!0,className:t().alertContainer}),!!b&&(0,_.jsxs)("div",{className:t().field,children:[(0,_.jsxs)("div",{className:t().labal,children:[A.formatMessage({id:"modal.security.gas"}),(0,_.jsxs)("span",{className:t().small,children:["(",A.formatMessage({id:"modal.security.estimated"}),")"]}),(0,_.jsx)(o.Z,{placement:"bottom",title:A.formatMessage({id:"modal.security.gas.tooltip",defaultMessage:"Gas fees are paid to crypto miners who process transactions on the network. Parami does not profit from gas fees."}),children:(0,_.jsx)(re.Z,{className:t().labalIcon})})]}),(0,_.jsx)("div",{className:t().value,children:(0,_.jsx)(le.Z,{value:b,style:{fontSize:"0.8rem",fontWeight:900}})})]})]}),(!(s!=null&&s.passphrase)||h)&&(0,_.jsx)("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%"},children:(0,_.jsxs)("div",{className:t().codeInput,children:[(0,_.jsxs)("div",{className:t().verifyForm,children:[(0,_.jsx)("span",{className:(a==null?void 0:a.slice(0))&&!(a!=null&&a.slice(1,5))&&t().highLight,children:a==null?void 0:a.slice(0,1).replace(/[^]/,"\u2731")}),(0,_.jsx)("span",{className:(a==null?void 0:a.slice(1))&&!(a!=null&&a.slice(2,5))&&t().highLight,children:a==null?void 0:a.slice(1,2).replace(/[^]/,"\u2731")}),(0,_.jsx)("span",{className:(a==null?void 0:a.slice(2,3))&&!(a!=null&&a.slice(3,5))&&t().highLight,children:a==null?void 0:a.slice(2,3).replace(/[^]/,"\u2731")}),(0,_.jsx)("span",{className:(a==null?void 0:a.slice(3,4))&&!(a!=null&&a.slice(4,5))&&t().highLight,children:a==null?void 0:a.slice(3,4).replace(/[^]/,"\u2731")}),(0,_.jsx)("span",{className:(a==null?void 0:a.slice(4,5))&&!(a!=null&&a.slice(5))&&t().highLight,children:a==null?void 0:a.slice(4,5).replace(/[^]/,"\u2731")}),(0,_.jsx)("span",{className:(a==null?void 0:a.slice(5))&&t().highLight,children:a==null?void 0:a.slice(5).replace(/[^]/,"\u2731")})]}),(0,_.jsx)(P.Z.Password,{autoFocus:!0,autoComplete:"new-password",size:"large",className:t().verifyInput,onChange:j,value:a,disabled:J,maxLength:6,visibilityToggle:!1})]})})]})};u.Z=q},3548:function(f,u,e){"use strict";var y=e(67294),M=e(31639),U=e.n(M),P=e(96534),R=e(85893),o=function(L){var d=L.value,O=L.style;return(0,R.jsxs)("div",{className:U().ad3,style:O,children:[d?(0,P.MP)(d):"--",(0,R.jsx)("span",{className:U().unit,children:"\xA0$AD3"})]})};u.Z=o},28986:function(f,u,e){"use strict";e.d(u,{Pi:function(){return d},TE:function(){return O},vs:function(){return c}});var y="STORE_ACCOUNT_SELECTED",M="STORE_ADDRESSBOOKS",U="STORE_SETTING_LANG",P="STORE_SETTING_ENDPOINT",R="STORE_SETTING_CUSTOM_ENDPOINTS",o="https://polkascan.io/pre/",N="https://polkascan.io/",L={Dana:"dana",Parami:"parami","Dana CC1":"dana-cc1","Dana CC2":"dana-cc2","Dana CC3":"dana-cc3"},d;(function(v){v.POPUP="popup"})(d||(d={}));var O;(function(v){v.AIRDROP="airdrop",v.BIND="bind",v.CLAIM_HNFT="claimHnft"})(O||(O={}));var c;(function(v){v.AD_CLAIMED="AdClaimed"})(c||(c={}))},70279:function(f,u,e){"use strict";e.r(u);var y=e(20228),M=e(11382),U=e(74379),P=e(38648),R=e(3182),o=e(2824),N=e(19273),L=e(94043),d=e.n(L),O=e(69764),c=e(46656),v=e(51625),$=e(28986),H=e(61715),T=e(32689),V=e(50671),E=e(67294),C=e(43581),B=e(51615),W=e(55248),X=e.n(W),t=e(85893);function le(re){(0,N.Z)(re);var ie=(0,E.useState)(!1),w=(0,o.Z)(ie,2),oe=w[0],_=w[1],de=(0,E.useState)(""),q=(0,o.Z)(de,2),ue=q[0],S=q[1],K=(0,C.tT)("currentUser"),g=K.wallet,a=(0,C.tT)("apiWs"),Z=(0,C.YB)(),k=(0,B.UO)(),h=k.adId,ee=k.nftId,Y=(0,E.useState)(),z=(0,o.Z)(Y,2),I=z[0],s=z[1],Ee=(0,E.useState)(),ae=(0,o.Z)(Ee,2),se=ae[0],te=ae[1],J=(0,E.useState)(!1),x=(0,o.Z)(J,2),_e=x[0],ne=x[1],b=function(){window.opener.postMessage("".concat($.vs.AD_CLAIMED,":").concat(h),"*"),window.close()};(0,E.useEffect)(function(){_e&&(se?I&&(I.tag&&I.score&&(0,T.gd)(h,g.did,{tag:I.tag,score:I.score}),I.link&&window.open(decodeURIComponent(I.link)),b()):b())},[_e,se,I]);var ce=function(){var j=(0,R.Z)(d().mark(function p(G){var m,D,l,F,r,Q;return d().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,n.next=3,a==null?void 0:a.query.ad.metadata(G);case 3:if(n.t1=m=n.sent,n.t0=n.t1===null,n.t0){n.next=7;break}n.t0=m===void 0;case 7:if(!n.t0){n.next=11;break}n.t2=void 0,n.next=12;break;case 11:n.t2=m.toHuman();case 12:return l=n.t2,F=l==null||(D=l.metadata)===null||D===void 0?void 0:D.substring(7),n.next=16,fetch(v.Z.ipfs.endpoint+F);case 16:return r=n.sent,n.next=19,r.json();case 19:Q=n.sent,s(Q.instructions[0]),n.next=26;break;case 23:n.prev=23,n.t3=n.catch(0),s({});case 26:case"end":return n.stop()}},p,null,[[0,23]])}));return function(G){return j.apply(this,arguments)}}();(0,E.useEffect)(function(){h&&a&&ce(h)},[h,a]),(0,E.useEffect)(function(){var j=(0,V.Y)(),p=j.redirect;p&&te(p)},[]),(0,E.useEffect)(function(){a&&g&&_(!0)},[a,g]);var A=function(){var j=(0,R.Z)(d().mark(function p(G,m){return d().wrap(function(l){for(;;)switch(l.prev=l.next){case 0:if(g!=null&&g.keystore){l.next=3;break}return P.default.error({key:"accessDenied",message:Z.formatMessage({id:"error.accessDenied"}),duration:null}),l.abrupt("return");case 3:return l.prev=3,l.next=6,(0,H.HS)(h,ee,null,null,ue,g.keystore,G,m);case 6:P.default.success({message:"Claim Token Success"}),ne(!0),l.next=14;break;case 10:l.prev=10,l.t0=l.catch(3),console.log(l.t0),P.default.error({message:"Claim Ad Token Error",description:"".concat(l.t0)});case 14:case"end":return l.stop()}},p,null,[[3,10]])}));return function(G,m){return j.apply(this,arguments)}}();return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(O.Z,{visable:!0,title:"Claim your token",content:(0,t.jsx)("div",{className:X().container,children:(0,t.jsx)(M.Z,{})}),footer:null,close:function(){window.close()}}),(0,t.jsx)(c.Z,{visable:oe,setVisable:_,passphrase:ue,setPassphrase:S,directSubmit:!0,func:A})]})}u.default=le},50671:function(f,u,e){"use strict";e.d(u,{Y:function(){return P}});var y=e(11849),M=e(80129),U=e.n(M),P=function(){try{var o=new URL(window.location.href);return(0,y.Z)((0,y.Z)({},U().parse(o.search.substring(1))),U().parse(o.hash.substring(1)))}catch(N){return console.log("Parse url params error",N),{}}}}}]);