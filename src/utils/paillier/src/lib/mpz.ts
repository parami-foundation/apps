
export function sampleBelow(upper: bigint): bigint {
    const bits = upper.toString(2).length;
    while (true){
        let n = sample(bits);
        if (n < upper) {
            return n;
        }
    }
}

export function sample(bitsLength: number): bigint {
    let buf = "0b";
    let rand = 0;
    for (let i = 0; i < bitsLength; i++) {
        buf += rand = Math.random() > 0.5 ? 1 : 0;
    }
    return BigInt(buf)
}

export function sampleRange(lower: bigint, upper: bigint): bigint {
    return lower + sampleBelow((upper - lower));
}

export function toBigEndian(bigInt: bigint): Uint8Array {
    if (bigInt === 0n) return new Uint8Array(1);
    const hex = bigInt.toString(16);
    const len = hex.length;
    const bytes = new Uint8Array(len / 2);
    for (let i = 0; i < len; i += 2) {
        bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes;
}
export function toLittleEndian(bigInt: bigint): Uint8Array {
    return toBigEndian(bigInt).reverse();
}
