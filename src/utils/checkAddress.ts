const { decodeAddress, encodeAddress } = require('@polkadot/keyring');
const { hexToU8a, isHex } = require('@polkadot/util');

export const isETHAddress = (address: any) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const isBTCAddress = (address: any) => {
    return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/.test(address);
};

export const isPolkadotAddress = (address: any) => {
    try {
        encodeAddress(
            isHex(address)
                ? hexToU8a(address)
                : decodeAddress(address)
        );
        return true;
    } catch (error) {
        return false;
    }
};