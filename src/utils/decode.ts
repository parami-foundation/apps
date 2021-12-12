import { code2did, toHexString } from './hexcode';

const didPart1Number = 180;
const didPart2Number = 180;

const loadImg = (resolve: (arg: string) => void, avatar: any) => {
    const img = new Image();
    img.src = avatar;
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
        const cvs = document.createElement('canvas');
        cvs.width = img.width;
        cvs.height = img.height;
        if (img.width !== img.height || img.width < 220) {
            resolve('error');
            return;
        }
        const ctx = cvs.getContext('2d');

        const r = Math.round(324 * img.width / 640 * 10) / 10;
        const r2 = Math.round(342 * img.width / 640 * 10) / 10;

        if (ctx === null) {
            return;
        }

        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, img.width, img.height)
        const threshold = 220
        for (let i = 0; i < imgData.data.length; i += 4) {
            const R = imgData.data[i]
            const G = imgData.data[i + 1]
            const B = imgData.data[i + 2]
            const Alpha = imgData.data[i + 3]
            const sum = (R + G + B) / 3
            if (sum > threshold) {
                imgData.data[i] = 255
                imgData.data[i + 1] = 255
                imgData.data[i + 2] = 255
                imgData.data[i + 3] = Alpha
            } else {
                imgData.data[i] = 0
                imgData.data[i + 1] = 0
                imgData.data[i + 2] = 0
                imgData.data[i + 3] = Alpha
            }
        }
        ctx.putImageData(imgData, 0, 0)

        let result: string = '';
        let result1: string = ''
        let startAngle1 = Math.PI / 9 + 10 * Math.PI / 9 / 180 / 2;
        let startAngle2 = Math.PI / 6 + 2 * Math.PI / 3 / 180 / 2;

        for (let j = 0; j < didPart1Number; j++) {
            const x = img.width / 2 + r * Math.cos(startAngle1);
            const y = img.height / 2 + r * Math.sin(startAngle1);
            const pixel = ctx.getImageData(x, y, 1, 1);
            const data = pixel.data;

            const R = data[0]; // R(0-255)
            const G = data[1]; // G(0-255)
            const B = data[2]; // B(0-255)
            const sum = (R + G + B) / 3;

            if (sum < threshold) {
                result += '0';
            } else {
                result += '1';
            }
            startAngle1 += 10 * Math.PI / 9 / 180;
            if ((j + 1) % 45 === 0) {
                startAngle1 += 2 * Math.PI / 9;
            }
        }

        for (let j = 0; j < didPart2Number; j += 1) {
            const x = img.width / 2 + r2 * Math.cos(startAngle2);
            const y = img.height / 2 + r2 * Math.sin(startAngle2);
            const pixel = ctx.getImageData(x, y, 1, 1);
            const data = pixel.data;

            const R = data[0]; // R(0-255)
            const G = data[1]; // G(0-255)
            const B = data[2]; // B(0-255)
            const sum = (R + G + B) / 3;

            if (sum < threshold) {
                result1 += '0';
            } else {
                result1 += '1';
            }

            startAngle2 += 2 * Math.PI / 3 / 180;
            if ((j + 1) % 45 === 0) {
                startAngle2 += 2 * Math.PI / 6;
            }
        }
        try {
            const did = toHexString(code2did([result, result1]));
            resolve(did);
        } catch {
            resolve('error');
        }
    }
}

export default (avatar: any) => {
    return new Promise((resolve: (arg: string) => void) => {
        loadImg(resolve, avatar);
    })
}