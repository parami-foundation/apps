import { useEffect, useState } from 'react'

export default () => {
    const [bodyHeight, setBodyHeight] = useState(document.body.clientHeight);
    const [bodyWidth, setBodyWidth] = useState(document.body.clientWidth);

    // 监听窗口尺寸变化
    useEffect(() => {
        const changeHeight = () => setBodyHeight(document.body.clientHeight);
        window.addEventListener('resize', changeHeight)
        return () => window.removeEventListener('resize', changeHeight);
    }, []);

    useEffect(() => {
        const changeWidth = () => setBodyWidth(document.body.clientHeight);
        window.addEventListener('resize', changeWidth)
        return () => window.removeEventListener('resize', changeWidth);
    }, []);

    return {
        bodyHeight,
        bodyWidth
    }
}