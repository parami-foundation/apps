(self.webpackChunkparami_app=self.webpackChunkparami_app||[]).push([[6220],{55133:function(W){W.exports={modal:"modal___1O81X",codeInput:"codeInput___1b6is",verifyForm:"verifyForm___3o9Cw",highLight:"highLight___wTtyW",verifyInput:"verifyInput___29jF0",buttons:"buttons___2s-8l",button:"button___13mjZ",title:"title___35CCk",confirmContainer:"confirmContainer___3-95Y",alertContainer:"alertContainer___HBKri",field:"field___mBf3w",labal:"labal___1ZC5A",small:"small___1qvTc",labalIcon:"labalIcon___Wx-BW",value:"value___16uzM"}},31639:function(W){W.exports={ad3:"ad3___22MgQ",unit:"unit___UR_Yf"}},37550:function(W){W.exports={advertisementContainer:"advertisementContainer___1wSir",adCard:"adCard____7cNV",advertisement:"advertisement___2lhSh",adMedia:"adMedia___2M9lZ",adMediaImg:"adMediaImg___2AnuR",daoCardContent:"daoCardContent___2-Fqi",countDown:"countDown____U0R1",instructions:"instructions___1QVJw",instructionTitle:"instructionTitle___38fjC",instruction:"instruction___3tN9q",withLink:"withLink___2pB4H",instructionText:"instructionText___3wRr2",buttonContainer:"buttonContainer___weR9U",actionBtn:"actionBtn___4bO-q",share:"share___3Z4qi",shareButton:"shareButton___1xnZm",userCard:"userCard___21hkC",user:"user___2_ahS",avatar:"avatar___3D1E2",info:"info___1TvVx",did:"did___2l6RX",assetsData:"assetsData___2HKpN",trade:"trade___28ESA",pairCoins:"pairCoins___2MPU-",pairCoinsItem:"pairCoinsItem___9HsfO",pairCoinsSelect:"pairCoinsSelect___3n7mZ",pairCoin:"pairCoin___dCpAR",pairCoinsItemIcon:"pairCoinsItemIcon___3QVpA",pairCoinsItemLabel:"pairCoinsItemLabel___3lpAy",pairCoinsItemInput:"pairCoinsItemInput___3AU_-",pairCoinsBalance:"pairCoinsBalance___q965W",balance:"balance___3vofh",maxButton:"maxButton___2smdF",pairCoinsSwitchButton:"pairCoinsSwitchButton___OiJlN",pairCoinsFlat:"pairCoinsFlat___qvkXZ",submitButton:"submitButton___3CDz3",tradeModal:"tradeModal___zsFM5",input:"input___hw-Kw",field:"field___2IvJY",title:"title___1o7rE",value:"value___2ivq-",container:"container___3S--u",topBar:"topBar___1Bs-Q",sponsored:"sponsored___1GAt0",cover:"cover___3ydoR",fingerHandle:"fingerHandle___3BuFQ"}},69764:function(W,R,n){"use strict";var L=n(71194),C=n(50146),T=n(57663),M=n(71577),y=n(402),U=n(3887),k=n(67294),A=n(55133),w=n.n(A),B=n(54549),v=n(85893),E=U.Z.Title,c=function(D){var s=D.visable,j=D.title,h=D.content,p=D.footer,_=D.close,i=D.bodyStyle,r=D.width;return(0,v.jsx)(C.Z,{title:j?(0,v.jsx)(E,{level:5,className:w().title,children:j}):null,closable:!!_,closeIcon:(0,v.jsx)(v.Fragment,{children:(0,v.jsx)(M.Z,{shape:"circle",size:"middle",type:"ghost",icon:(0,v.jsx)(B.Z,{onClick:_})})}),className:w().modal,centered:!0,visible:s,width:r!=null?r:650,footer:p,bodyStyle:i,children:h})};R.Z=c},46656:function(W,R,n){"use strict";var L=n(71194),C=n(50146),T=n(47673),M=n(32787),y=n(22385),U=n(31097),k=n(17462),A=n(76772),w=n(57663),B=n(71577),v=n(74379),E=n(38648),c=n(3182),f=n(2824),D=n(402),s=n(3887),j=n(94043),h=n.n(j),p=n(67294),_=n(43581),i=n(55133),r=n.n(i),d=n(3548),l=n(68855),u=n(47832),b=n(55347),O=n(51625),a=n(85893),x=s.Z.Title,g=function(o){var m=o.visable,V=o.setVisable,e=o.passphrase,S=o.setPassphrase,Y=o.func,G=o.changePassphrase,z=(0,_.tT)("apiWs"),q=(0,_.tT)("currentUser"),t=q.wallet,ee=(0,_.tT)("balance"),ne=ee.balance,re=(0,p.useState)(!1),te=(0,f.Z)(re,2),X=te[0],Q=te[1],oe=(0,p.useState)(),ae=(0,f.Z)(oe,2),$=ae[0],le=ae[1],N=(0,_.YB)(),ue=function(Z){S(Z?Z.target.value:"")},se=function(){var H=(0,c.Z)(h().mark(function Z(){var F,J,I,_e,ie;return h().wrap(function(P){for(;;)switch(P.prev=P.next){case 0:if(Q(!0),t!=null&&t.passphrase&&S(t==null?void 0:t.passphrase),!((!e||e.length<6)&&!(t!=null&&t.passphrase))){P.next=5;break}return Q(!1),P.abrupt("return");case 5:if(F=(t==null?void 0:t.passphrase)||e,!(F&&t!==null&&t!==void 0&&t.keystore)){P.next=16;break}if(J=(0,u.Gh)(F,t.keystore),J){P.next=13;break}return E.default.error({key:"passphraseError",message:N.formatMessage({id:"error.passphrase.error"}),duration:null}),S(""),Q(!1),P.abrupt("return");case 13:I=new b.ZP({type:"sr25519"}),_e=I.addFromUri(J),ie=_e.address,t!=null&&t.account&&t.account!==ie&&(localStorage.clear(),sessionStorage.clear(),window.location.href=O.Z.page.homePage);case 16:if(!Y){P.next=25;break}return P.prev=17,P.next=20,Y();case 20:P.next=25;break;case 22:P.prev=22,P.t0=P.catch(17),console.log("security modal submit func error fallback",P.t0);case 25:V(!1),Q(!1);case 27:case"end":return P.stop()}},Z,null,[[17,22]])}));return function(){return H.apply(this,arguments)}}(),de=function(){var H=(0,c.Z)(h().mark(function Z(){var F;return h().wrap(function(I){for(;;)switch(I.prev=I.next){case 0:if(!(!!z&&!!t.account)){I.next=11;break}return I.next=3,Y(!0,t.account);case 3:if(F=I.sent,!F){I.next=8;break}le(F.partialFee),I.next=11;break;case 8:if(G){I.next=11;break}return I.next=11,se();case 11:case"end":return I.stop()}},Z)}));return function(){return H.apply(this,arguments)}}();return(0,p.useEffect)(function(){!!z&&!!(t!=null&&t.account)&&m&&de()},[z,t==null?void 0:t.account,m]),(0,p.useEffect)(function(){!!(t!=null&&t.passphrase)&&m&&!G&&S(t==null?void 0:t.passphrase)},[t==null?void 0:t.passphrase,e,m,G]),(0,a.jsxs)(C.Z,{title:(0,a.jsx)(x,{level:3,children:N.formatMessage({id:"modal.security.title"})}),closable:!1,className:r().modal,centered:!0,visible:m,width:400,footer:(0,a.jsxs)("div",{className:r().buttons,children:[(0,a.jsx)(B.Z,{type:"text",shape:"round",size:"large",className:r().button,onClick:function(){V(!1),window.location.reload()},loading:X,children:N.formatMessage({id:"common.decline"})}),(0,a.jsx)(B.Z,{type:"primary",shape:"round",size:"large",className:r().button,onClick:function(){se()},disabled:!e||e.length<6,loading:X,children:N.formatMessage({id:"common.confirm"})})]}),children:[(0,a.jsxs)("div",{className:r().confirmContainer,children:[!!$&&!!($!=null&&$.toString())>ne.free&&(0,a.jsx)(A.Z,{description:N.formatMessage({id:"error.balance.low"}),type:"warning",showIcon:!0,banner:!0,className:r().alertContainer}),!!$&&(0,a.jsxs)("div",{className:r().field,children:[(0,a.jsxs)("div",{className:r().labal,children:[N.formatMessage({id:"modal.security.gas"}),(0,a.jsxs)("span",{className:r().small,children:["(",N.formatMessage({id:"modal.security.estimated"}),")"]}),(0,a.jsx)(U.Z,{placement:"bottom",title:N.formatMessage({id:"modal.security.gas.tooltip",defaultMessage:"Gas fees are paid to crypto miners who process transactions on the network. Parami does not profit from gas fees."}),children:(0,a.jsx)(l.Z,{className:r().labalIcon})})]}),(0,a.jsx)("div",{className:r().value,children:(0,a.jsx)(d.Z,{value:$,style:{fontSize:"0.8rem",fontWeight:900}})})]})]}),(!(t!=null&&t.passphrase)||G)&&(0,a.jsx)("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%"},children:(0,a.jsxs)("div",{className:r().codeInput,children:[(0,a.jsxs)("div",{className:r().verifyForm,children:[(0,a.jsx)("span",{className:(e==null?void 0:e.slice(0))&&!(e!=null&&e.slice(1,5))&&r().highLight,children:e==null?void 0:e.slice(0,1).replace(/[^]/,"\u2731")}),(0,a.jsx)("span",{className:(e==null?void 0:e.slice(1))&&!(e!=null&&e.slice(2,5))&&r().highLight,children:e==null?void 0:e.slice(1,2).replace(/[^]/,"\u2731")}),(0,a.jsx)("span",{className:(e==null?void 0:e.slice(2,3))&&!(e!=null&&e.slice(3,5))&&r().highLight,children:e==null?void 0:e.slice(2,3).replace(/[^]/,"\u2731")}),(0,a.jsx)("span",{className:(e==null?void 0:e.slice(3,4))&&!(e!=null&&e.slice(4,5))&&r().highLight,children:e==null?void 0:e.slice(3,4).replace(/[^]/,"\u2731")}),(0,a.jsx)("span",{className:(e==null?void 0:e.slice(4,5))&&!(e!=null&&e.slice(5))&&r().highLight,children:e==null?void 0:e.slice(4,5).replace(/[^]/,"\u2731")}),(0,a.jsx)("span",{className:(e==null?void 0:e.slice(5))&&r().highLight,children:e==null?void 0:e.slice(5).replace(/[^]/,"\u2731")})]}),(0,a.jsx)(M.Z.Password,{autoFocus:!0,autoComplete:"new-password",size:"large",className:r().verifyInput,onChange:ue,value:e,disabled:X,maxLength:6,visibilityToggle:!1})]})})]})};R.Z=g},3548:function(W,R,n){"use strict";var L=n(67294),C=n(31639),T=n.n(C),M=n(96534),y=n(85893),U=function(A){var w=A.value,B=A.style;return(0,y.jsxs)("div",{className:T().ad3,style:B,children:[w?(0,M.MP)(w):"--",(0,y.jsx)("span",{className:T().unit,children:"\xA0$AD3"})]})};R.Z=U},13580:function(W,R,n){"use strict";n.d(R,{Ay:function(){return U},f5:function(){return k},r7:function(){return A},L7:function(){return w},jd:function(){return B}});var L=n(11849),C=n(2824),T=n(3182),M=n(94043),y=n.n(M),U=function(){var v=(0,T.Z)(y().mark(function E(c){var f;return y().wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return s.next=2,window.apiWs.query.assets.metadata(Number(c));case 2:return f=s.sent,s.abrupt("return",f);case 4:case"end":return s.stop()}},E)}));return function(c){return v.apply(this,arguments)}}(),k=function(){var v=(0,T.Z)(y().mark(function E(c){var f;return y().wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return s.next=2,window.apiWs.query.assets.asset(Number(c));case 2:return f=s.sent,s.abrupt("return",f);case 4:case"end":return s.stop()}},E)}));return function(c){return v.apply(this,arguments)}}(),A=function(){var v=(0,T.Z)(y().mark(function E(c){var f;return y().wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return s.next=2,window.apiWs.query.assets.account.entries(c);case 2:return f=s.sent,s.abrupt("return",f);case 4:case"end":return s.stop()}},E)}));return function(c){return v.apply(this,arguments)}}(),w=function(){var v=(0,T.Z)(y().mark(function E(c,f){var D,s;return y().wrap(function(h){for(;;)switch(h.prev=h.next){case 0:return h.next=2,window.apiWs.query.assets.account(Number(f),c);case 2:if(D=h.sent,!D.isEmpty){h.next=5;break}return h.abrupt("return",null);case 5:return s=D.toHuman(),h.abrupt("return",s);case 7:case"end":return h.stop()}},E)}));return function(c,f){return v.apply(this,arguments)}}(),B=function(){var v=(0,T.Z)(y().mark(function E(){var c,f;return y().wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return s.next=2,window.apiWs.query.assets.metadata.entries();case 2:return c=s.sent,f=(c!=null?c:[]).map(function(j){var h=(0,C.Z)(j,2),p=h[0],_=h[1],i=p.toHuman();return i?(0,L.Z)((0,L.Z)({},_.toHuman()),{},{id:i[0].replaceAll(",","")}):null}).filter(Boolean),s.abrupt("return",f);case 5:case"end":return s.stop()}},E)}));return function(){return v.apply(this,arguments)}}()},28943:function(W,R,n){"use strict";n.d(R,{JI:function(){return B},X6:function(){return v},CD:function(){return f},MW:function(){return D},$R:function(){return s}});var L=n(11849),C=n(3182),T=n(94043),M=n.n(T),y=n(63667),U=n(47832),k=n(81603),A=n(59749),w=new y.Y({type:"sr25519"}),B=function(){var p=(0,C.Z)(M().mark(function _(i){var r;return M().wrap(function(l){for(;;)switch(l.prev=l.next){case 0:return l.next=2,window.apiWs.query.nft.preferred(i);case 2:return r=l.sent,l.abrupt("return",r);case 4:case"end":return l.stop()}},_)}));return function(i){return p.apply(this,arguments)}}(),v=function(){var p=(0,C.Z)(M().mark(function _(i){var r,d;return M().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,window.apiWs.query.nft.metadata(i);case 2:if(r=u.sent,!r.isEmpty){u.next=5;break}return u.abrupt("return",null);case 5:return d=r.toHuman(),u.abrupt("return",(0,L.Z)((0,L.Z)({},d),{},{classId:(0,A.At)(d.classId),tokenAssetId:(0,A.At)(d.tokenAssetId)}));case 7:case"end":return u.stop()}},_)}));return function(i){return p.apply(this,arguments)}}(),E=null,c=null,f=function(){var p=(0,C.Z)(M().mark(function _(i,r,d,l,u,b,O,a,x){var g,K,o,m;return M().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(g=window.apiWs.tx.nft.port(d,l,u.toHexString(),b,O),!(a&&x)){e.next=6;break}return e.next=4,g.paymentInfo(x);case 4:return K=e.sent,e.abrupt("return",K);case 6:if(o=(0,U.Gh)(i,r),!(o==null||!o)){e.next=9;break}throw new Error("Wrong password");case 9:return m=w.createFromUri(o),e.next=12,(0,k.Y)(g,m);case 12:return e.abrupt("return",e.sent);case 13:case"end":return e.stop()}},_)}));return function(i,r,d,l,u,b,O,a,x){return p.apply(this,arguments)}}(),D=function(){var p=(0,C.Z)(M().mark(function _(i,r,d,l,u,b){var O,a,x,g;return M().wrap(function(o){for(;;)switch(o.prev=o.next){case 0:if(O=window.apiWs.tx.nft.back(i,r),!(u&&b)){o.next=6;break}return o.next=4,O.paymentInfo(b);case 4:return a=o.sent,o.abrupt("return",a);case 6:if(x=(0,U.Gh)(d,l),!(x==null||!x)){o.next=9;break}throw new Error("Wrong password");case 9:return g=w.createFromUri(x),o.next=12,(0,k.Y)(O,g);case 12:return o.abrupt("return",o.sent);case 13:case"end":return o.stop()}},_)}));return function(i,r,d,l,u,b){return p.apply(this,arguments)}}(),s=function(){var p=(0,C.Z)(M().mark(function _(i,r,d,l,u,b,O){var a,x,g,K;return M().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:if(a=window.apiWs.tx.nft.mint(i,r,d,"1000000000000000000000"),!(b&&O)){m.next=6;break}return m.next=4,a.paymentInfo(O);case 4:return x=m.sent,m.abrupt("return",x);case 6:if(g=(0,U.Gh)(l,u),!(g==null||!g)){m.next=9;break}throw new Error("Wrong password");case 9:return K=w.createFromUri(g),m.next=12,(0,k.Y)(a,K);case 12:return m.abrupt("return",m.sent);case 13:case"end":return m.stop()}},_)}));return function(i,r,d,l,u,b,O){return p.apply(this,arguments)}}(),j=null,h=null}}]);