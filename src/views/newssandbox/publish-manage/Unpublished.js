import React from 'react'
import PublishInfo from '../../../components/sandbox/publish-manage/PublishInfo'
import { Button } from 'antd'
import usePublish from '../../../components/sandbox/publish-manage/usePublish'
export default function Unpublished() {
  let {dataSource,handleUpload} = usePublish(1)
  return (
    <div><PublishInfo dataSource={dataSource} button={(item)=><Button onClick={()=>{handleUpload(item)}} type="primary">发布</Button>}></PublishInfo></div>
  )
}
