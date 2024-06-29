import React, { useEffect, useState, useRef } from 'react'
import { Table, Button, Modal, Switch, } from 'antd'
import axios from 'axios';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import UserForm from '../../../components/sandbox/user-manage/UserForm';

export default function UserList() {
  const { confirm } = Modal
  const [dataSource, setdataSource] = useState([])
  const [isFormOpen, setisFormOpen] = useState(false)
  const [regionList, setregionList] = useState([])
  const [roleList, setroleList] = useState([])
  const addForm = useRef(null)
  const updateForm = useRef(null)
  const [isUpdate, setisUpdate] = useState(false)
  const [currentId, setcurrentId] = useState(0)
  const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
  const {roleId,region,username} = JSON.parse(localStorage.getItem("token"))
  
  
  useEffect(() => {
    const roleObj = {
      "1":"superadmin",
      "2":"admin",
      "3":"editor"
    }
    axios.get("/users?_expand=role").then(res =>
      {
        const list = res.data
        setdataSource(roleObj[roleId]==="superadmin"?list:[
          ...list.filter(item=>item.username===username),
          ...list.filter(item=>item.region===region&&roleObj[item.roleId]==="editor")
        ])
      }
    )
  }, [roleId,region,username])
  useEffect(() => {
    axios.get("/regions").then(res =>
      setregionList(res.data)
    )
  }, [])
  useEffect(() => {
    axios.get("/roles").then(res =>
      setroleList(res.data)
    )
  }, [])
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item => ({
          text: item.title,
          value: item.value
        })),
        {
          text: "全球",
          value: "全球"
        }
      ],
      onFilter: (value, item) => 
        {
           if(value==="全球"){
              return item.region === ""
           }
           return item.region === value
        },
      render: (region) => {
        if (region === '') {
          region = "全球"
        }
        return <b>{region}</b>
      }

    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role.roleName
      }

    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: "roleState",
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={() => { handleChange(item) }} />
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div><Button danger shape="round" icon={<DeleteOutlined />} onClick={() => delConfirm(item)} disabled={item.id === 1} />
          <Button type="primary" shape="round" icon={<EditOutlined />} disabled={item.id === 1} onClick={() => { handleUpdate(item) }} />
        </div>
      }
    },
  ]
  const handleChange = (item) => {
    item.roleState = !item.roleState
    setdataSource([...dataSource])
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState
    })
  }
  const delConfirm = (item) => {
    confirm({
      title: "确定要删除吗?",
      content: "删除之后将不能恢复",
      onOk() { delOk(item) },
      onCancel() { }
    })
  };
  const delOk = (item) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/users/${item.id}`)
  }
  const handleOk = () => {
    addForm.current.validateFields().then(value => {
      setisFormOpen(false)
      addForm.current.resetFields()
      axios.post("/users", {
        ...value,
        "roleState": true,
        "default": false,
      }).then(res => {
        setdataSource([...dataSource, {
          ...res.data,
          role: roleList.filter(item => item.id === value.roleId)[0]
        }])
      })


    })
  }

  const handleCancel = () => {
    setisFormOpen(false)
  }
  const handleUpdate = (item) => {
    setTimeout(() => {
      if (item.roleId === 1) {
        setisUpdateDisabled(true)
      } else {
        setisUpdateDisabled(false)
      }

      updateForm.current.setFieldsValue(item)
    }, 0)
    setisUpdate(true)
    setcurrentId(item.id)
  }
  const handleUpdateOK = () => {
    updateForm.current.validateFields().then(value => {
      setTimeout(() => {
        setisUpdate(false)
      }, 0)
      setdataSource(dataSource.map(item => {
        if (item.id === currentId) {
          return {
            ...item,
            ...value,
            role: roleList.filter(item => item.id === value.roleId)[0]
          }
        }
        return item
      }))
      axios.patch(`/users/${currentId}`, {
        ...value
      })
      setisUpdateDisabled(!isUpdateDisabled)
    })
  }

  const handleUpdateCancel = () => {
    setisUpdateDisabled(!isUpdateDisabled)
    setTimeout(() => {
      setisUpdate(false)
    }, 0)

  }

  return (
    <div>
      <Button type="primary" onClick={() => { setisFormOpen(true) }}>添加用户</Button>
      <Modal title="添加用户" open={isFormOpen} okText="确定" cancelText="取消" onOk={handleOk} onCancel={handleCancel}>
        <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
      </Modal>
      <Modal title="更新用户" open={isUpdate} okText="更新" cancelText="取消" onOk={handleUpdateOK} onCancel={handleUpdateCancel}>
        <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled} isUpdate={true}></UserForm>
      </Modal>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={(item) => item.id}/>
    </div>
  )
}
