import React, { useEffect, useState } from 'react'
import { FloatButton, Descriptions,notification } from 'antd'
import { LeftOutlined, HeartTwoTone } from "@ant-design/icons"
import axios from 'axios'
import moment from 'moment'
export default function NewDetail(props) {
  const [api, contextHolder] = notification.useNotification()
  const [previewInfo, setpreviewInfo] = useState({})
  const [isClick, setisClick] = useState(true)
  useEffect(() => {
    axios.get(`/news/${props.match.params.id}?_expand=role&_expand=category`).then(res => {
      setpreviewInfo({
        ...res.data,
        view: res.data.view + 1
      })
      return res.data
    }).then(res => {
      axios.patch(`/news/${props.match.params.id}`, {
        view: res.view + 1
      })
    })
  }, [props.match.params.id])
  const items = [
    {
      key: '1',
      label: '创建者',
      children: previewInfo.author,
    },
    {
      key: '2',
      label: '发布时间',
      children: previewInfo.publishTime ? moment(previewInfo.publishTime).format("YYYY/MM/DD HH:mm:ss") : "-",
    },
    {
      key: '3',
      label: '区域',
      children: previewInfo.region,
    },
    {
      key: '4',
      label: '访问数量',
      children: previewInfo.view,
    },
    {
      key: '5',
      label: '点赞数量',
      children: previewInfo.star,
    },
    {
      key: '6',
      label: '评论数量',
      children: 0,
    },
  ];
  const handlieLike = () => {
    if (isClick) {
      setpreviewInfo({
        ...previewInfo,
        "star": previewInfo.star + 1
      })
      axios.patch(`/news/${props.match.params.id}`, {
        "star": previewInfo.star + 1
      })
      setisClick(false)
      api["success"]({
        duration:1,
        message: `点赞成功`,
        placement:"top"
    }) }else {
      api["warning"]({
        duration:2,
        message: '您已赞过',
        placement:"top"
    })
  }}
  return (
    <div>
      {contextHolder}
      <FloatButton onClick={() => {
        window.history.back()
      }} type="primary" tooltip={<div>返回</div>} icon={<LeftOutlined />} />
      <Descriptions title={<div>{previewInfo.title}-<span style={{ color: 'gray', fontSize: '13px' }} >{previewInfo?.category?.title} </span><span><HeartTwoTone twoToneColor="#eb2f96" onClick={handlieLike} /></span></div>} items={items} />
      <div style={{ border: "1px solid blue", height: "50vh" }}
        dangerouslySetInnerHTML={{
          __html: previewInfo.content
        }}
      />
    </div>
  )}
