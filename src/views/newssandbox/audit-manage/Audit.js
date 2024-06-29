import React, { useEffect, useState } from 'react'
import { Table, Button, Tag, notification } from 'antd'
import {CheckOutlined,CloseOutlined } from '@ant-design/icons'
import axios from 'axios';

export default function Audit(props) {
  const [api, contextHolder] = notification.useNotification()
  const [dataSource, setdataSource] = useState([])
  const {roleId,region,username} = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    const roleObj = {
      "1":"superadmin",
      "2":"admin",
      "3":"editor"
    }
    axios.get(`/news?auditState=1&_expand=category`).then(res =>
      {
        const list = res.data
        setdataSource(roleObj[roleId]==="superadmin"?list:[
          ...list.filter(item=>item.username===username),
          ...list.filter(item=>item.region===region&&roleObj[item.roleId]==="editor")
        ])
      }
    )
  }, [roleId,region,username])
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }

    },
    {
      title: '作者',
      dataIndex: 'author',


    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return <div><Tag color='orange'>{category.value}</Tag></div>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type="primary" shape="circle" icon={<CheckOutlined />} onClick={() => { agree(item) }} />
          <Button danger shape="circle" icon={<CloseOutlined />}onClick={() => { disagree(item) }} />
        </div>
      }
    },
  ]
  
  const agree = (item) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      "auditState":2,
      "publishState":1
    }).then(res => {
      api.info({
        message: `通知`,
        description:"您已通过本条新闻",
        placement: 'bottomRight',
      })
    })
  }
  const disagree = (item) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      "auditState":3,
      "publicState": 0
    }).then(res => {
      api.info({
        message: `通知`,
        description:"您已驳回本条新闻",
        placement: 'bottomRight',
      })
    })
  }
  return (
    <div>
      {contextHolder}
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
    </div>
  )
}

