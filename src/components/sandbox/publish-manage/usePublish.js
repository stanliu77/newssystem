import { useState, useEffect } from 'react'
import axios from 'axios';
function usePublish(type) {
    const [dataSource, setdataSource] = useState([])
    const { username } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res =>
            setdataSource(res.data)
        )
    }, [username, type])
    const handleDel = (item) => {
        setdataSource(dataSource.filter(data=>data.id!==item.id))
        axios.delete(`/news/${item.id}`)
    }
    const handleUpload = (item) => {
        setdataSource(dataSource.filter(data => data.id !== item.id))
        axios.patch(`/news/${item.id}`, {
            publishState: 2
        })
    }
    const handleHide = (item) => {
        setdataSource(dataSource.filter(data => data.id !== item.id))
        axios.patch(`/news/${item.id}`, {
            publishState: 3
        })
    }
    return ({
        dataSource,
        handleHide,
        handleUpload,
        handleDel

    })
}
export default usePublish 