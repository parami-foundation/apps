

function BigIntToFloatString(value: string | bigint, decimals: number): string {
    if (!value) {
        return '0';
    };
    if (typeof (value) !== 'string') {
        value = value.toString();

    }
    if (value === '0') {
        return '0';
    }
    if (value.length <= decimals) {
        let floatPart = value.padStart(decimals, '0');
        const zeroIndex = floatPart.search(/([0]+)$/);
        if (zeroIndex > -1) {
            floatPart = floatPart.substring(0, zeroIndex);
        }
        if (floatPart.length > 0) {
            floatPart = '0.' + floatPart;
        } else {
            floatPart = '0';
        }
        return floatPart;
    }
    const intPart = value.substring(0, value.length - decimals);
    let floatPart = value.substring(value.length - decimals);
    const zeroIndex = floatPart.search(/([0]+)$/);
    if (zeroIndex > -1) {
        floatPart = floatPart.substring(0, zeroIndex);
    }
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
    console.log(BigInt('0x10'));
    console.log(BigIntToFloatString('148885221901016141', 18))
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