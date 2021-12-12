import { did2code } from './hexcode'

const defaultWidth = 640;
const defaultHeight = 640;

const circleImg = (ctx: CanvasRenderingContext2D | null, img: HTMLImageElement, x: number, y: number, r: number, data: string) => {
    if (ctx === null) {
        return;
    }

    ctx.save();
    const d = 2 * r;
    const cx = x + r;
    const cy = y + r;

    // add gradient color
    const gradient = ctx.createLinearGradient(0, 640, 640, 0);
    gradient.addColorStop(0, '#FE2105');
    gradient.addColorStop(1, '#96E9EA');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.rect(0, 0, 640, 640);
    ctx.fill();
    ctx.save();
    ctx.restore();

    // fill in avatar
    ctx.beginPath();
    ctx.arc(cx, cy, r - 40, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(img, x + 40, y + 40, d - 80, d - 80);
    ctx.restore();

    // draw first circular
    let startAngle = Math.PI / 9;
    ctx.lineWidth = 8;
    for (let j = 0; j < 180; j += 1) {
        ctx.save();
        ctx.beginPath();
        if (data[j] === '0') {
            ctx.strokeStyle = 'transparent';
        } else {
            ctx.strokeStyle = '#fff';
        }
        ctx.arc(cx, cy, r + 4, startAngle, startAngle + 10 * Math.PI / 9 / 180, false);
        startAngle += 10 * Math.PI / 9 / 180;
        if ((j + 1) % 45 == 0) {
            startAngle += 2 * Math.PI / 9;
        }
        ctx.stroke();
    }

    // draw second circular
    let startAngle2 = Math.PI / 6;
    ctx.lineWidth = 6;
    for (let j = 0; j < 180; j += 1) {
        ctx.save();
        ctx.beginPath();
        if (data[j] === '0') {
            ctx.strokeStyle = 'transparent';
        } else {
            ctx.strokeStyle = '#fff';
        }
        ctx.arc(cx, cy, r + 22, startAngle2, startAngle2 + 2 * Math.PI / 3 / 180, false);
        startAngle2 += 2 * Math.PI / 3 / 180;
        if ((j + 1) % 45 == 0) {
            startAngle2 += 2 * Math.PI / 6;
        }
        ctx.stroke();
    }
}

const generateRoundAvatar = (resolve: any, _reject: any, avatar: any, bgColor: any, symbol: any, did: string) => {
    const cvs = document.createElement('canvas');
    cvs.width = defaultWidth;
    cvs.height = defaultHeight;
    const ctx = cvs.getContext('2d');
    const img = new Image();
    img.src = avatar;

    const codeCanvas = document.createElement('canvas');
    const codeCtx = codeCanvas.getContext('2d');

    if (codeCtx === null) {
        return;
    }
    const codedDid = did2code(did)
    codeCtx.clearRect(0, 0, defaultWidth, defaultHeight);

    img.onload = () => {
        if (codedDid === undefined) {
            return;
        }
        circleImg(ctx, img, 0, 0, 320, codedDid);
        const maskBg = cvs.toDataURL('image/png');
        resolve(maskBg);
    }
}

export default (avatar: any, bgColor: any, symbol: string, did: any) => {
    return new Promise((resolve, reject) => {
        generateRoundAvatar(resolve, reject, avatar, bgColor, symbol, did);
    })
}