(self.webpackChunkparami_app=self.webpackChunkparami_app||[]).push([[9767],{55133:function(re){re.exports={modal:"modal___1O81X",codeInput:"codeInput___1b6is",verifyForm:"verifyForm___3o9Cw",highLight:"highLight___wTtyW",verifyInput:"verifyInput___29jF0",buttons:"buttons___2s-8l",button:"button___13mjZ",title:"title___35CCk",confirmContainer:"confirmContainer___3-95Y",alertContainer:"alertContainer___HBKri",field:"field___mBf3w",labal:"labal___1ZC5A",small:"small___1qvTc",labalIcon:"labalIcon___Wx-BW",value:"value___16uzM"}},76705:function(re){re.exports={loginCard:"loginCard___29ISC",title:"title___1Nywl",appList:"appList___3WcLg",appItem:"appItem___3n4xF",appIcon:"appIcon___3I5gJ",info:"info___AECmK",name:"name___1p-lf",icon:"icon___3Ijcm",desc:"desc___1DhqV",rightArrow:"rightArrow___Np2km",getWallet:"getWallet___3Nr1f",modalContainer:"modalContainer___2uiYJ",logo:"logo___3P-qd"}},28485:function(re){re.exports={modalContainer:"modalContainer___-OmoV",title:"title___jHfhN",slider:"slider___2rQGO",rangeBlocks:"rangeBlocks___114us",block:"block___2Ls1o",blockBody:"blockBody___3lrn4",control:"control___1SmkP",input:"input___2deQ8",rate:"rate___1f2aC",fullrange:"fullrange___17juJ",gotoUniswap:"gotoUniswap___NeldB"}},18683:function(re){re.exports={stakeContainer:"stakeContainer___3Wnyg",headerContainer:"headerContainer___2AWqj",titleContainer:"titleContainer___3aar4",description:"description___2uci_",buttonContainer:"buttonContainer___lr5mw",button:"button___1weEY",stakeItem:"stakeItem___rJWXZ",stakeMain:"stakeMain___2Rx-m",tokenPair:"tokenPair___3omRi",tokenIcons:"tokenIcons___B7EY1",icon:"icon___XAYGP",tokenNameAndRate:"tokenNameAndRate___31GGO",tokenName:"tokenName___1f79L",tokenRate:"tokenRate___3xlpY",expandButton:"expandButton___3T4oQ",expandButtonIcon:"expandButtonIcon___kIy4s",rowsContainer:"rowsContainer___2J7wS",rowsContentContainer:"rowsContentContainer___D22Tl",actionButtons:"actionButtons___3Weot",actionButton:"actionButton____uDCr",actionButtonDesc:"actionButtonDesc___1Y9d2",nftList:"nftList___2d97b",nftItem:"nftItem___QV_hy",nftReward:"nftReward___2UABf",stakeButton:"stakeButton___6ux45",noNFT:"noNFT___1tNHL",tokenAPY:"tokenAPY___ktTfK",tokenLiquidity:"tokenLiquidity___2FGtf",tokenRewardRange:"tokenRewardRange___2SX-9",tokenRewards:"tokenRewards___2zxhR",nftItemBlock:"nftItemBlock___26tgz",title:"title___1e5b8",value:"value___34yVs",tipButton:"tipButton___rdcWJ"}},24787:function(re){re.exports={mainContainer:"mainContainer___VzUCC",mainBgContainer:"mainBgContainer___2Nlq7",mainIndexContainer:"mainIndexContainer___1Mqvq",background:"background___25786",logoMark:"logoMark___153gX",mainTopContainer:"mainTopContainer___2Cw6K",pageContainer:"pageContainer___2ssxe",stepContainer:"stepContainer___LPJXV",contentContainer:"contentContainer___2e-al",badge:"badge___3vf4B",dashboardCard:"dashboardCard___3oOcj",windowCard:"windowCard___3FjX2",windowCardBody:"windowCardBody___2zSRs",field:"field___3q5d2",title:"title___1BPSo",value:"value___1TvCY",rowField:"rowField___1vUg5",switchButton:"switchButton___3EjXy",statistic:"statistic___2TWER",modalBody:"modalBody___3SJQA",dividerTitle:"dividerTitle___1UTj3",table:"table___1zfPw",withAfterInput:"withAfterInput___3UZxJ",tabSelector:"tabSelector___2tj32",tabItem:"tabItem___3ymbk",inactive:"inactive___12iuZ",noAssets:"noAssets___FcwbD",topImage:"topImage___mHPfd"}},97409:function(re,Pe,a){"use strict";var ia=a(71153),Me=a(60331),la=a(12968),F=a(62462),I=a(67294),pe=a(43581),Fe=a(72643),Be=a(73218),R=a(85893);function je(u){var Ie=u.theme,t=u.supportedChainId,r=(0,pe.tT)("web3"),ne=r.Account,we=r.ChainName,X=r.ChainId,n=t&&X&&t!==X;return(0,R.jsx)(R.Fragment,{children:ne&&(0,R.jsxs)("div",{className:"addressContainer ".concat(Ie!=null?Ie:"wallet"," ").concat(n?"notSupported":""),children:[n&&(0,R.jsxs)(R.Fragment,{children:[(0,R.jsxs)("div",{className:"error",children:[(0,R.jsx)(Be.Z,{className:"error-icon"}),"Network Type Error"]}),(0,R.jsxs)("div",{className:"error-msg",children:["Please switch to ",Fe.i[t],"."]})]}),!n&&(0,R.jsxs)(R.Fragment,{children:[(0,R.jsxs)("div",{className:"ethLogo",children:[(0,R.jsx)(F.Z,{src:"/images/crypto/eth-circle.svg",preview:!1,className:"ethLogoImg"}),"ETH Address"]}),!!X&&X!==1&&(0,R.jsx)(R.Fragment,{children:(0,R.jsx)(Me.Z,{color:"orange",children:we})}),(0,R.jsxs)("div",{className:"currentAddress",children:[(0,R.jsx)("span",{className:"prefix",children:"Current Address:"}),(0,R.jsx)("span",{className:"address",children:ne})]})]})]})})}Pe.Z=je},69764:function(re,Pe,a){"use strict";var ia=a(71194),Me=a(50146),la=a(57663),F=a(71577),I=a(402),pe=a(3887),Fe=a(67294),Be=a(55133),R=a.n(Be),je=a(54549),u=a(85893),Ie=pe.Z.Title,t=function(ne){var we=ne.visable,X=ne.title,n=ne.content,ze=ne.footer,S=ne.close,Ce=ne.bodyStyle,he=ne.width;return(0,u.jsx)(Me.Z,{title:X?(0,u.jsx)(Ie,{level:5,className:R().title,children:X}):null,closable:!!S,closeIcon:(0,u.jsx)(u.Fragment,{children:(0,u.jsx)(F.Z,{shape:"circle",size:"middle",type:"ghost",icon:(0,u.jsx)(je.Z,{onClick:S})})}),className:R().modal,centered:!0,visible:we,width:he!=null?he:650,footer:ze,bodyStyle:Ce,children:n})};Pe.Z=t},38655:function(re,Pe,a){"use strict";var ia=a(58024),Me=a(39144),la=a(57663),F=a(71577),I=a(48736),pe=a(27049),Fe=a(3182),Be=a(402),R=a(3887),je=a(94043),u=a.n(je),Ie=a(67294),t=a(43581),r=a(24787),ne=a.n(r),we=a(76705),X=a.n(we),n=a(8812),ze=a(89583),S=a(85893),Ce=function(){var Ae=(0,t.tT)("web3"),oa=Ae.connect,Z=(0,t.YB)(),da=R.Z.Title;return(0,S.jsx)("div",{className:ne().mainContainer,children:(0,S.jsx)("div",{className:ne().contentContainer,children:(0,S.jsxs)(Me.Z,{className:X().loginCard,bodyStyle:{padding:32,width:"100%"},children:[(0,S.jsx)(da,{level:4,className:X().title,children:Z.formatMessage({id:"dashboard.bridge.login",defaultMessage:"Login"})}),(0,S.jsx)("div",{className:X().appList,children:(0,S.jsxs)("div",{className:X().appItem,onClick:(0,Fe.Z)(u().mark(function He(){return u().wrap(function(Ee){for(;;)switch(Ee.prev=Ee.next){case 0:return Ee.next=2,oa();case 2:case"end":return Ee.stop()}},He)})),children:[(0,S.jsx)("div",{className:X().info,children:(0,S.jsxs)("span",{className:X().name,children:[(0,S.jsx)(ze.OZg,{className:X().icon}),"Connect Wallet"]})}),(0,S.jsx)(n.Z,{className:X().rightArrow})]})}),(0,S.jsx)(pe.Z,{}),(0,S.jsxs)("div",{className:X().getWallet,children:[Z.formatMessage({id:"dashboard.bridge.dontHaveWallet",defaultMessage:"Don't have wallet?"}),(0,S.jsx)(F.Z,{type:"link",size:"middle",children:Z.formatMessage({id:"dashboard.bridge.downloadHere",defaultMessage:"Download here"})})]})]})})})};Pe.Z=Ce},16915:function(re,Pe,a){"use strict";a.r(Pe),a.d(Pe,{default:function(){return Xa}});var ia=a(20228),Me=a(11382),la=a(57663),F=a(71577),I=a(3182),pe=a(11849),Fe=a(74379),Be=a(38648),R=a(402),je=a(3887),u=a(2824),Ie=a(94043),t=a.n(Ie),r=a(67294),ne=a(24787),we=a.n(ne),X=a(18683),n=a.n(X),ze=a(7085),S=a(43581),Ce=a(17571),he=a(37976),Ae=a(30808),oa=a(1101),Z=a(48352);function da(b){return He.apply(this,arguments)}function He(){return He=(0,I.Z)(t().mark(function b(l){var g,i,d,P,c,j,v,H,V;return t().wrap(function(E){for(;;)switch(E.prev=E.next){case 0:return E.next=2,Promise.all([l.factory(),l.token0(),l.token1(),l.fee(),l.tickSpacing(),l.maxLiquidityPerTick()]);case 2:return g=E.sent,i=(0,u.Z)(g,6),d=i[0],P=i[1],c=i[2],j=i[3],v=i[4],H=i[5],V={factory:d,token0:P,token1:c,fee:j,tickSpacing:v,maxLiquidityPerTick:H},E.abrupt("return",V);case 12:case"end":return E.stop()}},b)})),He.apply(this,arguments)}function ha(b){return Ee.apply(this,arguments)}function Ee(){return Ee=(0,I.Z)(t().mark(function b(l){var g,i,d,P,c;return t().wrap(function(v){for(;;)switch(v.prev=v.next){case 0:return v.next=2,Promise.all([l.liquidity(),l.slot0()]);case 2:return g=v.sent,i=(0,u.Z)(g,2),d=i[0],P=i[1],c={liquidity:d,sqrtPriceX96:P[0],tick:P[1],observationIndex:P[2],observationCardinality:P[3],observationCardinalityNext:P[4],feeProtocol:P[5],unlocked:P[6]},v.abrupt("return",c);case 8:case"end":return v.stop()}},b)})),Ee.apply(this,arguments)}function Na(b,l,g,i,d){return ca.apply(this,arguments)}function ca(){return ca=(0,I.Z)(t().mark(function b(l,g,i,d,P){var c,j,v,H,V,M,E,ie,L;return t().wrap(function(p){for(;;)switch(p.prev=p.next){case 0:return console.log(i.address,d.address),p.next=3,l.getPool(i.address,d.address,P);case 3:return c=p.sent,console.log(c),j=new Ce.CH(c,oa.Mt,g),p.next=8,Promise.all([da(j),ha(j)]);case 8:return v=p.sent,H=(0,u.Z)(v,2),V=H[0],M=H[1],E=i,ie=d,L=new he.Kg(E,ie,V.fee,M.sqrtPriceX96.toString(),M.liquidity.toString(),M.tick),p.abrupt("return",L);case 16:case"end":return p.stop()}},b)})),ca.apply(this,arguments)}function ga(b,l){return ua.apply(this,arguments)}function ua(){return ua=(0,I.Z)(t().mark(function b(l,g){var i,d,P,c;return t().wrap(function(v){for(;;)switch(v.prev=v.next){case 0:return v.next=2,l.signer.getChainId();case 2:if(i=v.sent,!(i!=1&&i!=4)){v.next=5;break}return v.abrupt("return",null);case 5:return d=new Ae.Token(i,Z.q7.ad3[i],18),P=new Ae.Token(i,g,18),v.next=9,Na(l,l.provider,d,P,3e3);case 9:return c=v.sent,v.abrupt("return",c.token0Price);case 11:case"end":return v.stop()}},b)})),ua.apply(this,arguments)}var Va=null,Ye=a(96534),Ta=a(77616),Ma=a(39499),va=a.n(Ma),Ne=a(74919),Aa=a(3283),Sa=a.n(Aa);function ka(b,l){if(!(!b||!l))try{var g=(0,Ta.vz)(b,l.decimals).toString();if(g!=="0")return Ae.CurrencyAmount.fromRawAmount(l,va().BigInt(g))}catch(i){console.debug('Failed to parse input amount: "'.concat(b,'"'),i)}}function Ca(b,l,g,i){if(!(!b||!l||!g||!i)){var d=ka(i,l),P=ka("1",b);if(!(!d||!P)){var c=new Ae.Price(b,l,P.quotient,d.quotient),j,v=(0,Ne.encodeSqrtRatioX96)(c.numerator,c.denominator);return va().greaterThanOrEqual(v,Ne.TickMath.MAX_SQRT_RATIO)?j=Ne.TickMath.MAX_TICK:va().lessThanOrEqual(v,Ne.TickMath.MIN_SQRT_RATIO)?j=Ne.TickMath.MIN_TICK:j=(0,Ne.priceToClosestTick)(c),-(0,Ne.nearestUsableTick)(j,Ne.TICK_SPACINGS[g])}}}function ma(b){var l=new(Sa())(window.ethereum),g=l.eth.abi.encodeParameter({IncentiveKey:{rewardToken:"address",pool:"address",startTime:"uint256",endTime:"uint256"}},b),i=l.utils.soliditySha3(g);return console.log("getIncentiveId",g,i),i}var aa=a(59749),Ja=a(54029),Za=a(79166),Qa=a(22385),_a=a(31097),qa=a(12968),Ge=a(62462),en=a(49111),na=a(19650),ba=a(90894),ya=a(68628),xa=a(57254),an=a(48736),Ba=a(27049),Da=a(69764),Pa=a(2877),sa=a(39605),nn=a(47673),ja=a(32787),sn=a(66126),Oa=a(75454),Ra=a(28485),q=a.n(Ra),Ia=a(1058),wa=a(49101),e=a(85893),La=function(l){var g=l.pair,i=l.setVisiable,d=l.currentPrice,P=(0,S.tT)("web3"),c=P.ChainId,j=(0,S.YB)(),v=r.useState(0),H=(0,u.Z)(v,2),V=H[0],M=H[1],E=je.Z.Title;(0,r.useEffect)(function(){if(d)for(var L=0;L<g.incentives.length;L++){var ee=(0,aa.HM)(g.incentives[L].minPrice,18),p=(0,aa.HM)(g.incentives[L].maxPrice,18);ee<=d&&d<=p&&M(L)}},[d]);var ie={0:"100%",1:"150%",2:"200%"};return(0,e.jsx)(e.Fragment,{children:(0,e.jsxs)("div",{className:q().modalContainer,children:[(0,e.jsx)(E,{level:5,className:q().title,children:"Select APY"}),(0,e.jsx)(Oa.Z,{min:0,max:2,marks:ie,step:null,defaultValue:V,className:q().slider,onChange:function(ee){M(ee)}}),(0,e.jsxs)("div",{className:q().rangeBlocks,children:[(0,e.jsx)("div",{className:q().block,children:(0,e.jsxs)("div",{className:q().blockBody,children:[(0,e.jsx)("span",{className:q().title,children:j.formatMessage({id:"dashboard.stake.minPrice",defaultMessage:"Min Price"})}),(0,e.jsxs)("div",{className:q().control,children:[(0,e.jsx)(F.Z,{disabled:!0,size:"middle",shape:"circle",type:"default",icon:(0,e.jsx)(Ia.Z,{})}),(0,e.jsx)(ja.Z,{disabled:!0,placeholder:"0.0",className:q().input,bordered:!1,value:g.incentives[V].minPrice}),(0,e.jsx)(F.Z,{disabled:!0,size:"middle",shape:"circle",type:"default",icon:(0,e.jsx)(wa.Z,{})})]}),(0,e.jsx)("span",{className:q().rate,children:j.formatMessage({id:"dashboard.stake.rateDesc",defaultMessage:"{from} per {to}"},{from:"AD3",to:"ETH"})})]})}),(0,e.jsx)("div",{className:q().block,children:(0,e.jsxs)("div",{className:q().blockBody,children:[(0,e.jsx)("span",{className:q().title,children:j.formatMessage({id:"dashboard.stake.maxPrice",defaultMessage:"Max Price"})}),(0,e.jsxs)("div",{className:q().control,children:[(0,e.jsx)(F.Z,{disabled:!0,size:"middle",shape:"circle",type:"default",icon:(0,e.jsx)(Ia.Z,{})}),(0,e.jsx)(ja.Z,{disabled:!0,placeholder:"0.0",className:q().input,bordered:!1,value:g.incentives[V].maxPrice}),(0,e.jsx)(F.Z,{disabled:!0,size:"middle",shape:"circle",type:"default",icon:(0,e.jsx)(wa.Z,{})})]}),(0,e.jsx)("span",{className:q().rate,children:j.formatMessage({id:"dashboard.stake.rateDesc",defaultMessage:"{from} per {to}"},{from:"AD3",to:"ETH"})})]})})]}),(0,e.jsx)("div",{className:q().fullrange,children:(0,e.jsx)(F.Z,{block:!0,disabled:!0,size:"middle",shape:"round",children:j.formatMessage({id:"dashboard.stake.fullRange",defaultMessage:"Full Range"})})}),(0,e.jsx)("div",{className:q().gotoUniswap,children:(0,e.jsx)(F.Z,{block:!0,size:"large",shape:"round",type:"primary",icon:(0,e.jsx)(Ge.Z,{src:"/images/crypto/uniswap-icon.svg",height:"100%",preview:!1,style:{marginRight:20}}),onClick:function(){i(!1),window.open("https://app.uniswap.org/#/add/".concat(g.coin==="ETH"?"ETH":g.coinAddress,"/").concat(Z.q7.ad3[c!=null?c:1],"/3000"))},children:j.formatMessage({id:"dashboard.stake.gotoUniswap",defaultMessage:"Goto Uniswap"})})})]})})},Ua=La,Wa=function(l){var g=l.collapse,i=l.stakedLPs,d=l.unstakedLPs,P=l.rewards,c=l.pair,j=l.poolAddress,v=l.apys,H=(0,S.tT)("apiWs"),V=(0,S.tT)("contracts"),M=V.StakeContract,E=V.FactoryContract,ie=(0,S.tT)("web3"),L=ie.Account,ee=ie.ChainId,p=(0,r.useState)(!1),De=(0,u.Z)(p,2),Se=De[0],Te=De[1],Ve=(0,r.useState)([]),Oe=(0,u.Z)(Ve,2),le=Oe[0],_e=Oe[1],Re=(0,r.useState)([]),Le=(0,u.Z)(Re,2),oe=Le[0],fe=Le[1],Je=(0,r.useState)([]),Ue=(0,u.Z)(Je,2),de=Ue[0],J=Ue[1],Qe=(0,r.useState)(BigInt(0)),We=(0,u.Z)(Qe,2),Ze=We[0],se=We[1],Ke=(0,r.useCallback)(function(){var f=(0,I.Z)(t().mark(function x(k,h){var C,ge;return t().wrap(function(_){for(;;)switch(_.prev=_.next){case 0:return le[k]=!0,_e(le),console.log("handle Stake ".concat(k)),C={rewardToken:Z.q7.ad3[ee!=null?ee:1],pool:j,startTime:c.incentives[h].startTime,endTime:c.incentives[h].endTime},_.prev=4,_.next=7,M==null?void 0:M.depositToken(C,k);case 7:return ge=_.sent,_.next=10,ge.wait();case 10:le[k]=!1,_e(le),_.next=19;break;case 14:_.prev=14,_.t0=_.catch(4),console.error(_.t0),le[k]=!1,_e(le);case 19:case"end":return _.stop()}},x,null,[[4,14]])}));return function(x,k){return f.apply(this,arguments)}}(),[M,ee,c.incentives,le,j]),qe=(0,r.useCallback)(function(){var f=(0,I.Z)(t().mark(function x(k,h){var C;return t().wrap(function(z){for(;;)switch(z.prev=z.next){case 0:return console.log("handleunstake",k,h),oe[k]=!0,fe(oe),C={rewardToken:Z.q7.ad3[ee],pool:j,startTime:c.incentives[h].startTime,endTime:c.incentives[h].endTime},z.prev=4,z.next=7,M==null?void 0:M.unstakeToken(C,k,L);case 7:oe[k]=!1,fe(oe),z.next=16;break;case 11:z.prev=11,z.t0=z.catch(4),console.error(z.t0),oe[k]=!1,fe(oe);case 16:case"end":return z.stop()}},x,null,[[4,11]])}));return function(x,k){return f.apply(this,arguments)}}(),[M,L,ee,c.incentives,oe,j]),be=(0,r.useCallback)(function(){var f=(0,I.Z)(t().mark(function x(k,h,C){var ge;return t().wrap(function(_){for(;;)switch(_.prev=_.next){case 0:return de[k]=!0,J(de),console.log("handleclaim",k,h,C),ge={rewardToken:Z.q7.ad3[ee],pool:j,startTime:c.incentives[C].startTime,endTime:c.incentives[C].endTime},_.prev=4,_.next=7,M==null?void 0:M.claimReward(ge,k,L,h);case 7:de[k]=!1,J(de),_.next=16;break;case 11:_.prev=11,_.t0=_.catch(4),console.error(_.t0),de[k]=!1,J(de);case 16:case"end":return _.stop()}},x,null,[[4,11]])}));return function(x,k,h){return f.apply(this,arguments)}}(),[M,L,c.incentives,de,j,ee]),te=(0,r.useCallback)((0,I.Z)(t().mark(function f(){var x;return t().wrap(function(h){for(;;)switch(h.prev=h.next){case 0:if(E){h.next=2;break}return h.abrupt("return");case 2:return h.next=4,ga(E,c.coinAddress);case 4:x=h.sent,console.log("getAd3CoinPrice/",c.coin,x==null?void 0:x.toSignificant()),se(BigInt((0,aa.HM)((x==null?void 0:x.toSignificant())||"0",18)));case 7:case"end":return h.stop()}},f)})),[E]);return(0,r.useEffect)(function(){H&&te()},[E,H]),(0,e.jsxs)(e.Fragment,{children:[(0,e.jsxs)("div",{className:n().rowsContainer,style:{maxHeight:g?"100vh":0},children:[(0,e.jsx)(Ba.Z,{}),(0,e.jsxs)("div",{className:n().rowsContentContainer,children:[(0,e.jsxs)("div",{className:n().actionButtons,children:[(0,e.jsx)(F.Z,{block:!0,shape:"round",size:"middle",type:"primary",className:n().actionButton,onClick:function(){Te(!0)},children:"Get UniswapV3 NFT"}),(0,e.jsx)(F.Z,{block:!0,shape:"round",size:"middle",type:"primary",className:n().actionButton,onClick:function(){window.open("https://rinkeby.etherscan.io/address/"+(M==null?void 0:M.address))},children:"View Contract"}),(0,e.jsx)("span",{className:n().actionButtonDesc,children:"Click the Get button to acquire more NFTs"})]}),(0,e.jsxs)("div",{className:n().nftList,children:[i.filter(function(f){return f!=null}).map(function(f){var x;return(0,e.jsxs)("div",{className:n().nftItem,children:[(0,e.jsxs)("div",{className:n().nftItemBlock,children:[(0,e.jsx)("div",{className:n().title,children:"NFTId"}),(0,e.jsx)("div",{className:n().value,children:(0,e.jsxs)(na.Z,{children:[(0,e.jsx)(Pa.Z,{})," ",f.tokenId]})})]}),(0,e.jsxs)("div",{className:n().nftItemBlock,children:[(0,e.jsx)("div",{className:n().title,children:"Liquidity"}),(0,e.jsx)("div",{className:n().value,children:(0,sa.a)(f.liquidity,{withUnit:!1},18)})]}),(0,e.jsxs)("div",{className:n().nftItemBlock,children:[(0,e.jsx)("div",{className:n().title,children:"Reward Range"}),(0,e.jsxs)("div",{className:n().value,children:[c.incentives[f.incentiveIndex].minPrice,"-",c.incentives[f.incentiveIndex].maxPrice]})]}),(0,e.jsxs)("div",{className:n().nftItemBlock,children:[(0,e.jsx)("div",{className:n().title,children:"My APR"}),(0,e.jsx)("div",{className:n().value,children:v[f.incentiveIndex]})]}),(0,e.jsxs)("div",{className:n().nftReward,children:[(0,e.jsxs)("div",{className:n().nftItemBlock,children:[(0,e.jsx)("div",{className:n().title,children:"Reward(AD3)"}),(0,e.jsxs)("div",{className:n().value,children:[(0,e.jsx)(Ge.Z,{src:"/images/logo-round-core.svg",preview:!1,className:n().icon}),(0,sa.a)((x=P.filter(function(k){return k.tokenId===f.tokenId})[0])===null||x===void 0?void 0:x.reward,{withUnit:!1},18)]})]}),(0,e.jsx)(F.Z,{size:"middle",shape:"round",type:"primary",onClick:function(){var h;return be(f.tokenId,(h=P.filter(function(C){return C.tokenId===f.tokenId})[0])===null||h===void 0?void 0:h.reward,f.incentiveIndex)},children:"Harvest"})]}),(0,e.jsx)("div",{className:n().nftItemBlock,children:(0,e.jsx)(F.Z,{danger:!0,size:"middle",shape:"round",type:"primary",className:n().stakeButton,onClick:function(){return qe(f.tokenId,f.incentiveIndex)},children:"Unstake"})})]})}),d.filter(function(f){return f!=null}).map(function(f){return(0,e.jsxs)("div",{className:n().nftItem,children:[(0,e.jsxs)("div",{className:n().nftItemBlock,children:[(0,e.jsx)("div",{className:n().title,children:"NFTId"}),(0,e.jsx)("div",{className:n().value,children:(0,e.jsxs)(na.Z,{children:[(0,e.jsx)(Pa.Z,{})," ",f.tokenId]})})]}),(0,e.jsxs)("div",{className:n().nftItemBlock,children:[(0,e.jsx)("div",{className:n().title,children:"Liquidity"}),(0,e.jsx)("div",{className:n().value,children:(0,sa.a)(f.liquidity,{withUnit:!1},18)})]}),(0,e.jsxs)("div",{className:n().nftItemBlock,children:[(0,e.jsx)("div",{className:n().title,children:"Reward Range"}),(0,e.jsxs)("div",{className:n().value,children:[c.incentives[f.incentiveIndex].minPrice,"-",c.incentives[f.incentiveIndex].maxPrice]})]}),(0,e.jsxs)("div",{className:n().nftItemBlock,children:[(0,e.jsx)("div",{className:n().title,children:"My APR"}),(0,e.jsx)("div",{className:n().value,children:"0%"})]}),(0,e.jsxs)("div",{className:n().nftReward,children:[(0,e.jsxs)("div",{className:n().nftItemBlock,children:[(0,e.jsx)("div",{className:n().title,children:"Reward(AD3)"}),(0,e.jsxs)("div",{className:n().value,children:[(0,e.jsx)(Ge.Z,{src:"/images/logo-round-core.svg",preview:!1,className:n().icon}),"0"]})]}),(0,e.jsx)(F.Z,{size:"middle",shape:"round",type:"primary",disabled:!0,children:"Harvest"})]}),(0,e.jsx)("div",{className:n().nftItemBlock,children:(0,e.jsx)(F.Z,{danger:!0,size:"middle",shape:"round",type:"primary",className:n().stakeButton,onClick:function(){return Ke(f.tokenId,f.incentiveIndex)},children:"Stake"})})]})})]})]})]}),(0,e.jsx)(Da.Z,{visable:Se,title:"Add Liquidity",content:(0,e.jsx)(Ua,{setVisiable:Te,pair:c,currentPrice:Ze}),footer:!1,close:function(){return Te(!1)}})]})},Ka=Wa,ta=a(75163),Xe=a(97947),$a="/images/logo-round-core.svg",Fa=function(l){var g=l.logo,i=l.pair,d=l.positions,P=l.poolAddress,c=l.apy,j=l.liquidity,v=(0,S.tT)("apiWs"),H=(0,S.tT)("web3"),V=H.Account,M=H.Provider,E=H.ChainId,ie=H.BlockNumber,L=H.Signer,ee=(0,S.tT)("contracts"),p=ee.StakeContract,De=(0,r.useState)(!1),Se=(0,u.Z)(De,2),Te=Se[0],Ve=Se[1],Oe=(0,r.useState)([]),le=(0,u.Z)(Oe,2),_e=le[0],Re=le[1],Le=(0,r.useState)([]),oe=(0,u.Z)(Le,2),fe=oe[0],Je=oe[1],Ue=(0,r.useState)([]),de=(0,u.Z)(Ue,2),J=de[0],Qe=de[1],We=(0,r.useState)([]),Ze=(0,u.Z)(We,2),se=Ze[0],Ke=Ze[1],qe=(0,r.useState)([]),be=(0,u.Z)(qe,2),te=be[0],f=be[1],x=(0,r.useState)(void 0),k=(0,u.Z)(x,2),h=k[0],C=k[1],ge=(0,r.useState)(void 0),z=(0,u.Z)(ge,2),_=z[0],ea=z[1],Y=function(){var Q=(0,I.Z)(t().mark(function N(U){var y,W,m,o;return t().wrap(function(s){for(;;)switch(s.prev=s.next){case 0:if(!(!(0,Xe.Y)(E)||!L)){s.next=2;break}return s.abrupt("return",void 0);case 2:return y=new Ce.CH(U,ta,L),s.next=5,y.name();case 5:return W=s.sent,s.next=8,y.symbol();case 8:return m=s.sent,s.next=11,y.decimals();case 11:return o=s.sent,s.abrupt("return",new Ae.Token(E,U,o,m,W));case 13:case"end":return s.stop()}},N)}));return function(U){return Q.apply(this,arguments)}}(),xe=function(){var Q=(0,I.Z)(t().mark(function N(){var U,y;return t().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return m.next=2,Y(Z.q7.ad3[E!=null?E:1]);case 2:return U=m.sent,m.next=5,Y(i.coinAddress);case 5:y=m.sent,console.log(U,y),C(U),ea(y);case 9:case"end":return m.stop()}},N)}));return function(){return Q.apply(this,arguments)}}();(0,r.useEffect)(function(){console.log(L),!!L&&v&&(console.log("test"),xe())},[E,M,L]),(0,r.useEffect)(function(){if(h&&_){for(var Q=[],N=0;N<i.incentives.length;N++){var U=Ca(h,_,he.lk.MEDIUM,i.incentives[N].maxPrice)||0,y=Ca(h,_,he.lk.MEDIUM,i.incentives[N].minPrice)||0;Q.push({tickLower:U,tickUpper:y})}console.log("tmpTicks",Q),f(Q)}},[h,_]),(0,r.useEffect)(function(){if(P==="0x0000000000000000000000000000000000000000"||P===""){Ke([]);return}if(i!==void 0){for(var Q=[],N=0;N<i.incentives.length;N++)Q.push({rewardToken:Z.q7.ad3[E],pool:P,startTime:i.incentives[N].startTime,endTime:i.incentives[N].endTime});Ke(Q)}},[P,E,i]);var B=(0,r.useCallback)((0,I.Z)(t().mark(function Q(){var N,U,y,W;return t().wrap(function(o){for(;;)switch(o.prev=o.next){case 0:if(!(d.length===0||te.length===0)){o.next=2;break}return o.abrupt("return");case 2:for(N=[i.coinAddress.toLowerCase(),Z.q7.ad3[E].toLowerCase()],U=[],y=0;y<d.length;y++)if(d[y].fee===he.lk.MEDIUM&&d[y].liquidity.toString()!=="0"&&N.includes(d[y].token0.toLowerCase())&&N.includes(d[y].token1.toLowerCase()))for(W=0;W<se.length;W++)te[W].tickLower<=d[y].tickLower&&d[y].tickUpper<=te[W].tickUpper&&(console.log("liquidity",d[y].liquidity),U.push({tokenId:d[y].tokenId.toNumber(),staked:!1,tickLower:d[y].tickLower,tickUpper:d[y].tickUpper,incentiveIndex:W,liquidity:d[y].liquidity.toBigInt()}));Re(U);case 6:case"end":return o.stop()}},Q)})),[d,E,te]),fa=(0,r.useCallback)((0,I.Z)(t().mark(function Q(){var N,U,y,W,m,o,D;return t().wrap(function(T){for(;;)switch(T.prev=T.next){case 0:if(p){T.next=3;break}return console.log("stakeContract is null"),T.abrupt("return");case 3:if(se.length!==0){T.next=6;break}return console.log("incentiveKeys is null"),T.abrupt("return");case 6:if(te.length!==0){T.next=8;break}return T.abrupt("return");case 8:return T.next=10,p==null?void 0:p.getUserTokenIdCount(V);case 10:for(N=T.sent,console.log("tokenCountFromStakeManager",N),U=[],y=0;y<N;y++)U.push(y);return W=U.map(function(){var w=(0,I.Z)(t().mark(function $(G){return t().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return A.next=2,p["getTokenId(address,uint256)"](V,G);case 2:return A.abrupt("return",A.sent);case 3:case"end":return A.stop()}},$)}));return function($){return w.apply(this,arguments)}}()),T.next=17,Promise.all(W);case 17:return m=T.sent,o=m.map(function(){var w=(0,I.Z)(t().mark(function $(G){var ae,A,O;return t().wrap(function(K){for(;;)switch(K.prev=K.next){case 0:return K.next=2,p==null?void 0:p.deposits(G);case 2:ae=K.sent,console.log("deposit",ae),A=0;case 5:if(!(A<se.length)){K.next=16;break}if(!(te[A].tickLower<=ae.tickLower&&ae.tickUpper<=te[A].tickUpper)){K.next=13;break}return console.log(ma(se[A]),G),K.next=10,p==null?void 0:p.stakes(ma(se[A]),G);case 10:return O=K.sent,console.log("stake",O),K.abrupt("return",{tokenId:G.toNumber(),staked:!0,tickLower:ae.tickLower,tickUpper:ae.tickUpper,incentiveIndex:A,liquidity:O.liquidity.toBigInt()});case 13:A++,K.next=5;break;case 16:return K.abrupt("return",void 0);case 17:case"end":return K.stop()}},$)}));return function($){return w.apply(this,arguments)}}()),T.next=21,Promise.all(o);case 21:if(D=T.sent.filter(function(w){return w!==void 0}),!(0,Ye.m2)(D,fe)){T.next=24;break}return T.abrupt("return");case 24:Je(D);case 25:case"end":return T.stop()}},Q)})),[se,p,te,V,ie]),ra=(0,r.useCallback)((0,I.Z)(t().mark(function Q(){var N,U;return t().wrap(function(W){for(;;)switch(W.prev=W.next){case 0:return N=fe.map(function(){var m=(0,I.Z)(t().mark(function o(D){var s,T;return t().wrap(function($){for(;;)switch($.prev=$.next){case 0:return $.next=2,p==null?void 0:p.getAccruedRewardInfo(se[D.incentiveIndex],D.tokenId);case 2:return s=$.sent,T=s.reward.toBigInt(),$.abrupt("return",{tokenId:D.tokenId,reward:T});case 5:case"end":return $.stop()}},o)}));return function(o){return m.apply(this,arguments)}}()),W.next=3,Promise.all(N);case 3:if(U=W.sent,!(0,Ye.m2)(U,J)){W.next=6;break}return W.abrupt("return");case 6:Qe(U);case 7:case"end":return W.stop()}},Q)})),[fe,p,se]);return(0,r.useEffect)(function(){!p||fe.length!==0&&v&&ra()},[ie,p,fe,v]),(0,r.useEffect)(function(){v&&(d.length>0?B():Re([]))},[d,te,v]),(0,r.useEffect)(function(){v&&fa()},[p,te,se,ie,v]),(0,e.jsx)(Za.Z.Ribbon,{text:(0,e.jsx)(e.Fragment,{children:(0,e.jsxs)(na.Z,{children:[(0,e.jsx)(ba.Z,{}),"Double reward"]})}),children:(0,e.jsxs)("div",{className:n().stakeItem,children:[(0,e.jsxs)("div",{className:n().stakeMain,children:[(0,e.jsxs)("div",{className:n().tokenPair,children:[(0,e.jsxs)("div",{className:n().tokenIcons,children:[(0,e.jsx)(Ge.Z,{src:$a,preview:!1,className:n().icon}),(0,e.jsx)(Ge.Z,{src:g,preview:!1,className:n().icon})]}),(0,e.jsxs)("div",{className:n().tokenNameAndRate,children:[(0,e.jsx)("div",{className:n().tokenName,children:i.name}),(0,e.jsx)("div",{className:n().tokenRate,children:(0,e.jsxs)(na.Z,{children:["Fee Tier",(0,e.jsx)("strong",{children:"0.3%"})]})})]})]}),(0,e.jsxs)("div",{className:n().tokenAPY,children:[(0,e.jsx)("div",{className:n().title,children:"APY(1y)"}),(0,e.jsxs)("div",{className:n().value,children:[c[0],(0,e.jsx)(_a.Z,{placement:"bottom",title:"The APR value is calculated based on the current data, which changes as the user deposition changes.",children:(0,e.jsx)(ya.Z,{className:n().tipButton})})]})]}),(0,e.jsxs)("div",{className:n().tokenLiquidity,children:[(0,e.jsxs)("div",{className:n().title,children:["Total Liquidity(",i.coin,")"]}),(0,e.jsxs)("div",{className:n().value,children:[(0,sa.a)(j,{withUnit:i.coin},18),(0,e.jsx)(_a.Z,{placement:"bottom",title:"The liquidity value is an estimation that only calculates the liquidity lies in the reward range.",children:(0,e.jsx)(ya.Z,{className:n().tipButton})})]})]}),(0,e.jsxs)("div",{className:n().tokenRewardRange,children:[(0,e.jsx)("div",{className:n().title,children:"Reward Range"}),(0,e.jsxs)("div",{className:n().value,children:[i.incentives[0].minPrice,"-",i.incentives[2].maxPrice+" "+i.coin+"/AD3"]})]}),(0,e.jsx)("div",{className:n().expandButton,children:(0,e.jsx)(F.Z,{type:"link",icon:(0,e.jsx)(xa.Z,{rotate:Te?-180:0,className:n().expandButtonIcon}),onClick:function(){Ve(function(N){return!N})}})})]}),(0,e.jsx)(Ka,{collapse:Te,stakedLPs:fe,unstakedLPs:_e,rewards:J,pair:i,poolAddress:P,apys:c})]})})},za=Fa,Ha=a(38655),Ya=a(97409),Ga=function(){var l=(0,r.useState)(!1),g=(0,u.Z)(l,2),i=g[0],d=g[1],P=(0,r.useState)([]),c=(0,u.Z)(P,2),j=c[0],v=c[1],H=(0,r.useState)(!0),V=(0,u.Z)(H,2),M=V[0],E=V[1],ie=(0,r.useState)(!1),L=(0,u.Z)(ie,2),ee=L[0],p=L[1],De=(0,r.useState)([]),Se=(0,u.Z)(De,2),Te=Se[0],Ve=Se[1],Oe=(0,r.useState)([]),le=(0,u.Z)(Oe,2),_e=le[0],Re=le[1],Le=(0,r.useState)("0"),oe=(0,u.Z)(Le,2),fe=oe[0],Je=oe[1],Ue=(0,r.useState)([]),de=(0,u.Z)(Ue,2),J=de[0],Qe=de[1],We=(0,r.useState)([]),Ze=(0,u.Z)(We,2),se=Ze[0],Ke=Ze[1],qe=(0,r.useState)(!1),be=(0,u.Z)(qe,2),te=be[0],f=be[1],x=je.Z.Title,k=(0,S.tT)("web3"),h=k.Account,C=k.ChainId,ge=k.BlockNumber,z=k.Signer,_=(0,S.tT)("contracts"),ea=_.Ad3Contract,Y=_.StakeContract,xe=_.FactoryContract,B=_.LPContract;(0,r.useEffect)(function(){if(!(0,Xe.Y)(C)){Be.default.error({message:"Unsupported Chain",description:"This feature is only supported on mainnet and rinkeby",duration:null}),f(!1);return}h&&h!==""&&f(!0)},[C,h]),(0,r.useEffect)(function(){if(!!(0,Xe.Y)(C)){for(var m=[],o=0;o<Z.Dr.length;o++)m.push((0,pe.Z)((0,pe.Z)({},Z.Dr[o]),{},{coinAddress:Z.Dr[o].coinAddresses[C]}));Ve(m)}},[C]),(0,r.useEffect)(function(){ea&&ea.totalSupply().then(function(m){console.log(m.toString())})},[ea]);var fa=function(){var m=(0,I.Z)(t().mark(function o(){var D,s,T,w,$,G;return t().wrap(function(A){for(;;)switch(A.prev=A.next){case 0:if((0,Xe.Y)(C)){A.next=2;break}return A.abrupt("return");case 2:if(!(z&&J.length>0)){A.next=12;break}return D=new Ce.CH(Z.q7.weth[C],ta,z),s=new Ce.CH(Z.q7.usdt[C],ta,z),T=new Ce.CH(Z.q7.usdc[C],ta,z),w=[D,s,T],$=w.map(function(){var O=(0,I.Z)(t().mark(function ce(K,ye){return t().wrap(function(ve){for(;;)switch(ve.prev=ve.next){case 0:return ve.next=2,K.balanceOf(J[ye]);case 2:return ve.abrupt("return",ve.sent);case 3:case"end":return ve.stop()}},ce)}));return function(ce,K){return O.apply(this,arguments)}}()),A.next=10,Promise.all($);case 10:G=A.sent,(0,Ye.m2)(G,_e)||(Re(G),console.log("balances",G));case 12:case"end":return A.stop()}},o)}));return function(){return m.apply(this,arguments)}}();(0,r.useEffect)(function(){fa()},[C,z,J]);var ra=(0,r.useCallback)((0,I.Z)(t().mark(function m(){var o,D,s;return t().wrap(function(w){for(;;)switch(w.prev=w.next){case 0:if(!(xe&&C!==void 0)){w.next=12;break}if((0,Xe.Y)(C)){w.next=3;break}return w.abrupt("return");case 3:return o=Z.Dr.map(function(){var $=(0,I.Z)(t().mark(function G(ae){return t().wrap(function(O){for(;;)switch(O.prev=O.next){case 0:return O.next=2,xe.getPool(ae.coinAddresses[C],Z.q7.ad3[C],he.lk.MEDIUM);case 2:return O.abrupt("return",O.sent);case 3:case"end":return O.stop()}},G)}));return function(G){return $.apply(this,arguments)}}()),w.next=6,Promise.all(o);case 6:return D=w.sent,(0,Ye.m2)(D,J)||Qe(D),w.next=10,ga(xe,Z.Dr[1].coinAddresses[C]);case 10:s=w.sent,s&&Je(s.toSignificant());case 12:case"end":return w.stop()}},m)})),[xe,J,C]);(0,r.useEffect)(function(){d(!0),ra(),d(!1)},[xe,C,J,ra]);var Q=function(){var m=(0,I.Z)(t().mark(function o(){var D,s,T,w,$,G,ae;return t().wrap(function(O){for(;;)switch(O.prev=O.next){case 0:return O.next=2,B==null?void 0:B.balanceOf(h);case 2:if(D=O.sent,D){O.next=5;break}return O.abrupt("return");case 5:for(s=[],T=0;T<D.toNumber();T++)s.push(T);return w=s.map(function(){var ce=(0,I.Z)(t().mark(function K(ye){var ue;return t().wrap(function(me){for(;;)switch(me.prev=me.next){case 0:return me.next=2,B==null?void 0:B.tokenOfOwnerByIndex(h,ye);case 2:if(ue=me.sent,parseInt(ue)!=NaN){me.next=5;break}return me.abrupt("return",-1);case 5:return me.abrupt("return",ue);case 6:case"end":return me.stop()}},K)}));return function(K){return ce.apply(this,arguments)}}()),O.next=10,Promise.all(w);case 10:return $=O.sent,G=$.map(function(){var ce=(0,I.Z)(t().mark(function K(ye){var ue,ve;return t().wrap(function(ke){for(;;)switch(ke.prev=ke.next){case 0:return ke.next=2,B==null?void 0:B.positions(ye);case 2:return ue=ke.sent,ve=(0,pe.Z)((0,pe.Z)({},ue),{},{tokenId:ye}),ke.abrupt("return",ve);case 5:case"end":return ke.stop()}},K)}));return function(K){return ce.apply(this,arguments)}}()),O.next=14,Promise.all(G);case 14:ae=O.sent,(0,Ye.m2)(ae,j)||v(ae);case 16:case"end":return O.stop()}},o)}));return function(){return m.apply(this,arguments)}}();(0,r.useEffect)(function(){B&&Q()},[B,ge]);var N=(0,r.useCallback)((0,I.Z)(t().mark(function m(){var o,D,s;return t().wrap(function(w){for(;;)switch(w.prev=w.next){case 0:if(!(Z.Dr.length>0&&J.length>0)){w.next=11;break}o=[],D=t().mark(function $(G){var ae,A;return t().wrap(function(ce){for(;;)switch(ce.prev=ce.next){case 0:return ae=Z.Dr[G].incentives.map(function(){var K=(0,I.Z)(t().mark(function ye(ue){var ve,me,ke,Ea,pa;return t().wrap(function($e){for(;;)switch($e.prev=$e.next){case 0:return ve={rewardToken:Z.q7.ad3[C],pool:J[G],startTime:ue.startTime,endTime:ue.endTime},me=ma(ve),$e.next=4,Y==null?void 0:Y.incentives(me);case 4:return ke=$e.sent,console.log("incentive",ke,me),Ea=(Date.now()/1e3|0)-ue.startTime,pa=(ue.totalReward-Number((0,aa.mI)(ke.totalRewardUnclaimed,18)))/Ea*365*24*60*60/ue.totalReward*100,$e.abrupt("return","".concat(pa>0?pa.toFixed(2):"0.00","%"));case 9:case"end":return $e.stop()}},ye)}));return function(ye){return K.apply(this,arguments)}}()),ce.next=3,Promise.all(ae);case 3:A=ce.sent,o.push(A);case 5:case"end":return ce.stop()}},$)}),s=0;case 4:if(!(s<Z.Dr.length)){w.next=9;break}return w.delegateYield(D(s),"t0",6);case 6:s++,w.next=4;break;case 9:console.log("newApys",o),Ke(o);case 11:case"end":return w.stop()}},m)})),[Y,J,C]);(0,r.useEffect)(function(){!Y||J.length===0||N()},[Y,J]);var U=(0,r.useCallback)((0,I.Z)(t().mark(function m(){var o;return t().wrap(function(s){for(;;)switch(s.prev=s.next){case 0:if(!(!B||!Y)){s.next=2;break}return s.abrupt("return");case 2:return s.prev=2,console.log("LPContract",B),s.next=6,B==null?void 0:B.setApprovalForAll(Y==null?void 0:Y.address,!0);case 6:return o=s.sent,console.log(o),s.next=10,o.wait();case 10:return s.abrupt("return",!0);case 13:return s.prev=13,s.t0=s.catch(2),console.error(s.t0),s.abrupt("return",!1);case 17:case"end":return s.stop()}},m,null,[[2,13]])})),[B,Y]),y=(0,r.useCallback)((0,I.Z)(t().mark(function m(){var o;return t().wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return s.prev=0,p(!0),s.next=4,U();case 4:o=s.sent,o&&(E(!0),p(!1)),s.next=12;break;case 8:s.prev=8,s.t0=s.catch(0),console.log(s.t0),p(!1);case 12:case"end":return s.stop()}},m,null,[[0,8]])})),[U]),W=(0,r.useCallback)((0,I.Z)(t().mark(function m(){var o;return t().wrap(function(s){for(;;)switch(s.prev=s.next){case 0:if(!(!B||!Y)){s.next=2;break}return s.abrupt("return");case 2:return d(!0),s.next=5,B==null?void 0:B.isApprovedForAll(h,Y==null?void 0:Y.address);case 5:o=s.sent,console.log("allowance",o),E(o),d(!1);case 9:case"end":return s.stop()}},m)})),[B,Y,h]);return(0,r.useEffect)(function(){W()},[B,h,Y]),(0,e.jsx)(e.Fragment,{children:te?(0,e.jsx)(Me.Z,{indicator:(0,e.jsx)(ze.Z,{style:{fontSize:60},spin:!0}),spinning:i,children:(0,e.jsx)("div",{className:we().mainBgContainer,children:(0,e.jsx)("div",{className:we().contentContainer,children:(0,e.jsxs)("div",{className:n().stakeContainer,children:[(0,e.jsx)(Ya.Z,{theme:"dashboard"}),(0,e.jsxs)("div",{className:n().headerContainer,children:[(0,e.jsxs)("div",{className:n().titleContainer,children:[(0,e.jsx)(x,{level:2,children:"Liquidity Mining"}),(0,e.jsx)("span",{className:n().description,children:"Stake your AD3 to earn rewards"})]}),(0,e.jsxs)("div",{className:n().buttonContainer,children:[(0,e.jsx)(F.Z,{block:!0,shape:"round",type:"primary",size:"middle",className:n().button,onClick:function(){window.open()},children:"Exchange AD3"}),(0,e.jsx)(F.Z,{block:!0,shape:"round",type:"primary",size:"middle",disabled:M||ee,className:n().button,onClick:function(){y()},children:ee?"pending":M?"LP Operation Approved":"LP Operation Approve"})]})]}),(0,e.jsx)("div",{className:n().stakeContainer,children:se.length>0&&_e.length>0&&Te.map(function(m,o){return(0,e.jsx)(za,{logo:"/images/crypto/"+m.coin.toLowerCase()+"-circle.svg",apy:se[o],liquidity:_e[o].toBigInt(),pair:m,positions:j,poolAddress:J[o]})})})]})})})}):(0,e.jsx)(Ha.Z,{})})},Xa=Ga},89519:function(){},67647:function(){},55896:function(){},57463:function(){},23424:function(){},87500:function(){}}]);