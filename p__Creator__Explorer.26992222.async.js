(self.webpackChunkparami_app=self.webpackChunkparami_app||[]).push([[8172],{90802:function(C){C.exports={explorerContainer:"explorerContainer___2tn58",dashboard:"dashboard___1yzjn",header:"header___7HFGw",buttons:"buttons____mn0V",button:"button___2bNYM",confirm:"confirm___14R24",topIcon:"topIcon___lcz8T",title:"title___3OHiQ",field:"field___1rYhg",value:"value___VpweH",notUser:"notUser___1H3wh",desc:"desc___3002O",buttonImport:"buttonImport___1UVlX",notSupport:"notSupport___3AII_",icon:"icon___2lOpA",text:"text___2HCAz",loading:"loading___38OsL",loadingTip:"loadingTip___2K2wM",avatar:"avatar___1Itlz",rotate:"rotate___3cdkL",image_blur:"image_blur___1JtdU"}},53932:function(C,S,t){"use strict";t.r(S);var Xe=t(48736),te=t(27049),Ye=t(57663),W=t(71577),Qe=t(12968),re=t(62462),g=t(3182),qe=t(74379),I=t(38648),f=t(2824),se=t(94043),d=t.n(se),_=t(67294),ne=t(90917),ie=t(55909),le=t.n(ie),oe=t(90802),u=t.n(oe),v=t(43581),_e=t(51615),K=t(96534),R=t(28943),T=t(51625),ue=t(61715),de=t(69764),j=t(13580),ve=t(29791),Z=t(32689),ce=t(59749),n=t(85893),fe=function(){var U,b,L=(0,v.tT)("apiWs"),me=(0,v.tT)("currentUser"),Ee=me.wallet,pe=(0,v.tT)("bodyChange"),N=pe.bodyHeight,ge=(0,_.useState)(!0),k=(0,f.Z)(ge,2),m=k[0],w=k[1],Me=(0,_.useState)(""),x=(0,f.Z)(Me,2),H=x[0],he=x[1],De=(0,_.useState)(!0),$=(0,f.Z)(De,2),F=$[0],z=$[1],Oe=(0,_.useState)(),J=(0,f.Z)(Oe,2),h=J[0],Pe=J[1],Ae=(0,_.useState)(),G=(0,f.Z)(Ae,2),D=G[0],Ie=G[1],ye=(0,_.useState)(!1),V=(0,f.Z)(ye,2),X=V[0],Te=V[1],Ue=(0,_.useState)(),Y=(0,f.Z)(Ue,2),O=Y[0],be=Y[1],Le=(0,_.useState)(),Q=(0,f.Z)(Le,2),P=Q[0],Be=Q[1],Ce=(0,_.useState)(null),q=(0,f.Z)(Ce,2),Se=q[0],We=q[1],Ke=(0,_.useState)(""),ee=(0,f.Z)(Ke,2),Re=ee[0],je=ee[1],E=(0,v.YB)(),Ze=(0,v.md)(),Ne=(U=document.getElementById("avatar"))===null||U===void 0?void 0:U.offsetTop,ke=(b=document.getElementById("avatar"))===null||b===void 0?void 0:b.offsetLeft,we=document.body.clientWidth,i=(0,_e.UO)(),xe=v.m8.location.query,He=xe,$e=He.referrer,y=i!=null&&i.kol?"did"+(i==null?void 0:i.kol):(0,K.st)(Ee.did),ae=(0,K.Zc)(y),B=function(r){I.default.error({message:r.message,duration:null})},Fe=function(){var s=(0,g.Z)(d().mark(function r(){var a;return d().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,ue.qX)(i.nftID);case 2:if(a=e.sent,a){e.next=6;break}return v.m8.replace("".concat(window.location.pathname,"/dao")),e.abrupt("return");case 6:be(a);case 7:case"end":return e.stop()}},r)}));return function(){return s.apply(this,arguments)}}(),ze=function(){var s=(0,g.Z)(d().mark(function r(a){var l,e,M,o,A;return d().wrap(function(c){for(;;)switch(c.prev=c.next){case 0:if(!((a==null||(l=a.metadata)===null||l===void 0?void 0:l.indexOf("ipfs://"))<0)){c.next=2;break}return c.abrupt("return");case 2:return M=a==null||(e=a.metadata)===null||e===void 0?void 0:e.substring(7),c.next=5,fetch(T.Z.ipfs.endpoint+M);case 5:return o=c.sent,c.next=8,o.json();case 8:if(A=c.sent,A){c.next=11;break}return c.abrupt("return");case 11:We(A),A.media||w(!1);case 13:case"end":return c.stop()}},r)}));return function(a){return s.apply(this,arguments)}}();(0,_.useEffect)(function(){if(O)try{var s=O.ad;if(!(s!=null&&s.metadata))return;Be(s),ze(s),(0,j.L7)(O.budgetPot,O.fractionId).then(function(r){var a;je((0,ce.At)((a=r==null?void 0:r.balance)!==null&&a!==void 0?a:""))}).catch(function(r){console.error("GetBalanceOfBudgetPot error:",r)})}catch(r){B(r)}},[O]);var Je=function(){var s=(0,g.Z)(d().mark(function r(){var a;return d().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,(0,R.JI)(ae);case 3:if(a=e.sent,!a.isEmpty){e.next=7;break}return z(!1),e.abrupt("return");case 7:window.location.href="".concat(window.location.origin,"/").concat(y,"/").concat(a),e.next=14;break;case 10:return e.prev=10,e.t0=e.catch(0),I.default.error({message:e.t0.message,duration:null}),e.abrupt("return");case 14:case"end":return e.stop()}},r,null,[[0,10]])}));return function(){return s.apply(this,arguments)}}();(0,_.useEffect)(function(){var s;document.title="".concat((s=D==null?void 0:D.name)!==null&&s!==void 0?s:y," - Para Metaverse Identity")},[D]);var Ge=function(){var s=(0,g.Z)(d().mark(function r(){var a;return d().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,R.X6)(i==null?void 0:i.nftID);case 2:if(a=e.sent,a){e.next=7;break}return I.default.error({message:E.formatMessage({id:"error.nft.notFound"}),duration:null}),v.m8.goBack(),e.abrupt("return");case 7:if((a==null?void 0:a.owner)===ae){e.next=11;break}return I.default.error({message:E.formatMessage({id:"error.nft.notFound"}),duration:null}),v.m8.goBack(),e.abrupt("return");case 11:Pe(a);case 12:case"end":return e.stop()}},r)}));return function(){return s.apply(this,arguments)}}();(0,_.useEffect)(function(){var s=function(){var r=(0,g.Z)(d().mark(function a(){var l,e;return d().wrap(function(o){for(;;)switch(o.prev=o.next){case 0:return o.next=2,(0,j.Ay)(h==null?void 0:h.tokenAssetId);case 2:if(l=o.sent,!l.isEmpty){o.next=6;break}return z(!1),o.abrupt("return");case 6:e=l.toHuman(),Ie(e);case 8:case"end":return o.stop()}},a)}));return function(){return r.apply(this,arguments)}}();if(h)try{s()}catch(r){B(r)}},[h]);var Ve=function(){var s=(0,g.Z)(d().mark(function r(){var a,l,e,M,o;return d().wrap(function(p){for(;;)switch(p.prev=p.next){case 0:return p.next=2,(0,Z.T9)(i==null?void 0:i.nftID);case 2:if(a=p.sent,l=a.data,!(l!=null&&l.token)){p.next=11;break}return p.next=7,(0,Z.nH)(l.token.icon);case 7:e=p.sent,M=e.data,o=e.response,(o==null?void 0:o.status)===200&&he(window.URL.createObjectURL(M));case 11:case"end":return p.stop()}},r)}));return function(){return s.apply(this,arguments)}}();return(0,_.useEffect)(function(){if(L&&!(i!=null&&i.nftID)&&Je(),Ze.canWalletUser||(localStorage.setItem("parami:wallet:redirect",window.location.href),Te(!0)),L)try{Fe(),Ge(),Ve()}catch(s){B(s)}},[L]),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)("div",{className:u().explorerContainer,children:[F&&(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(re.Z,{src:H||"/images/default-avatar.svg",fallback:"/images/default-avatar.svg",className:u().avatar,style:{top:m?(N-400)/2:Ne,left:m?(we-200)/2:ke,width:m?200:30,height:m?200:30,animation:m?1:0,position:m?"fixed":"absolute",display:m||P&&Object.keys(P).length?"flex":"none"},preview:!1}),(0,n.jsx)("div",{className:u().loading,style:{opacity:m?1:0,zIndex:m?15:-1,height:N,minHeight:"100vh"},children:(0,n.jsx)("span",{className:u().loadingTip,children:E.formatMessage({id:"creator.explorer.loading.tip",defaultMessage:"Let's find out more about the NFT.{br} Surprise awaits..."},{br:(0,n.jsx)("br",{})})})})]}),F&&P&&Object.keys(P).length>0&&(0,n.jsx)("div",{className:le().pageContainer,style:{paddingTop:50,maxWidth:"100%"},children:(0,n.jsx)(ne.Z,{ad:Se,nftId:i==null?void 0:i.nftID,referrer:$e,asset:D,avatar:H,did:y,adData:P,balance:Re,notAccess:X,adImageOnLoad:function(){w(!1)}})}),(0,n.jsx)(ve.Z,{})]}),(0,n.jsx)(de.Z,{visable:X,title:E.formatMessage({id:"error.identity.notUser"}),content:(0,n.jsx)("div",{className:u().notUser,children:(0,n.jsxs)("div",{className:u().buttons,children:[(0,n.jsxs)(W.Z,{block:!0,size:"large",type:"primary",shape:"round",className:u().button,onClick:function(){v.m8.push(T.Z.page.createPage)},children:[(0,n.jsx)("div",{className:u().title,children:E.formatMessage({id:"index.createAccount"})}),(0,n.jsx)("span",{className:u().desc,children:E.formatMessage({id:"index.createAccount.desc"})})]}),(0,n.jsx)(te.Z,{children:E.formatMessage({id:"index.or"})}),(0,n.jsxs)(W.Z,{block:!0,ghost:!0,size:"large",type:"link",shape:"round",className:"".concat(u().button," ").concat(u().buttonImport),onClick:function(){v.m8.push(T.Z.page.recoverPage)},children:[(0,n.jsx)("div",{className:u().title,children:E.formatMessage({id:"index.importAccount"})}),(0,n.jsx)("span",{className:u().desc,children:E.formatMessage({id:"index.importAccount.desc"})})]})]})}),close:void 0,footer:!1})]})};S.default=fe}}]);