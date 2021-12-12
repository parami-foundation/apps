import { useEffect, useState } from 'react'

export default () => {
    const [bodyHeight, setBodyHeight] = useState(document.body.clientHeight)
    // 监听窗口尺寸变化
    useEffect(() => {
        const changeHeight = () => setBodyHeight(document.body.clientHeight)
        window.addEventListener('resize', changeHeight)
        return () => window.removeEventListener('resize', changeHeight)
    }, [])

    return bodyHeight
}