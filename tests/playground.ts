function BigIntToFloatString(value: string | bigint, decimals: number): string {
    if (!value) {
        return '0';
    };
    if (typeof (value) !== 'string') {
        if (typeof (value) === 'bigint') {
            value = value.toString();
        } else {
            return '0';
        }
    }
    if (value.length <= decimals) {
        let floatPart = value.padStart(decimals, '0');
        const zeroIndex = floatPart.search(/([1-9])([0]+)$/);
        floatPart = floatPart.substring(0, zeroIndex + 1);
        floatPart = '0.' + floatPart;
        return floatPart;
    }
    let intPart = value.substring(0, value.length - decimals);
    let floatPart = value.substring(value.length - decimals);
    const zeroIndex = floatPart.search(/([1-9])([0]+)$/);
    floatPart = floatPart.substring(0, zeroIndex + 1);
    if (floatPart.length === 0) {
        return intPart;
    }
    return intPart + '.' + floatPart;
}
function FloatStringToBigInt(value: string, decimals: number): bigint {
    if (!value) {
        return BigInt(0);
    };
    if (typeof (value) !== 'string') {
        return BigInt(0);
    }
    if (value.indexOf('.') === -1) {
        return BigInt(value.padEnd(value.length + decimals, '0'));
    }
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

function main() {
    const a = BigIntToFloatString('100000000000000022222222000', 18);
    console.log(a);
    const b = BigIntToFloatString('1222000000000000000000', 18);
    console.log(b);
    const c = BigIntToFloatString('10000000000000000', 18);
    console.log(c);
    console.log(FloatStringToBigInt(a, 18));
    console.log('100000000000000022222222000')
    console.log(FloatStringToBigInt(b, 18));
    console.log('1222000000000000000000');
    console.log(FloatStringToBigInt(c, 18));
    console.log(BigInt('000000010000000000000000'));
    console.log(1 + 2 * 3);
}
main();