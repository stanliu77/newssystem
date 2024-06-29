import React,{useState,useEffect} from 'react'
import {Table,Button,Modal,Tree} from 'antd'
import{DeleteOutlined,EditOutlined} from '@ant-design/icons'
import axios from 'axios'
export default function RoleList() {
  const { confirm } = Modal
  const [dataSource, setdataSource] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [roleList, setroleList] = useState([])
  const [currentList, setcurrentList] = useState([])
  const [currentId, setcurrentId] = useState(0)
  useEffect(() => {
    axios.get("/roles").then(res=>{
      setdataSource(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res=>{
      setroleList(res.data)
    })
  }, [])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render:(item)=>{
        return <b>{item}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: '操作',
      render: (item) => {
        return <div><Button danger shape="round" icon={<DeleteOutlined  />} onClick={() => { delConfirm(item) }}/>
            <Button type="primary" shape="round" icon={<EditOutlined onClick={() => { 
              setIsModalOpen(true)
              setcurrentList(item.rights)
              setcurrentId(item.id)
              }}/>} />
        </div>
      }
    }
  ]
  const delConfirm = (item) => {
    confirm({
      title: "确定要删除吗?",
      content: "删除之后将不能恢复",
      onOk() {delOk(item) },
      onCancel(){}
    })
  };
  const delOk = (item) => {
      setdataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`/roles/${item.id}`)
  }
  const handleOk = () => {
    setIsModalOpen(false)
    setdataSource(dataSource.map(item=>{
      if(item.id===currentId){
        return{
          ...item,
          rights:currentList
        }
      }
      return item
    }))
    axios.patch(`/roles/${currentId}`,{
      rights:currentList
    })
  }
  const handleCancel = () => {
    setIsModalOpen(false);
  }
  const onCheck= (checkedkeys) =>{
    setcurrentList(checkedkeys.checked)
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id} />
      <Modal title="权限分配" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree
      checkable
      checkedKeys={currentList}
      onCheck={onCheck}
      treeData={roleList}
      checkStrictly={true}
    />
      </Modal>
    </div>
  )
}
