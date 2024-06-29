import React from 'react'
import PublishInfo from '../../../components/sandbox/publish-manage/PublishInfo'
import { Button } from 'antd'
import usePublish from '../../../components/sandbox/publish-manage/usePublish'
export default function Published() {
  let {dataSource,handleHide} = usePublish(2)
  return (
    <div><PublishInfo dataSource={dataSource} button={(item)=><Button onClick={()=>{handleHide(item)}}type="primary">下线</Button>}></PublishInfo></div>
  )
}
