import React from 'react'
import PublishInfo from '../../../components/sandbox/publish-manage/PublishInfo'
import { Button } from 'antd'
import usePublish from '../../../components/sandbox/publish-manage/usePublish'
export default function Sunset() {
  let {dataSource,handleDel} = usePublish(3)
  return (
    <div><PublishInfo dataSource={dataSource} button={(item)=><Button onClick={()=>{handleDel(item)}}type="primary">删除</Button>}></PublishInfo></div>
  )
}
