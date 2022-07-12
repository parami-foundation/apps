import { Bit, BitArray, write } from './wnft.util';

export default (avatar: any, did: any) => {
    return new Promise((resolve, _reject) => {
        const img = new Image();
        img.src = avatar;
        img.onload = () => {
            const raw = new BitArray(256);

            const hexStartingIndex = 8;
            // bitArray: [ 1 byte type identifier, 20 bytes contract address/did, 000...000, tokenId in 32bit ]
            const typeIdentifier: number = 2; // wnft = 1; did = 2;
            raw.set([...typeIdentifier.toString(2).padStart(8, '0')].map(bit => +bit as Bit), 0);

            const hexString = did.replace('0x', '');
            [...hexString].forEach((c, index) => {
                raw.set(
                    [...parseInt(c, 16).toString(2).padStart(4, '0')].map(bit => +bit as Bit),
                    hexStartingIndex + index * 4
                )
            });

            const ringImage = write(img, raw);
            const res = ringImage.toDataURL('image/png');
            resolve(res);
        }
    })
}