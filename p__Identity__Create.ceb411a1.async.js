(self.webpackChunkparami_app=self.webpackChunkparami_app||[]).push([[5788],{89922:function(g){g.exports={discordButton:"discordButton___4MA3J",loginButton:"loginButton___38-7w",loginIcon:"loginIcon___8_XHZ"}},55133:function(g){g.exports={modal:"modal___1O81X",codeInput:"codeInput___1b6is",verifyForm:"verifyForm___3o9Cw",highLight:"highLight___wTtyW",verifyInput:"verifyInput___29jF0",buttons:"buttons___2s-8l",button:"button___13mjZ",title:"title___35CCk",confirmContainer:"confirmContainer___3-95Y",alertContainer:"alertContainer___HBKri",field:"field___mBf3w",labal:"labal___1ZC5A",small:"small___1qvTc",labalIcon:"labalIcon___Wx-BW",value:"value___16uzM"}},18368:function(g){g.exports={telegramButton:"telegramButton___8R2Ls",telegramLoginBtn:"telegramLoginBtn___1FLM1",loginButton:"loginButton___3sgLh",loginIcon:"loginIcon___3LSmP"}},31639:function(g){g.exports={ad3:"ad3___22MgQ",unit:"unit___UR_Yf"}},79680:function(g){g.exports={twitterBtn:"twitterBtn___3Cu2j",loginButton:"loginButton___1bApT",loginIcon:"loginIcon___2vlgD"}},78256:function(g){g.exports={field:"field___21P8B",topIcon:"topIcon___2feHU",title:"title___2lv3m",listBtn:"listBtn___ZklYc",value:"value___2tC7P",description:"description___1Zm7_",recoveryLinkContainer:"recoveryLinkContainer___1gf4v",seedPhrase:"seedPhrase___6WKE4",singlePhrase:"singlePhrase___1Wsek",singlePhraseIndex:"singlePhraseIndex___MB3DK",singlePhraseWord:"singlePhraseWord___2ZcCQ",copyButton:"copyButton___1L3lB",recoveryLinkSpinWrapper:"recoveryLinkSpinWrapper___10d5q",buttons:"buttons___1Iocf",button:"button___139kU",link:"link___ONM3m",codeInput:"codeInput___1qEMw",verifyForm:"verifyForm___2rtdl",highLight:"highLight___cDLIk",verifyInput:"verifyInput___3Kj9u",exchanges:"exchanges___2CaMl",socialButtons:"socialButtons___KyyfR",stepContainer:"stepContainer___UdUnF"}},69764:function(g,M,e){"use strict";var K=e(71194),l=e(50146),f=e(57663),p=e(71577),z=e(402),r=e(3887),o=e(67294),_=e(55133),E=e.n(_),Q=e(54549),S=e(85893),Y=r.Z.Title,he=function(T){var G=T.visable,oe=T.title,$=T.content,Ae=T.footer,ce=T.close,P=T.bodyStyle,de=T.width;return(0,S.jsx)(l.Z,{title:oe?(0,S.jsx)(Y,{level:5,className:E().title,children:oe}):null,closable:!!ce,closeIcon:(0,S.jsx)(S.Fragment,{children:(0,S.jsx)(p.Z,{shape:"circle",size:"middle",type:"ghost",icon:(0,S.jsx)(Q.Z,{onClick:ce})})}),className:E().modal,centered:!0,visible:G,width:de!=null?de:650,footer:Ae,bodyStyle:P,children:$})};M.Z=he},3548:function(g,M,e){"use strict";var K=e(67294),l=e(31639),f=e.n(l),p=e(96534),z=e(85893),r=function(_){var E=_.value,Q=_.style;return(0,z.jsxs)("div",{className:f().ad3,style:Q,children:[E?(0,p.MP)(E):"--",(0,z.jsx)("span",{className:f().unit,children:"\xA0$AD3"})]})};M.Z=r},20779:function(g,M,e){"use strict";e.r(M),e.d(M,{default:function(){return jt}});var K=e(74379),l=e(38648),f=e(3182),p=e(2824),z=e(94043),r=e.n(z),o=e(67294),_=e(55909),E=e.n(_),Q=e(54014),S=e(58024),Y=e(39144),he=e(20228),ee=e(11382),T=e(48736),G=e(27049),oe=e(57663),$=e(71577),Ae=e(402),ce=e(3887),P=e(43581),de=e(78256),d=e.n(de),Z=e(51625),Ke=e(89922),Ce=e.n(Ke),_e=e(90077),$e=e.n(_e),t=e(85893),Fe=function(v){var h=v.clientId,c=v.redirectUri,y=c;y||(y=window.location.href);var O=function(){window.location.href="".concat(Z.Z.airdropService.discord.oauthEndpoint,"?response_type=token&client_id=").concat(h,"&scope=identify&redirect_uri=").concat(y,"&state=airdrop")};return(0,t.jsx)("div",{className:Ce().discordButton,children:(0,t.jsxs)("button",{className:Ce().loginButton,onClick:function(){O()},children:[(0,t.jsx)("img",{src:$e(),className:Ce().loginIcon}),"Create by Discord"]})})},Oe=Fe,He=e(93488),V=e(7085),ze=e(18368),ye=e.n(ze),Qe=e(48997),Ye=e.n(Qe),Ge=e(17728),Ve=e.n(Ge),Xe=function(v){var h=v.dataOnauth,c=v.botName;return(0,t.jsxs)("div",{className:ye().telegramButton,children:[(0,t.jsx)(Ve(),{dataOnauth:h,botName:c,className:ye().telegramLoginBtn}),(0,t.jsxs)("div",{className:ye().loginButton,children:[(0,t.jsx)("img",{src:Ye(),className:ye().loginIcon}),"Create by Telegram"]})]})},Te=Xe,Je=e(19273),qe=e(79680),xe=e.n(qe);function et(ae){(0,Je.Z)(ae);var v=function(){var h=(0,f.Z)(r().mark(function c(){return r().wrap(function(O){for(;;)switch(O.prev=O.next){case 0:window.location.href="".concat(Z.Z.main.airdropServer,"/twitterLogin?state=airdrop");case 1:case"end":return O.stop()}},c)}));return function(){return h.apply(this,arguments)}}();return(0,t.jsx)("div",{className:xe().twitterBtn,children:(0,t.jsxs)("button",{className:xe().loginButton,onClick:function(){v()},children:[(0,t.jsx)("img",{src:"/images/sns/twitter-white.svg",className:xe().loginIcon}),"Create by Twitter"]})})}var Le=et,tt=e(50671),at=function(v){var h=v.setStep,c=v.setQuickSign,y=(0,P.tT)("apiWs"),O=(0,o.useState)(!0),L=(0,p.Z)(O,2),C=L[0],N=L[1],x=(0,P.YB)(),ne=ce.Z.Title;(0,o.useEffect)(function(){var B=(0,tt.Y)();B.platform&&(c({platform:"".concat(B.platform),ticket:B}),h(3))},[]);var ue=function(){var B=(0,f.Z)(r().mark(function b(F,se){return r().wrap(function(J){for(;;)switch(J.prev=J.next){case 0:c({platform:se,ticket:F}),h(3);case 2:case"end":return J.stop()}},b)}));return function(F,se){return B.apply(this,arguments)}}();return(0,o.useEffect)(function(){y&&N(!1)},[y]),(0,t.jsx)(Y.Z,{className:E().card,children:(0,t.jsxs)(ee.Z,{size:"large",tip:x.formatMessage({id:"common.loading"}),spinning:C,style:{display:"flex",maxHeight:"100%"},children:[(0,t.jsx)("img",{src:"/images/icon/option.svg",className:d().topIcon}),(0,t.jsx)(ne,{className:d().title,children:x.formatMessage({id:"identity.quicksign.title"})}),(0,t.jsx)("p",{className:d().description,children:x.formatMessage({id:"identity.quicksign.description1"})}),(0,t.jsx)("p",{className:d().description,children:x.formatMessage({id:"identity.quicksign.description2"})}),(0,t.jsx)($.Z,{type:"link",size:"large",className:d().link,icon:(0,t.jsx)(He.Z,{}),onClick:function(){window.open("http://parami.io","_blank")},children:x.formatMessage({id:"identity.quicksign.learnMore"})}),(0,t.jsx)(G.Z,{children:x.formatMessage({id:"identity.beforeStart.faucet"})}),(0,t.jsxs)(ee.Z,{spinning:!y,indicator:(0,t.jsx)(V.Z,{style:{fontSize:24},spin:!0}),children:[(0,t.jsx)(Le,{}),(0,t.jsx)(Te,{dataOnauth:function(b){b.bot=Z.Z.airdropService.telegram.botName,ue(b,"Telegram")},botName:Z.Z.airdropService.telegram.botName}),(0,t.jsx)(Oe,{clientId:Z.Z.airdropService.discord.clientId,redirectUri:window.location.origin+"/oauth/discord"})]}),(0,t.jsx)(G.Z,{children:x.formatMessage({id:"index.or"})}),(0,t.jsxs)("div",{className:d().buttons,children:[(0,t.jsx)($.Z,{block:!0,type:"primary",shape:"round",size:"large",className:d().button,style:{maxWidth:"240px"},loading:!y,onClick:function(){return h(3)},children:x.formatMessage({id:"identity.quicksign.manual"})}),(0,t.jsx)($.Z,{block:!0,type:"link",size:"large",onClick:function(){return P.m8.push(Z.Z.page.homePage)},children:x.formatMessage({id:"common.cancel"})}),(0,t.jsx)("small",{style:{textAlign:"center",marginTop:20,color:"rgb(114, 114, 122)"},children:x.formatMessage({id:"identity.beforeStart.licDesc"})})]})]})})},nt=at,Et=e(62350),st=e(66823),Dt=e(71153),rt=e(60331),Mt=e(34792),Ne=e(48086),St=e(47673),it=e(32787),Ct=e(35556),we=e(97880),lt=e(69764),ot=e(74855),We=e.n(ot),ct=e(99165),dt=e(25592),Ue=e(32689),be=e(3548),X=e(59749),ut=e(22629),te=e(75397),je=null,mt=function(v){var h=v.passphrase,c=v.account,y=v.keystore,O=v.did,L=v.setDID,C=v.quickSign,N=(0,P.tT)("apiWs"),x=(0,P.tT)("@@initialState"),ne=x.refresh,ue=(0,o.useState)(!1),B=(0,p.Z)(ue,2),b=B[0],F=B[1],se=(0,o.useState)(!1),re=(0,p.Z)(se,2),J=re[0],w=re[1],Be=(0,o.useState)(2),me=(0,p.Z)(Be,2),R=me[0],H=me[1],Ie=(0,o.useState)(BigInt(0)),ge=(0,p.Z)(Ie,2),ie=ge[0],Ee=ge[1],Pe=(0,o.useState)(),De=(0,p.Z)(Pe,2),W=De[0],I=De[1],j=(0,P.YB)(),Ze=ce.Z.Title,k=we.Z.Step,Me=it.Z.TextArea,le=function(){var n=(0,f.Z)(r().mark(function u(){var i;return r().wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,ne();case 2:i=localStorage.getItem("parami:wallet:redirect")||Z.Z.page.walletPage,localStorage.removeItem("parami:wallet:inProcess"),localStorage.removeItem("parami:wallet:redirect"),window.location.href=i;case 6:case"end":return a.stop()}},u)}));return function(){return n.apply(this,arguments)}}(),ve=function(){var n=(0,f.Z)(r().mark(function u(i,D){var a,s,U;return r().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return w(!0),m.prev=1,m.next=4,(0,Ue.PU)({ticket:i,site:D,wallet:c});case 4:if(a=m.sent,s=a.response,U=a.data,s){m.next=10;break}return l.default.error({key:"networkException",message:"Network exception",description:"Unable to connect to airdrop server. Please replace the network environment, refresh and try again, or deposit manually.",duration:null}),m.abrupt("return");case 10:if((s==null?void 0:s.status)!==200){m.next=15;break}return l.default.success({message:"Airdrop Success"}),H(3),m.abrupt("return");case 15:if((s==null?void 0:s.status)!==401){m.next=20;break}return l.default.error({message:"".concat(U),description:"Cannot get your profile picture or username. Please check your ".concat(D," privacy setting, or verify by making a deposit instead. Click here for details."),duration:null,onClick:function(){window.open("https://parami.notion.site/Setting-up-Telegram-to-bind-Parami-f2b43b04c87c4467841499b3d5732b99")}}),P.m8.push(Z.Z.page.createPage),w(!1),m.abrupt("return");case 20:if((s==null?void 0:s.status)!==409){m.next=24;break}return l.default.error({message:"".concat(U),description:"Your ".concat(D," account has been used. Please try to deposit manually."),duration:null}),w(!1),m.abrupt("return");case 24:if((s==null?void 0:s.status)!==400){m.next=28;break}return l.default.error({message:"Got an error",description:"Something went wrong, please try again latar.",duration:null}),w(!1),m.abrupt("return");case 28:l.default.error({message:"Got an error",description:"Unknown: Something went wrong, please try again latar.",duration:null}),w(!1),m.next=37;break;case 32:return m.prev=32,m.t0=m.catch(1),l.default.error({key:"unknowError",message:m.t0.message,duration:null}),w(!1),m.abrupt("return");case 37:case"end":return m.stop()}},u,null,[[1,32]])}));return function(i,D){return n.apply(this,arguments)}}(),fe=function(){var n=(0,f.Z)(r().mark(function u(){var i,D;return r().wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return s.prev=0,s.next=3,(0,te.RA)(c);case 3:if(i=s.sent,!i){s.next=9;break}L(i),localStorage.setItem("parami:wallet:did",i),s.next=15;break;case 9:return s.next=11,(0,te.sG)(h,y);case 11:D=s.sent,i=D.did.Assigned[0][0],L(i),localStorage.setItem("parami:wallet:did",i);case 15:s.next=21;break;case 17:return s.prev=17,s.t0=s.catch(0),l.default.error({key:"unknowError",message:s.t0.message||s.t0,duration:null}),s.abrupt("return");case 21:H(C?4:5);case 22:case"end":return s.stop()}},u,null,[[0,17]])}));return function(){return n.apply(this,arguments)}}(),q=function(){var n=(0,f.Z)(r().mark(function u(){var i;return r().wrap(function(a){for(;;)switch(a.prev=a.next){case 0:if(N){a.next=2;break}return a.abrupt("return");case 2:if(!c){a.next=6;break}return a.next=5,N.query.system.account(c,function(s){var U=s.data;i&&i!=="".concat(U.free)&&l.default.success({key:"balanceChange",message:"Changes in Balance",description:(0,ut.a)(BigInt("".concat(U.free))-BigInt(i),{withUnit:"AD3"},18)}),i="".concat(U.free),BigInt("".concat(U.free))>(0,X.HM)("0",18)&&Ee(U.free)});case 5:je=a.sent;case 6:case"end":return a.stop()}},u)}));return function(){return n.apply(this,arguments)}}(),Se=function(){var n=(0,f.Z)(r().mark(function u(i){return r().wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,ve(i.ticket,i.platform);case 3:je===null&&q(),a.next=10;break;case 6:return a.prev=6,a.t0=a.catch(0),l.default.error({key:"unknowError",message:a.t0.message,duration:null}),a.abrupt("return");case 10:case"end":return a.stop()}},u,null,[[0,6]])}));return function(i){return n.apply(this,arguments)}}(),pe=function(){var n=(0,f.Z)(r().mark(function u(i){var D,a,s;return r().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return A.prev=0,A.next=3,(0,Ue.L0)({site:i==null?void 0:i.platform,wallet:c});case 3:D=A.sent,a=D.response,s=D.data,(a==null?void 0:a.status)===204?l.default.success({message:"Bind social account success!"}):l.default.warning({message:s,description:"Having trouble bindind your social account. Please try later in Parami Account.",duration:10}),A.next=12;break;case 9:A.prev=9,A.t0=A.catch(0),l.default.warning({message:A.t0.message||A.t0,description:"Having trouble bindind your social account. Please try later in Parami Account.",duration:10});case 12:H(5),le();case 14:case"end":return A.stop()}},u,null,[[0,9]])}));return function(i){return n.apply(this,arguments)}}(),ke=function(){var n=(0,f.Z)(r().mark(function u(){var i;return r().wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,(0,te.wz)();case 2:i=a.sent,I((0,X.mI)(BigInt(i)+(0,X.HM)("".concat((.02*1).toString()),18),18));case 4:case"end":return a.stop()}},u)}));return function(){return n.apply(this,arguments)}}();return(0,o.useEffect)(function(){N&&c&&(ke(),q())},[N,c]),(0,o.useEffect)(function(){O&&(C?pe(C):le())},[O]),(0,o.useEffect)(function(){if(!(h===""||c===""||y==="")&&C){Se(C);return}},[h,c,y,C]),(0,o.useEffect)(function(){!!W&&ie>=(0,X.HM)(W,18)?(H(3),w(!0),je!==null&&je(),fe()):!!W&&ie>0&&ie<(0,X.HM)(W,18)&&l.default.error({key:"balanceNotEnough",message:"Sorry, your credit is running low",description:"Please make sure to recharge ".concat(W," $AD3 at least"),duration:null})},[ie,W]),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(Y.Z,{className:E().card,bodyStyle:{padding:0,width:"100%"},children:(0,t.jsxs)(ee.Z,{size:"large",tip:(0,t.jsxs)(we.Z,{direction:"vertical",size:"default",current:R,className:d().stepContainer,children:[(0,t.jsx)(k,{title:"Create Account",icon:R===0?(0,t.jsx)(V.Z,{}):!1}),(0,t.jsx)(k,{title:"Generate Passphrase",icon:R===1?(0,t.jsx)(V.Z,{}):!1}),(0,t.jsx)(k,{title:"Deposit",icon:R===2?(0,t.jsx)(V.Z,{}):!1}),(0,t.jsx)(k,{title:"Create DID",icon:R===3?(0,t.jsx)(V.Z,{}):!1}),C&&(0,t.jsx)(k,{title:"Bind Social Account",icon:R===4?(0,t.jsx)(V.Z,{}):!1}),(0,t.jsx)(k,{title:"Completing",icon:R===5?(0,t.jsx)(V.Z,{}):!1})]}),indicator:(0,t.jsx)(t.Fragment,{}),spinning:J,wrapperClassName:E().pageContainer,style:{background:"rgba(255,255,255,.7)",padding:30},children:[(0,t.jsx)("img",{src:"/images/icon/transaction.svg",className:d().topIcon}),(0,t.jsx)(Ze,{className:d().title,children:j.formatMessage({id:"identity.initialDeposit.title"})}),(0,t.jsx)("p",{className:d().description,children:j.formatMessage({id:"identity.initialDeposit.description"},{ad3:(0,t.jsx)("strong",{children:(0,t.jsx)(be.Z,{value:(0,X.HM)(W,18).toString()})})})}),(0,t.jsx)(G.Z,{}),(0,t.jsx)($.Z,{type:"link",onClick:function(){F(!0)},children:j.formatMessage({id:"identity.initialDeposit.whereToBuy"})}),(0,t.jsxs)("div",{className:d().listBtn,children:[(0,t.jsxs)("div",{className:d().field,style:{flexDirection:"column"},children:[(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"100%",marginBottom:10},children:[(0,t.jsx)("span",{className:d().title,children:j.formatMessage({id:"identity.initialDeposit.chargeAddress"})}),(0,t.jsx)("span",{className:d().value,children:(0,t.jsx)(We(),{text:c,onCopy:function(){return Ne.default.success(j.formatMessage({id:"common.copied"}))},children:(0,t.jsx)($.Z,{type:"link",icon:(0,t.jsx)(ct.Z,{}),children:j.formatMessage({id:"common.copy"})})})})]}),(0,t.jsx)(We(),{text:c,onCopy:function(){return Ne.default.success(j.formatMessage({id:"common.copied"}))},children:(0,t.jsx)(Me,{size:"small",style:{backgroundColor:"#fff"},readOnly:!0,value:c,autoSize:{minRows:1,maxRows:4}})})]}),(0,t.jsxs)("div",{className:d().field,children:[(0,t.jsx)("span",{className:d().title,children:j.formatMessage({id:"identity.initialDeposit.status"})}),(0,t.jsx)("span",{className:d().value,children:(0,t.jsx)(rt.Z,{color:"processing",icon:(0,t.jsx)(dt.Z,{spin:!0}),children:j.formatMessage({id:"identity.initialDeposit.status.pending"})})})]}),(0,t.jsxs)("div",{className:d().field,children:[(0,t.jsx)("span",{className:d().title,children:j.formatMessage({id:"identity.initialDeposit.minCharge"})}),(0,t.jsx)("span",{className:d().value,children:(0,t.jsx)(be.Z,{value:(0,X.HM)(W,18).toString()})})]})]}),(0,t.jsx)(st.Z,{placement:"top",title:j.formatMessage({id:"identity.recreate.description"}),onConfirm:function(){localStorage.clear(),sessionStorage.clear(),window.location.href=Z.Z.page.homePage},okText:"Yes",cancelText:"No",children:(0,t.jsx)("a",{style:{textDecoration:"underline",color:"rgb(114, 114, 122)"},children:j.formatMessage({id:"identity.recreate"})})}),(0,t.jsxs)("div",{className:d().socialButtons,children:[(0,t.jsx)(G.Z,{children:j.formatMessage({id:"identity.beforeStart.faucet"})}),(0,t.jsx)(Le,{}),(0,t.jsx)(Te,{dataOnauth:function(u){u.bot=Z.Z.airdropService.telegram.botName,ve(u,"Telegram")},botName:Z.Z.airdropService.telegram.botName}),(0,t.jsx)(Oe,{clientId:Z.Z.airdropService.discord.clientId,redirectUri:window.location.origin+"/oauth/discord"})]})]})}),(0,t.jsx)(lt.Z,{visable:b,title:j.formatMessage({id:"identity.initialDeposit.buyAD3"}),content:(0,t.jsx)(t.Fragment,{children:(0,t.jsxs)("div",{className:d().exchanges,children:[(0,t.jsx)("a",{href:"https://www.binance.com/",target:"_blank",rel:"noreferrer",children:(0,t.jsx)("img",{src:"/images/exchange/binance-logo.svg",alt:"BINANCE"})}),(0,t.jsx)("a",{href:"https://www.gate.io/",target:"_blank",rel:"noreferrer",children:(0,t.jsx)("img",{src:"/images/exchange/gate-io-logo.svg",alt:"GATE"})})]})}),footer:(0,t.jsx)(t.Fragment,{children:(0,t.jsx)($.Z,{block:!0,shape:"round",size:"large",onClick:function(){F(!1)},children:j.formatMessage({id:"common.close"})})})})]})},gt=mt,vt=e(22930),ft=e(95216),pt=e.n(ft),ht=e(96534),Re=new(pt())(navigator.userAgent||navigator.vendor||window.opera),yt=function(){var v,h=(0,P.tT)("apiWs"),c=(0,P.tT)("@@initialState"),y=c.initialState,O=(0,o.useState)(1),L=(0,p.Z)(O,2),C=L[0],N=L[1],x=(0,o.useState)(),ne=(0,p.Z)(x,2),ue=ne[0],B=ne[1],b=(0,o.useState)(""),F=(0,p.Z)(b,2),se=F[0],re=F[1],J=(0,o.useState)(""),w=(0,p.Z)(J,2),Be=w[0],me=w[1],R=(0,o.useState)(""),H=(0,p.Z)(R,2),Ie=H[0],ge=H[1],ie=(0,o.useState)(""),Ee=(0,p.Z)(ie,2),Pe=Ee[0],De=Ee[1],W=(0,P.md)(),I=y==null||(v=y.currentInfo)===null||v===void 0?void 0:v.wallet,j=function(){var Ze=(0,f.Z)(r().mark(function k(){var Me,le,ve,fe,q,Se,pe;return r().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,n.next=3,(0,te.kp)();case 3:return Me=n.sent,le=Me.mnemonic,n.next=7,(0,te.Rg)(le);case 7:return ve=n.sent,fe=ve.address,ge(fe),localStorage.setItem("parami:wallet:account",fe),q=(0,ht.M8)().substring(0,6),re(q),localStorage.setItem("parami:wallet:passphrase",q),n.next=16,(0,te.Bc)(le,q);case 16:Se=n.sent,pe=Se.keystore,me(pe),localStorage.setItem("parami:wallet:keystore",pe),n.next=26;break;case 22:return n.prev=22,n.t0=n.catch(0),l.default.error({message:"Create Account Failed",description:n.t0.message||n.t0,duration:null}),n.abrupt("return");case 26:case"end":return n.stop()}},k,null,[[0,22]])}));return function(){return Ze.apply(this,arguments)}}();return(0,o.useEffect)(function(){if(!!h){if(W.canWalletUser){localStorage.removeItem("parami:wallet:inProcess"),P.m8.push(Z.Z.page.walletPage);return}if(localStorage.setItem("parami:wallet:inProcess","createAccount"),!!(I!=null&&I.account)&&!!(I!=null&&I.keystore)&&!!(I!=null&&I.passphrase)){ge(I.account),me(I.keystore),re(I.passphrase);return}j()}},[h]),(0,o.useEffect)(function(){if(Re.isInApp){N(-1);return}if(Re.browser==="safari"&&!vt.Z){N(-1);return}},[C]),(0,t.jsxs)("div",{className:E().mainContainer,children:[(0,t.jsx)("div",{className:E().background}),(0,t.jsx)("div",{className:E().logoMark}),(0,t.jsxs)("div",{className:E().pageContainer,children:[C===-1&&(0,t.jsx)(Q.Z,{}),C===1&&(0,t.jsx)(nt,{setStep:N,setQuickSign:B}),C===3&&(0,t.jsx)(gt,{quickSign:ue,passphrase:se,account:Ie,keystore:Be,did:Pe,setDID:De})]})]})},jt=yt},54014:function(g,M,e){"use strict";var K=e(58024),l=e(39144),f=e(57106),p=e(99683),z=e(12968),r=e(62462),o=e(67294),_=e(43581),E=e(55909),Q=e.n(E),S=e(85893),Y=window.navigator.userAgent.toLowerCase(),he=/iphone|ipod|ipad/.test(Y),ee=/android|adr/.test(Y),T=function(){var oe=(0,_.YB)();return(0,S.jsx)(l.Z,{className:Q().card,children:(0,S.jsx)(p.ZP,{icon:(0,S.jsxs)(S.Fragment,{children:[he&&(0,S.jsx)(r.Z,{src:"/images/icon/safari_logo.svg",preview:!1,style:{width:120,height:120}}),ee&&(0,S.jsx)(r.Z,{src:"/images/icon/chrome_logo.svg",preview:!1,style:{width:120,height:120}})]}),title:"Not Supported",subTitle:oe.formatMessage({id:"error.broswer.notSupport"})})})};M.Z=T},22930:function(g,M){"use strict";var e=[320/454,375/553,375/548,414/622,414/617,375/634,375/635,414/718,414/719,414/714,414/715,375/628,375/629,390/663,390/664,428/745,428/746,390/844].some(function(f){return f===document.documentElement.clientWidth/document.documentElement.clientHeight}),K=/Safari/.test(navigator.userAgent),l=K&&e;M.Z=l},50671:function(g,M,e){"use strict";e.d(M,{Y:function(){return p}});var K=e(11849),l=e(80129),f=e.n(l),p=function(){try{var r=new URL(window.location.href);return(0,K.Z)((0,K.Z)({},f().parse(r.search.substring(1))),f().parse(r.hash.substring(1)))}catch(o){return console.log("Parse url params error",o),{}}}},90077:function(g,M,e){g.exports=e.p+"static/discord-white.68b98d28.svg"},48997:function(g,M,e){g.exports=e.p+"static/telegram.b811c98b.svg"}}]);