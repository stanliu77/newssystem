import React from 'react'
import { Table, Tag } from 'antd'


export default function PublishInfo(props) {
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
        return props.button(item)
      }
    },
  ]
  
  return (
    <div>
      <Table dataSource={props.dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
    </div>
  )
}


