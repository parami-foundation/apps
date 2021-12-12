// Copyright 2017-2019 @polkadot/ui-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// we use this to give an ordering to the chains available

const ORDER_CHAINS = [
    'parami',
    'kusama',
    'edgeware',
    'alexander',
    'edgewareTest',
    'flamingFir',
];

// some suplementary info on a per-chain basis
const ORDER_PROVIDERS = ['parami', 'parity', 'w3f', 'unfrastructure', 'commonwealth'];

// the actual providers with all  the nodes they provide
const CHAIN_INFO = {
    parami: {
        chainDisplay: 'Parami AD3',
        logo: 'parami',
        type: 'Parami Testnet',
    },
    alexander: {
        chainDisplay: 'Alexander',
        logo: 'alexander',
        type: 'Polkadot Testnet',
    },
    edgeware: {
        chainDisplay: 'Edgeware',
        logo: 'edgeware',
        type: 'Edgeware Mainnet',
    },
    edgewareTest: {
        chainDisplay: 'Edgeware Testnet',
        logo: 'edgeware',
        type: 'Edgeware Testnet',
    },
    flamingFir: {
        chainDisplay: 'Flaming Fir',
        logo: 'substrate',
        type: 'Substrate Testnet',
    },
    kusama: {
        chainDisplay: 'Kusama CC3',
        logo: 'kusama',
        type: 'Polkadot Canary',
    },
};

const PROVIDERS = {
    commonwealth: {
        providerDisplay: 'Commonwealth Labs',
        nodes: {
            edgeware: 'wss://mainnet1.edgewa.re',
            edgewareTest: 'wss://testnet2.edgewa.re',
        },
    },
    parity: {
        providerDisplay: 'Parity',
        nodes: {
            alexander: 'wss://poc3-rpc.polkadot.io/',
            flamingFir: 'wss://substrate-rpc.parity.io/',
            kusama: 'wss://kusama-rpc.polkadot.io/',
            parami: 'wss://dana.parami.io/'
        },
    },
    unfrastructure: {
        providerDisplay: 'Centrality UNfrastructure',
        nodes: {
            alexander: 'wss://alex.unfrastructure.io/public/ws',
        },
    },
    w3f: {
        providerDisplay: 'Web3 Foundation',
        nodes: {
            kusama: 'wss://cc3-5.kusama.network/',
            parami: 'wss://cn3.dev.ad3.app:8443'
        },
    },
};

const ENDPOINT_DEFAULT = PROVIDERS.parity.nodes.kusama;
exports.ENDPOINT_DEFAULT = ENDPOINT_DEFAULT;

const ENDPOINTS = ORDER_CHAINS.reduce((endpoints, chainName) => {
    const { chainDisplay, logo, type } = CHAIN_INFO[chainName];
    return ORDER_PROVIDERS.reduce((Endpoints: any, providerName) => {
        const { providerDisplay, nodes } = PROVIDERS[providerName];
        const wssUrl = nodes[chainName];

        if (wssUrl) {
            Endpoints.push({
                info: logo,
                title: chainDisplay,
                text: ''.concat(type, '(hosted by ').concat(providerDisplay, ')'),
                value: wssUrl,
            });
        }

        return Endpoints;
    }, endpoints);
}, []) as any;
exports.ENDPOINTS = ENDPOINTS;

// add a local node right at the end
ENDPOINTS.push({
    info: 'local',
    title: 'Local',
    text: 'Local Node (Own, 127.0.0.1:9944)',
    value: 'ws://127.0.0.1:9944/',
});