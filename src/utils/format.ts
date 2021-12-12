import BN from "bn.js";
import { formatBalance as _formatBalance } from '@polkadot/util';

export const formatBalance = (value = 0, showUnit = true): string => {
    const { unit, decimals } = _formatBalance.getDefaults();
    if (typeof value === 'undefined') {
        return `--- ${unit}`;
    }
    const s = new BN(`${value}`).toString().padStart(decimals + 1, '0');
    const b = s.substr(0, s.length - decimals);
    const a = s.substr(s.length - decimals, 3);
    if (!showUnit) {
        return `${b}.${a}`;
    }
    return `${b}.${a} ${unit}`;
};

export const toBN = (number: number): BN => {
    if (!number) {
        return new BN(0);
    }
    const { decimals } = _formatBalance.getDefaults();
    const [a, b = '0'] = `${number}`.split('.');
    const s1 = `${a}${b.padEnd(decimals, '0')}`;
    return new BN(s1);
};

export const formatHex = (value = '') => {
    if (!value) {
        return '0x';
    }
    if (value.startsWith('0x')) {
        return value;
    }
    return `0x${value}`;
};

export function BigIntToFloatString(value: string | bigint, decimals: number): string {
    if (!value) {
        return '0';
    };
    if (typeof (value) === 'bigint') {
        if (value === BigInt(0)) {
            return '0';
        }
        value = value.toString();
    }
    if (typeof (value) !== 'string') {
        return '0';
    }

    if (value.length <= decimals) {
        let floatPart = value.padStart(decimals, '0');
        const zeroIndex = floatPart.search(/([1-9])([0]+)$/);
        floatPart = floatPart.substring(0, zeroIndex + 1);
        if (floatPart.length > 0) {
            floatPart = '0.' + floatPart;
        } else {
            floatPart = '0';
        }

        return floatPart;
    }
    const intPart = value.substring(0, value.length - decimals);
    let floatPart = value.substring(value.length - decimals);
    console.log(intPart, floatPart)
    const zeroIndex = floatPart.search(/([0]+)$/);
    if (zeroIndex > -1) {
        floatPart = floatPart.substring(0, zeroIndex);
    }
    if (floatPart.length === 0) {
        return intPart;
    }
    return intPart + '.' + floatPart;
}

export function FloatStringToBigInt(value: string, decimals: number): bigint {
    // console.log(typeof (value));
    if (!value) {
        return BigInt(0);
    };
    if (typeof (value) !== 'string') {
        return BigInt(0);
    }
    if (value.indexOf('.') === -1) {
        return BigInt(value.padEnd(value.length + decimals, '0'));
    }
    // eslint-disable-next-line prefer-const
    let [intPart, floatPart] = value.split('.');
    if (intPart.length === 1 && intPart === '0') {
        intPart = '';
    }
    if (floatPart.length < decimals) {
        return BigInt(intPart + floatPart.padEnd(decimals, '0'));
    } else {
        return BigInt(intPart + floatPart.substring(0, decimals));
    }
}
