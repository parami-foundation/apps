/* eslint-disable @typescript-eslint/no-unused-vars */
export function SVG3DTagCloud(element, params) {
    const settings = {
        entries: [] as any[],
        width: 480,
        height: 480,
        radius: '70%',
        radiusMin: 75,
        bgDraw: true,
        bgColor: '#000',
        opacityOver: 1.00,
        opacityOut: 0.05,
        opacitySpeed: 6,
        fov: 800,
        speed: 1,
        maxSpeed: 1,
        fontFamily: 'Arial, sans-serif',
        fontSize: '15',
        fontColor: '#fff',
        fontWeight: 'normal',//bold
        fontStyle: 'normal',//italic 
        fontStretch: 'normal',//wider, narrower, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded
        fontToUpperCase: false,
        tooltipFontFamily: 'Arial, sans-serif',
        tooltipFontSize: '15',
        tooltipFontColor: '#fff',
        tooltipFontWeight: 'normal',//bold
        tooltipFontStyle: 'normal',//italic 
        tooltipFontStretch: 'normal',//wider, narrower, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded
        tooltipFontToUpperCase: false,
        tooltipTextAnchor: 'left',
        tooltipDiffX: 0,
        tooltipDiffY: 10,
    };

    //---
    if (params !== undefined)
        for (const prop in params)
            if (params.hasOwnProperty(prop) && settings.hasOwnProperty(prop))
                settings[prop] = params[prop];

    //---
    if (!settings.entries.length)
        return false;

    //---
    let isMobile = false;
    let touchStartPos = { x: 0, y: 0 };
    let touchMovedVector = { x: 0, y: 0 };
    let touchTime = 0;
    let entryHolder: any[] = [];
    let tooltip;

    let radius;
    let diameter;

    let mouseReact = true;
    let mousePos = { x: 0, y: 0 };

    let center2D;
    const center3D = { x: 0, y: 0, z: 0 };

    const speed = { x: 0, y: 0 };

    const position = { sx: 0, cx: 0, sy: 0, cy: 0 };

    const MATHPI180 = Math.PI / 180;

    let svg;
    const svgNS = 'http://www.w3.org/2000/svg';

    let bg;

    //---
    const reInit = () => {
        const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        let svgWidth = windowWidth;
        let svgHeight = windowHeight;

        if (settings.width.toString().indexOf('%') > 0 || settings.height.toString().indexOf('%') > 0) {
            svgWidth = Math.round(element.offsetWidth / 100 * parseInt(settings.width.toString()));
            svgHeight = Math.round(svgWidth / 100 * parseInt(settings.height.toString()));
        } else {
            svgWidth = parseInt(settings.width.toString());
            svgHeight = parseInt(settings.height.toString());
        }

        if (windowWidth <= svgWidth)
            svgWidth = windowWidth;

        if (windowHeight <= svgHeight)
            svgHeight = windowHeight;

        //---
        center2D = { x: svgWidth / 2, y: svgHeight / 2 };

        speed.x = settings.speed / center2D.x;
        speed.y = settings.speed / center2D.y;

        if (svgWidth >= svgHeight)
            diameter = svgHeight / 100 * parseInt(settings.radius);
        else
            diameter = svgWidth / 100 * parseInt(settings.radius);

        if (diameter < 1)
            diameter = 1;

        radius = diameter / 2;

        if (radius < settings.radiusMin) {
            radius = settings.radiusMin;
            diameter = radius * 2;
        }

        //---
        svg.setAttribute('width', svgWidth);
        svg.setAttribute('height', svgHeight);

        if (settings.bgDraw) {
            bg.setAttribute('width', svgWidth);
            bg.setAttribute('height', svgHeight);
        }

        //---
        setEntryPositions(radius);
    };

    const init = () => {
        element.removeChild(element.firstChild);
        svg = document.createElementNS(svgNS, 'svg');
        svg.addEventListener('mousemove', mouseMoveHandler);
        svg.addEventListener('touchstart', touchStartHandler, true);
        svg.addEventListener('touchend', touchEndHandler, true);
        svg.addEventListener('touchmove', touchMoveHandler, true);
        svg.addEventListener('touchcancel', touchCancelHandler, true);
        element.appendChild(svg);

        if (settings.bgDraw) {
            bg = document.createElementNS(svgNS, 'rect');
            bg.setAttribute('x', 0);
            bg.setAttribute('y', 0);
            bg.setAttribute('fill', settings.bgColor);

            svg.appendChild(bg);
        }

        //---

        addEntries();
        reInit();
        animloop();

        //---

        window.addEventListener('resize', resizeHandler);
    };

    //---

    function setEntryPositions(Radius) {
        for (let i = 0, l = entryHolder.length; i < l; i++) {
            setEntryPosition(entryHolder[i], Radius);
        }
    };

    function setEntryPosition(entry, Radius) {
        const dx = entry.vectorPosition.x - center3D.x;
        const dy = entry.vectorPosition.y - center3D.y;
        const dz = entry.vectorPosition.z - center3D.z;

        const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

        entry.vectorPosition.x /= length;
        entry.vectorPosition.y /= length;
        entry.vectorPosition.z /= length;

        entry.vectorPosition.x *= Radius;
        entry.vectorPosition.y *= Radius;
        entry.vectorPosition.z *= Radius;
    };

    function addEntry(index, entryObj, x, y, z) {
        const entry: any = {};

        if (typeof entryObj.data.label != 'undefined') {
            entry.element = document.createElementNS(svgNS, 'text');
            entry.element.setAttribute('x', 0);
            entry.element.setAttribute('y', 0);
            entry.element.setAttribute('fill', entryObj.fontColor);
            entry.element.setAttribute('font-family', entryObj.fontFamily || settings.fontFamily);
            entry.element.setAttribute('font-size', entryObj.fontSize || settings.fontSize);
            entry.element.setAttribute('font-weight', entryObj.fontWeight || settings.fontWeight);
            entry.element.setAttribute('font-style', entryObj.fontStyle || settings.fontStyle);
            entry.element.setAttribute('font-stretch', entryObj.fontStretch || settings.fontStretch);
            entry.element.setAttribute('text-anchor', 'middle');
            entry.element.textContent = (entryObj.value ? '' : '👉') + ' ' + entryObj.data.label + (entryObj.value ? ' ' + `(${entryObj.value})` : '');
        } else if (typeof entryObj.data.image != 'undefined') {
            entry.element = document.createElementNS(svgNS, 'image');
            entry.element.setAttribute('x', 0);
            entry.element.setAttribute('y', 0);
            entry.element.setAttribute('width', entryObj.data.width);
            entry.element.setAttribute('height', entryObj.data.height);
            entry.element.setAttribute('id', 'image_' + index);
            entry.element.setAttributeNS('http://www.w3.org/1999/xlink', 'href', entryObj.data.image);

            entry.diffX = entryObj.data.width / 2;
            entry.diffY = entryObj.data.height / 2;
        }

        entry.link = document.createElementNS(svgNS, 'a');
        if (!!entryObj.data.url) {
            entry.link.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', entryObj.data.url);
            entry.link.setAttribute('href', entryObj.data.url);
        }
        entry.link.setAttribute('style', `padding: 10px; background-color:${entryObj.bgColor}; border: 1px solid black`);
        entry.link.addEventListener('mouseover', mouseOverHandler, true);
        entry.link.addEventListener('mouseout', mouseOutHandler, true);


        entry.link.appendChild(entry.element);

        if (typeof entryObj.value != 'undefined') {
            entry.tooltip = true;
            entry.tooltipLabel = settings.tooltipFontToUpperCase ? entryObj.value.toUpperCase() : entryObj.value;;
        } else {
            entry.tooltip = false;
        }

        entry.index = index;
        entry.mouseOver = false;

        entry.vectorPosition = { x: x, y: y, z: z };
        entry.vector2D = { x: 0, y: 0 };

        svg.appendChild(entry.link);

        return entry;
    };

    function addEntries() {
        let Tooltip = false;

        for (let i = 1, l = settings.entries.length + 1; i < l; i++) {
            const phi = Math.acos(-1 + (2 * i) / l);
            const theta = Math.sqrt(l * Math.PI) * phi;

            const x = Math.cos(theta) * Math.sin(phi);
            const y = Math.sin(theta) * Math.sin(phi);
            const z = Math.cos(phi);

            const entry = addEntry(i - 1, settings.entries[i - 1], x, y, z);

            entryHolder.push(entry);

            if (typeof settings.entries[i - 1].value != 'undefined') {
                Tooltip = true;
            }
        }

        if (Tooltip) {
            addTooltip();
        }
    };

    function addTooltip() {
        tooltip = document.createElementNS(svgNS, 'text');
        tooltip.setAttribute('x', 0);
        tooltip.setAttribute('y', 0);
        tooltip.setAttribute('fill', settings.tooltipFontColor);
        tooltip.setAttribute('font-family', settings.tooltipFontFamily);
        tooltip.setAttribute('font-size', settings.tooltipFontSize);
        tooltip.setAttribute('font-weight', settings.tooltipFontWeight);
        tooltip.setAttribute('font-style', settings.tooltipFontStyle);
        tooltip.setAttribute('font-stretch', settings.tooltipFontStretch);
        tooltip.setAttribute('text-anchor', settings.tooltipTextAnchor);
        tooltip.textContent = '';

        svg.appendChild(tooltip);
    };

    function getEntryByElement(Element) {
        for (let i = 0, l = entryHolder.length; i < l; i++) {
            const entry = entryHolder[i];

            if (entry.element.getAttribute('x') === Element.getAttribute('x') &&
                entry.element.getAttribute('y') === Element.getAttribute('y')) {

                return entry;
            }
        }

        return;
    };

    function highlightEntry(entry) {
        for (let i = 0, l = entryHolder.length; i < l; i++) {
            const e = entryHolder[i];

            if (e.index === entry.index) {
                e.mouseOver = true;
            } else {
                e.mouseOver = false;
            }
        }
    };

    //---

    function showTooltip(entry) {
        if (entry.tooltip) {
            tooltip.setAttribute('x', entry.vector2D.x - settings.tooltipDiffX);
            tooltip.setAttribute('y', entry.vector2D.y - settings.tooltipDiffY);

            tooltip.textContent = settings.tooltipFontToUpperCase ? entry.tooltipLabel.toUpperCase() : entry.tooltipLabel;

            tooltip.setAttribute('opacity', 1.0);
        }
    };

    function hideTooltip(Entry) {
        tooltip.setAttribute('opacity', 0.0);
    };

    //---

    function render() {
        if (isMobile || Date.now() - touchTime < 2000) {
            const fx = -touchMovedVector.x;
            const fy = touchMovedVector.y;

            const angleX = fx * MATHPI180;
            const angleY = fy * MATHPI180;

            position.sx = Math.sin(angleX);
            position.cx = Math.cos(angleX);
            position.sy = Math.sin(angleY);
            position.cy = Math.cos(angleY);
        } else {
            let fx = speed.x * mousePos.x - settings.speed;
            if (fx > settings.maxSpeed) fx = settings.maxSpeed;
            if (fx < -settings.maxSpeed) fx = -settings.maxSpeed;
            let fy = settings.speed - speed.y * mousePos.y;
            if (fy > settings.maxSpeed) fy = settings.maxSpeed;
            if (fy < -settings.maxSpeed) fy = -settings.maxSpeed;

            const angleX = fx * MATHPI180;
            const angleY = fy * MATHPI180;

            position.sx = Math.sin(angleX);
            position.cx = Math.cos(angleX);
            position.sy = Math.sin(angleY);
            position.cy = Math.cos(angleY);
        }
        //---

        for (let i = 0, l = entryHolder.length; i < l; i++) {
            const entry = entryHolder[i];

            //---
            if (mouseReact) {
                const rx = entry.vectorPosition.x;
                const rz = entry.vectorPosition.y * position.sy + entry.vectorPosition.z * position.cy;

                entry.vectorPosition.x = rx * position.cx + rz * position.sx;
                entry.vectorPosition.y = entry.vectorPosition.y * position.cy + entry.vectorPosition.z * -position.sy;
                entry.vectorPosition.z = rx * -position.sx + rz * position.cx;
            }

            //---

            const scale = settings.fov / (settings.fov + entry.vectorPosition.z);

            entry.vector2D.x = entry.vectorPosition.x * scale + center2D.x;
            entry.vector2D.y = entry.vectorPosition.y * scale + center2D.y;

            //---
            if (entry.diffX && entry.diffY) {
                entry.vector2D.x -= entry.diffX;
                entry.vector2D.y -= entry.diffY;
            }

            //---
            entry.element.setAttribute('x', entry.vector2D.x);
            entry.element.setAttribute('y', entry.vector2D.y);

            //---
            let opacity;

            if (mouseReact) {
                opacity = (radius - entry.vectorPosition.z) / diameter;

                if (opacity < settings.opacityOut) {
                    opacity = settings.opacityOut;
                }
            } else {
                opacity = parseFloat(entry.element.getAttribute('opacity'));

                if (entry.mouseOver) {
                    opacity += (settings.opacityOver - opacity) / settings.opacitySpeed;
                } else {
                    opacity += (settings.opacityOut - opacity) / settings.opacitySpeed;
                }
            }

            entry.element.setAttribute('opacity', opacity);
        }

        //---
        entryHolder = entryHolder.sort(function (a, b) {
            return (b.vectorPosition.z - a.vectorPosition.z);
        });

    };

    //---
    const requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            (window as any).webkitRequestAnimationFrame ||
            (window as any).mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    function animloop() {
        requestAnimFrame(animloop);
        render();
    };
    //---touch event handlers

    function touchStartHandler(event) {
        isMobile = true;
        //mouseReact = false;
        const touch = event.touches[0];
        touchStartPos = {
            x: touch.pageX,
            y: touch.pageY
        }
    }

    function touchMoveHandler(event) {
        const touch = event.touches[0];
        const endPosition = {
            x: touch.pageX,
            y: touch.pageY
        }
        touchMovedVector.x = endPosition.x - touchStartPos.x;
        touchMovedVector.y = endPosition.y - touchStartPos.y;
        touchStartPos = endPosition;
        isMobile = true;
        //mouseReact = false;
    }

    function touchEndHandler(event) {
        touchMovedVector = { x: 0, y: 0 };
        isMobile = false;
        touchTime = Date.now();
        //mouseReact = false;
    }

    function touchCancelHandler(event) {
        touchMovedVector = { x: 0, y: 0 };
        isMobile = false;
        touchTime = Date.now();
        //mouseReact = false;
    }

    //---mouse event handlers
    function mouseOverHandler(event) {
        //---
        isMobile = false;
        const entry = getEntryByElement(event.target);
        //filter z-index
        if (entry.vectorPosition.z < 0) {
            mouseReact = false;
            highlightEntry(entry);
            if (entry.tooltip) {
                showTooltip(entry);
            }
        }
    };

    function mouseOutHandler(event) {
        isMobile = false;
        mouseReact = true;

        //---
        const entry = getEntryByElement(event.target);

        if (entry.tooltip) {
            hideTooltip(entry);
        }
    };

    //---
    function mouseMoveHandler(event) {
        isMobile = false;
        mousePos = getMousePos(svg, event);

    };

    function getMousePos(Svg, event) {
        const rect = Svg.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };

    //---mouse event handlers end
    function resizeHandler(event) {
        reInit();
    };

    //---
    init();
};
