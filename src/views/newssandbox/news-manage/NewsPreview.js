import React, { useEffect, useState } from 'react'
import { FloatButton, Descriptions } from 'antd'
import { LeftOutlined } from "@ant-design/icons"
import axios from 'axios'
import moment from 'moment'

export default function NewsPreview(props) {
  const [previewInfo, setpreviewInfo] = useState({})
  useEffect(() => {
    axios.get(`/news/${props.match.params.id}?_expand=role&_expand=category`).then(res => {
      setpreviewInfo(res.data)
    })
  }, [props.match.params.id])
  const auditList = ["未审核", "审核中", "已通过", "未通过"]
  const publishList = ["未发布", "待发布", "已上线", "已下线"]
  const colorList = ["orange", "blue", "grenn", "red"]
  const items = [
    {
      key: '1',
      label: '创建者',
      children: previewInfo.author,
    },
    {
      key: '2',
      label: '创建时间',
      children: moment(previewInfo.createTime).format("YYYY/MM/DD HH:mm:ss"),
    },
    {
      key: '3',
      label: '发布时间',
      children: previewInfo.publishTime ? moment(previewInfo.publishTime).format("YYYY/MM/DD HH:mm:ss") : "-",
    },
    {
      key: '4',
      label: '区域',
      children: previewInfo.region,
    },
    {
      key: '5',
      label: '审核状态',
      children: <span style={{ color: colorList[previewInfo.auditState] }}>{auditList[previewInfo.auditState]}</span>,
    },
    {
      key: '6',
      label: '发布状态',
      children: <span style={{ color: colorList[previewInfo.publishState] }}>{publishList[previewInfo.publishState]}</span>,
    },
    {
      key: '7',
      label: '访问数量',
      children: 0,
    },
    {
      key: '8',
      label: '点赞数量',
      children: 0,
    },
    {
      key: '9',
      label: '评论数量',
      children: 0,
    },
  ];
  return (
    <div>
      <FloatButton onClick={() => {
        window.history.back()
      }} type="primary" tooltip={<div>返回</div>} icon={<LeftOutlined />} />
      <Descriptions title={<div>{previewInfo.title}-<span style={{color:'gray',fontSize:'13px'}}>{previewInfo?.category?.title}</span></div>} items={items} />
      <div style={{ border: "1px solid blue", height: "50vh" }}
        dangerouslySetInnerHTML={{
          __html: previewInfo.content
        }}
      />

    </div>
  )
}
