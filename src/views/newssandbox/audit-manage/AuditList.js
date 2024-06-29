import React, { useEffect, useState } from 'react'
import { Table, Button, Tag, Modal, notification } from 'antd'
import axios from 'axios';

export default function AuditList(props) {
  const [api, contextHolder] = notification.useNotification()
  const { confirm } = Modal
  const [dataSource, setdataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      setdataSource(res.data)
    })
  }, [username])
  const auditList = ["未审核", "审核中", "已通过", "未通过"]
  const colorList = ["orange", "blue", "green", "red"]
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',

    },
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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        return <div><Tag color={colorList[auditState]} >{auditList[auditState]}</Tag></div>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          {
            item.auditState===2&&<Button danger onClick={() => { uploadNews(item) }} >发布</Button>
          }
          {
            item.auditState===1&&<Button type="dashed"  onClick={() => { delConfirm(item) }} >撤销</Button>
          }
          {
            item.auditState===3&&<Button type="primary" onClick={() => { updateNews(item) }} >修改</Button>
          }
        </div>
      }
    },
  ]
  const delConfirm = (item) => {
    confirm({
      title: "确定要删除吗?",
      content: "删除之后将不能恢复",
      onOk() { handleOk(item) },
      onCancel() { }
    })
  };
  const handleOk = (item) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`,{
      auditState:0
    }).then(res=>{
      api.info({
        message: `通知`,
        description: `您可以到草稿箱查看您的新闻`,
        placement: 'bottomRight',
      })
    })
  }
  const updateNews = (item) => {
    props.history.push(`/news-manage/update/${item.id}`)
  }
  const uploadNews = (item) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      "publishState": 2,
      "publishTime":Date.now()
    }).then(res => {
      setTimeout(() => {
        props.history.push('/publish-manage/published')
      }, 1000)
      api.info({
        message: `通知`,
        description: `您可以到[发布管理-已发布]中查看您的新闻`,
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
