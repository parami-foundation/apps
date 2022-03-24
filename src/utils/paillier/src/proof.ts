import { PublicKey } from "paillier-bigint";
import { createHash } from 'sha256-uint8array'
import { sampleBelow, sampleRange } from "./lib/mpz";
(BigInt.prototype as any).toJSON = function () {
    //return '0x'+this.toString(16)
    return this.toString();
}
export type EncryptedPairs = {
    c1: bigint[], // TODO[Morten] should not need to be public
    c2: bigint[], // TODO[Morten] should not need to be public
};

export type EncryptionKey = PublicKey;

export type ChallengeBits = Uint8Array;
export type DataRandomnessPairs = {
    w1: bigint[],
    w2: bigint[],
    r1: bigint[],
    r2: bigint[],
}
export type Response = {
    Open?: {
        w1: bigint,
        r1: bigint,
        w2: bigint,
        r2: bigint,
    },
    Mask?: {
        j: number,
        masked_x: bigint,
        masked_r: bigint,
    },
}

export type Proof = Response[];
// need be divisible by 8, minimum value is 8
const STATISTICAL_ERROR_FACTOR = 8;

//   const bits = getBits([0xf0, 0x11]);
//   console.log('bits: ', bits); // 1111000010001
// tested
function getBits(data: number[]): string {
    let bits = "";
    for (let i = 0; i < data.length; i++) {
        bits += data[i].toString(2);
    }
    return bits;
}
// tested
function computeDigest(vec: bigint[]): number[] {
    const sha256 = createHash('sha256');
    for (let i = 0; i < vec.length; i++) {
        sha256.update(vec[i].toString(16));
    }
    var hash = sha256.digest();
    return Array.from(hash);
}

function generateProof(ek: EncryptionKey, secret_x: bigint, secret_r: bigint, e: number[], range: bigint, data: DataRandomnessPairs): Proof {
    const rangeScaledThird = range / 3n;
    const rangeScaledTwoThirds = rangeScaledThird * 2n;
    let bits_of_e = getBits(e);
    const responses: Response[] = [];
    for (let i = 0; i < STATISTICAL_ERROR_FACTOR; i++) {
        let flag = true;
        if (i < bits_of_e.length) {
            flag = bits_of_e[i] === '1';
        } else {
            flag = false;
        }
        if (!flag) {
            responses.push({
                Open: {
                    w1: data.w1[i],
                    r1: data.r1[i],
                    w2: data.w2[i],
                    r2: data.r2[i],
                }
            });
        } else {
            if ((secret_x + data.w1[i]) > rangeScaledThird && (secret_x + data.w1[i]) < rangeScaledTwoThirds) {
                responses.push({
                    Mask: {
                        j: 1,
                        masked_x: secret_x + data.w1[i],
                        masked_r: secret_r * data.r1[i] % ek.n,
                    }
                });
            } else {
                responses.push({
                    Mask: {
                        j: 2,
                        masked_x: secret_x + data.w2[i],
                        masked_r: secret_r * data.r2[i] % ek.n,
                    }
                });
            }
        }
    }
    return responses;
}
export default function prover(ek: EncryptionKey, range: bigint, secret_x: bigint): { encrypted_pairs: EncryptedPairs, challenge_bits: number[], proof: Proof, range: bigint, cipher_x: bigint } {
    // const secret_r = sampleBelow(ek.n);
    const secret_r = 100000000000000000000000000000000n;
    const cipher_x = ek.encrypt(secret_x, secret_r)
    // let (encrypted_pairs, data_randomness_pairs) = Paillier::generate_encrypted_pairs(ek, range);
    let { encryptedPairs: encrypted_pairs, dataRandomnessPairs } = generateEncryptedPairs(ek, range);
    // let (c1, c2) = (encrypted_pairs.c1, encrypted_pairs.c2);
    let { c1, c2 } = encrypted_pairs;
    let vec: bigint[] = c1.concat(c2);
    //let e = ChallengeBits::from(compute_digest(vec.iter()));
    let challenge_bits = computeDigest(vec);
    let proof =
        generateProof(ek, secret_x, secret_r, challenge_bits, range, dataRandomnessPairs);
    return { encrypted_pairs, challenge_bits, proof, range, cipher_x };
}
function generateEncryptedPairs(ek: PublicKey, range: bigint): { encryptedPairs: EncryptedPairs, dataRandomnessPairs: DataRandomnessPairs } {
    const rangeScaledThird = range / 3n;
    const rangeScaledTwoThirds = rangeScaledThird * 2n;
    let w1: bigint[] = [];
    for (let i = 0; i < STATISTICAL_ERROR_FACTOR; i++) {
        w1.push(sampleRange(rangeScaledThird, rangeScaledTwoThirds));
    }
    let w2: bigint[] = w1.map(x => x - rangeScaledThird);
    // with probability 1/2 switch between w1i and w2i
    for (let i = 0; i < STATISTICAL_ERROR_FACTOR; i++) {
        if (Math.random() > 0.5) {
            let temp = w1[i];
            w1[i] = w2[i];
            w2[i] = temp;
        }
    }
    let r1: bigint[] = [];
    let r2: bigint[] = [];
    for (let i = 0; i < STATISTICAL_ERROR_FACTOR; i++) {
        r1.push(sampleBelow(ek.n));
        r2.push(sampleBelow(ek.n));
    }
    let c1: bigint[] = w1.map((wi, index) => {
        return ek.encrypt(wi, r1[index]);
    });
    let c2: bigint[] = w2.map((wi, index) => {
        return ek.encrypt(wi, r2[index]);
    });
    return { encryptedPairs: { c1, c2 }, dataRandomnessPairs: { w1, w2, r1, r2 } };
}
