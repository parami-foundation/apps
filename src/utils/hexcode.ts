const TLB = [
    '00000000',
    '00000001',
    '00000010',
    '00000011',
    '00000100',
    '00000101',
    '00000110',
    '00000111',
    '00001000',
    '00001001',
    '00001010',
    '00001011',
    '00001100',
    '00001101',
    '00001110',
    '00001111',
    '00010000',
    '00010001',
    '00010010',
    '00010011',
    '00010100',
    '00010101',
    '00010110',
    '00010111',
    '00011000',
    '00011001',
    '00011010',
    '00011011',
    '00011100',
    '00011101',
    '00011110',
    '00011111',
    '00100000',
    '00100001',
    '00100010',
    '00100011',
    '00100100',
    '00100101',
    '00100110',
    '00100111',
    '00101000',
    '00101001',
    '00101010',
    '00101011',
    '00101100',
    '00101101',
    '00101110',
    '00101111',
    '00110000',
    '00110001',
    '00110010',
    '00110011',
    '00110100',
    '00110101',
    '00110110',
    '00110111',
    '00111000',
    '00111001',
    '00111010',
    '00111011',
    '00111100',
    '00111101',
    '00111110',
    '00111111',
    '01000000',
    '01000001',
    '01000010',
    '01000011',
    '01000100',
    '01000101',
    '01000110',
    '01000111',
    '01001000',
    '01001001',
    '01001010',
    '01001011',
    '01001100',
    '01001101',
    '01001110',
    '01001111',
    '01010000',
    '01010001',
    '01010010',
    '01010011',
    '01010100',
    '01010101',
    '01010110',
    '01010111',
    '01011000',
    '01011001',
    '01011010',
    '01011011',
    '01011100',
    '01011101',
    '01011110',
    '01011111',
    '01100000',
    '01100001',
    '01100010',
    '01100011',
    '01100100',
    '01100101',
    '01100110',
    '01100111',
    '01101000',
    '01101001',
    '01101010',
    '01101011',
    '01101100',
    '01101101',
    '01101110',
    '01101111',
    '01110000',
    '01110001',
    '01110010',
    '01110011',
    '01110100',
    '01110101',
    '01110110',
    '01110111',
    '01111000',
    '01111001',
    '01111010',
    '01111011',
    '01111100',
    '01111101',
    '01111110',
    '01111111',
    '10000000',
    '10000001',
    '10000010',
    '10000011',
    '10000100',
    '10000101',
    '10000110',
    '10000111',
    '10001000',
    '10001001',
    '10001010',
    '10001011',
    '10001100',
    '10001101',
    '10001110',
    '10001111',
    '10010000',
    '10010001',
    '10010010',
    '10010011',
    '10010100',
    '10010101',
    '10010110',
    '10010111',
    '10011000',
    '10011001',
    '10011010',
    '10011011',
    '10011100',
    '10011101',
    '10011110',
    '10011111',
    '10100000',
    '10100001',
    '10100010',
    '10100011',
    '10100100',
    '10100101',
    '10100110',
    '10100111',
    '10101000',
    '10101001',
    '10101010',
    '10101011',
    '10101100',
    '10101101',
    '10101110',
    '10101111',
    '10110000',
    '10110001',
    '10110010',
    '10110011',
    '10110100',
    '10110101',
    '10110110',
    '10110111',
    '10111000',
    '10111001',
    '10111010',
    '10111011',
    '10111100',
    '10111101',
    '10111110',
    '10111111',
    '11000000',
    '11000001',
    '11000010',
    '11000011',
    '11000100',
    '11000101',
    '11000110',
    '11000111',
    '11001000',
    '11001001',
    '11001010',
    '11001011',
    '11001100',
    '11001101',
    '11001110',
    '11001111',
    '11010000',
    '11010001',
    '11010010',
    '11010011',
    '11010100',
    '11010101',
    '11010110',
    '11010111',
    '11011000',
    '11011001',
    '11011010',
    '11011011',
    '11011100',
    '11011101',
    '11011110',
    '11011111',
    '11100000',
    '11100001',
    '11100010',
    '11100011',
    '11100100',
    '11100101',
    '11100110',
    '11100111',
    '11101000',
    '11101001',
    '11101010',
    '11101011',
    '11101100',
    '11101101',
    '11101110',
    '11101111',
    '11110000',
    '11110001',
    '11110010',
    '11110011',
    '11110100',
    '11110101',
    '11110110',
    '11110111',
    '11111000',
    '11111001',
    '11111010',
    '11111011',
    '11111100',
    '11111101',
    '11111110',
    '11111111',
]

const TLB_R = {
    '00000000': 0,
    '00000001': 1,
    '00000010': 2,
    '00000011': 3,
    '00000100': 4,
    '00000101': 5,
    '00000110': 6,
    '00000111': 7,
    '00001000': 8,
    '00001001': 9,
    '00001010': 10,
    '00001011': 11,
    '00001100': 12,
    '00001101': 13,
    '00001110': 14,
    '00001111': 15,
    '00010000': 16,
    '00010001': 17,
    '00010010': 18,
    '00010011': 19,
    '00010100': 20,
    '00010101': 21,
    '00010110': 22,
    '00010111': 23,
    '00011000': 24,
    '00011001': 25,
    '00011010': 26,
    '00011011': 27,
    '00011100': 28,
    '00011101': 29,
    '00011110': 30,
    '00011111': 31,
    '00100000': 32,
    '00100001': 33,
    '00100010': 34,
    '00100011': 35,
    '00100100': 36,
    '00100101': 37,
    '00100110': 38,
    '00100111': 39,
    '00101000': 40,
    '00101001': 41,
    '00101010': 42,
    '00101011': 43,
    '00101100': 44,
    '00101101': 45,
    '00101110': 46,
    '00101111': 47,
    '00110000': 48,
    '00110001': 49,
    '00110010': 50,
    '00110011': 51,
    '00110100': 52,
    '00110101': 53,
    '00110110': 54,
    '00110111': 55,
    '00111000': 56,
    '00111001': 57,
    '00111010': 58,
    '00111011': 59,
    '00111100': 60,
    '00111101': 61,
    '00111110': 62,
    '00111111': 63,
    '01000000': 64,
    '01000001': 65,
    '01000010': 66,
    '01000011': 67,
    '01000100': 68,
    '01000101': 69,
    '01000110': 70,
    '01000111': 71,
    '01001000': 72,
    '01001001': 73,
    '01001010': 74,
    '01001011': 75,
    '01001100': 76,
    '01001101': 77,
    '01001110': 78,
    '01001111': 79,
    '01010000': 80,
    '01010001': 81,
    '01010010': 82,
    '01010011': 83,
    '01010100': 84,
    '01010101': 85,
    '01010110': 86,
    '01010111': 87,
    '01011000': 88,
    '01011001': 89,
    '01011010': 90,
    '01011011': 91,
    '01011100': 92,
    '01011101': 93,
    '01011110': 94,
    '01011111': 95,
    '01100000': 96,
    '01100001': 97,
    '01100010': 98,
    '01100011': 99,
    '01100100': 100,
    '01100101': 101,
    '01100110': 102,
    '01100111': 103,
    '01101000': 104,
    '01101001': 105,
    '01101010': 106,
    '01101011': 107,
    '01101100': 108,
    '01101101': 109,
    '01101110': 110,
    '01101111': 111,
    '01110000': 112,
    '01110001': 113,
    '01110010': 114,
    '01110011': 115,
    '01110100': 116,
    '01110101': 117,
    '01110110': 118,
    '01110111': 119,
    '01111000': 120,
    '01111001': 121,
    '01111010': 122,
    '01111011': 123,
    '01111100': 124,
    '01111101': 125,
    '01111110': 126,
    '01111111': 127,
    '10000000': 128,
    '10000001': 129,
    '10000010': 130,
    '10000011': 131,
    '10000100': 132,
    '10000101': 133,
    '10000110': 134,
    '10000111': 135,
    '10001000': 136,
    '10001001': 137,
    '10001010': 138,
    '10001011': 139,
    '10001100': 140,
    '10001101': 141,
    '10001110': 142,
    '10001111': 143,
    '10010000': 144,
    '10010001': 145,
    '10010010': 146,
    '10010011': 147,
    '10010100': 148,
    '10010101': 149,
    '10010110': 150,
    '10010111': 151,
    '10011000': 152,
    '10011001': 153,
    '10011010': 154,
    '10011011': 155,
    '10011100': 156,
    '10011101': 157,
    '10011110': 158,
    '10011111': 159,
    '10100000': 160,
    '10100001': 161,
    '10100010': 162,
    '10100011': 163,
    '10100100': 164,
    '10100101': 165,
    '10100110': 166,
    '10100111': 167,
    '10101000': 168,
    '10101001': 169,
    '10101010': 170,
    '10101011': 171,
    '10101100': 172,
    '10101101': 173,
    '10101110': 174,
    '10101111': 175,
    '10110000': 176,
    '10110001': 177,
    '10110010': 178,
    '10110011': 179,
    '10110100': 180,
    '10110101': 181,
    '10110110': 182,
    '10110111': 183,
    '10111000': 184,
    '10111001': 185,
    '10111010': 186,
    '10111011': 187,
    '10111100': 188,
    '10111101': 189,
    '10111110': 190,
    '10111111': 191,
    '11000000': 192,
    '11000001': 193,
    '11000010': 194,
    '11000011': 195,
    '11000100': 196,
    '11000101': 197,
    '11000110': 198,
    '11000111': 199,
    '11001000': 200,
    '11001001': 201,
    '11001010': 202,
    '11001011': 203,
    '11001100': 204,
    '11001101': 205,
    '11001110': 206,
    '11001111': 207,
    '11010000': 208,
    '11010001': 209,
    '11010010': 210,
    '11010011': 211,
    '11010100': 212,
    '11010101': 213,
    '11010110': 214,
    '11010111': 215,
    '11011000': 216,
    '11011001': 217,
    '11011010': 218,
    '11011011': 219,
    '11011100': 220,
    '11011101': 221,
    '11011110': 222,
    '11011111': 223,
    '11100000': 224,
    '11100001': 225,
    '11100010': 226,
    '11100011': 227,
    '11100100': 228,
    '11100101': 229,
    '11100110': 230,
    '11100111': 231,
    '11101000': 232,
    '11101001': 233,
    '11101010': 234,
    '11101011': 235,
    '11101100': 236,
    '11101101': 237,
    '11101110': 238,
    '11101111': 239,
    '11110000': 240,
    '11110001': 241,
    '11110010': 242,
    '11110011': 243,
    '11110100': 244,
    '11110101': 245,
    '11110110': 246,
    '11110111': 247,
    '11111000': 248,
    '11111001': 249,
    '11111010': 250,
    '11111011': 251,
    '11111100': 252,
    '11111101': 253,
    '11111110': 254,
    '11111111': 255,
}


export const fromHexString = (hexString: string|null) => {
    if(hexString === null) {
        return new Uint8Array(0);
    }
    let tmp=hexString;
    if(hexString.indexOf('0x') === 0) {
        tmp=hexString.substring(2);
    }
    const matches = tmp.match(/.{1,2}/g);
    if (matches === null) throw new Error('Invalid hex string');
    return new Uint8Array(matches.map(byte => parseInt(byte, 16)));
}

export const did2code = (didHexString: string) => {
    const did = fromHexString(didHexString);
    if (did === null) {
        return '';
    }
    let res: string = '';
    for (let i = 0; i < did.length; i += 1) {
        const tmp = TLB[did[i]];
        let count = 0;
        for (let ii = 0; ii < 8; ii++) {
            if (tmp[ii] === '1') {
                count++;
            }
        }
        const checkSum = ((count + 1) % 2);
        res += TLB[did[i]] + checkSum.toString();
    }
    return res;
}
export const checkIt = (data: string) => {
    const checkSum = data.substring(8, 9);
    let count = 0;
    for (let ii = 0; ii < 8; ii++) {
        if (data[ii] === '1') {
            count++;
        }
    }
    return checkSum === (((count + 1) % 2)).toString();
}
export const code2did = (code: string[]) => {
    const tmp = new Uint8Array(code[0].length / 9);
    for (let i = 0; i < code[0].length; i += 9) {
        let key = code[0].substring(i, i + 9);
        if (!checkIt(key)) {
            key = code[1].substring(i, i + 9);
            if (!checkIt(key)) {
                console.log('decode error at ' + i / 9);
                throw new Error('decode error at' + i / 9);//todo: make a error correction
            }
        }
        tmp[i / 9] = TLB_R[key.substring(0, 8)];
    }
    return tmp;
}

export const toHexString = (bytes: Uint8Array) => {
    return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}
