import React, { useEffect, useState } from 'react'
import { Table, Button, Tag, Modal,notification} from 'antd'
import axios from 'axios';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons'


export default function NewsDraft(props) {
  const [api, contextHolder] = notification.useNotification()
  const { confirm } = Modal
  const [dataSource, setdataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=role&_expand=category`).then(res => {
      setdataSource(res.data)
    })
  }, [username])

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
      title: '操作',
      render: (item) => {
        return <div><Button danger shape="round" icon={<DeleteOutlined />} onClick={() => { delConfirm(item) }} />
          <Button shape="round" icon={<EditOutlined />} onClick={()=>{updateNews(item)}} />
          <Button type="primary" shape="round" icon={<UploadOutlined />} onClick={()=>{uploadNews(item)}} />

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
    axios.delete(`/news/${item.id}`)
  }
  const updateNews = (item) =>{
    props.history.push(`/news-manage/update/${item.id}`)
  }
  const uploadNews = (item) =>{
    axios.patch(`/news/${item.id}`, {
      "auditState": 1
    }).then(res => {
      setTimeout(() => {
        props.history.push('/audit-manage/list')
      }, 1000)
      api.info({
        message: `通知`,
        description: `您可以到审核列表中查看您的新闻`,
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
