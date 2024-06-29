import React, { forwardRef ,useEffect,useState} from 'react'
import { Form, Input, Select } from 'antd'
const UserForm = forwardRef((props,ref) => {
  const [isdisabled, setisdisabled] = useState(false)
  const {roleId,region} = JSON.parse(localStorage.getItem("token"))
  useEffect(()=>{
    setisdisabled(props.isUpdateDisabled)
  },[props.isUpdateDisabled])
  const roleObj = {
    "1":"superadmin",
    "2":"admin",
    "3":"editor"
  }
  
  const checkRegion = (item)=>{  
    if(props.isUpdate){
      if (roleObj[roleId]==="superadmin"){
        
        return false
     }else{
        return true
     }
    }else{
      if (roleObj[roleId]==="superadmin"){
        return false
     }else{
        return item.value!==region
     }
    } 
  }
  const checkRole = (item)=>{
    if(props.isUpdate){
      if (roleObj[roleId]==="superadmin"){
        return false
     }else{
        return true
     }
    }else{
      if (roleObj[roleId]==="superadmin"){
        return false
     }else{
        return roleObj[item.id]!== "editor"
     }
    } 
  }
  return (
    <Form layout='vertical'ref={ref}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="区域"
            name="region"
            rules={isdisabled?[]:[
              {
                required: true,
              },
            ]}
          >
            <Select disabled={isdisabled}
              options={
                props.regionList.map(item => {
                  return {
                    key:item.id,
                    value: item.value,
                    label: item.title,
                    disabled:checkRegion(item)
                  }
                })
              }
            />
          </Form.Item>
          <Form.Item
            label="角色"
            name="roleId"
            rules={[
              {
                required: true,

              },
            ]}
          >
            <Select onChange={(value)=>{
                if(value===1){
                    setisdisabled(true)
                    ref.current.setFieldsValue({
                        region:""
                    })
                }else{
                    setisdisabled(false)
                }
            }}
              options={
                props.roleList.map(item => {
                  return {
                    key:item.id,
                    value: item.id,
                    label: item.roleName,
                    disabled:checkRole(item)
                  }
                })
              }
            />
          </Form.Item>
        </Form>
  )
})
export default UserForm