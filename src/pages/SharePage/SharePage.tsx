import React from 'react';
import MetaTags from 'react-meta-tags';

export interface SharePageProps { }

function SharePage({ }: SharePageProps) {
    return <>
        <MetaTags>
            <title>Checkout this Ad</title>
            <meta name="description" content={'View Ad, Get Paid.'} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://app.parami.io/" />
            <meta property="og:site_name" content="Parami Ad"></meta>
            <meta property="og:title" content={'Checkout this ad and claim your tokens'} />
            <meta property="og:image" content={'https://pbs.twimg.com/profile_banners/1351514784273891329/1640271011/600x200'} />
        </MetaTags>
    </>;
};

export default SharePage;
