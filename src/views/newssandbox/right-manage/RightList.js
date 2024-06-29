import React, { useEffect, useState } from 'react'
import { Table, Button, Tag, Modal, Popover, Switch } from 'antd'
import axios from 'axios';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

export default function RightList() {
  const { confirm } = Modal
  const [dataSource, setdataSource] = useState([])
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {
      const list = res.data
      list.forEach(item => {
        if (item.children.length === 0) {
          item.children = ""
        }
      });
      setdataSource(list)
    })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',

    },
    {
      title: '权限名称',
      dataIndex: 'title',

    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <div><Tag color='orange'>{key}</Tag></div>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div><Button danger shape="round" icon={<DeleteOutlined />} onClick={() => { delConfirm(item) }} />
          <Popover content={<div style={{ textAlign: "center" }}>
            <Switch checked={item.pagepermisson} onChange={() => { switchMethod(item) }}></Switch>
          </div>} title="页面配置" trigger={item.pagepermisson === undefined ? '' : 'click'}>
            <Button type="primary" shape="round" icon={<EditOutlined />} disabled={item.pagepermisson === undefined} />
          </Popover>
        </div>
      }
    },
  ]
  const switchMethod = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    setdataSource([...dataSource])
    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    } else {
      axios.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    }

  }
  const delConfirm = (item) => {
    confirm({
      title: "确定要删除吗?",
      content: "删除之后将不能恢复",
      onOk() { handleOk(item) },
      onCancel(){}
    })
  };
  const handleOk = (item) => {
    if (item.grade === 1) {
      setdataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`/rights/${item.id}`)
    } else {
      let list = dataSource.filter(data => data.id === item.rightId)
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      setdataSource([...dataSource])
      axios.delete(`/children/${item.id}`)
    }
  };

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  )
}
