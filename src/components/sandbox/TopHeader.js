import React, { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Button, Layout, theme, Dropdown, Space, Avatar } from 'antd';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux"
import { sider } from '../../redux/reducer/siderSlice';
const { Header } = Layout;
function TopHeader(props) {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const {role:{roleName},username} = JSON.parse(localStorage.getItem("token"))
  const items = [
    {
      key: '1',
      label: (
        roleName
      ),
    },
    // {
    //   key: '2',
    //   label: (
    //     222
    //   ),
    // },
    // {
    //   key: '3',
    //   label: (
    //     333
    //   ),
    // },
    {
      key: '4',
      danger: true,
      label: (
      <div onClick={()=>{exit()}}>
        退出
      </div>)
    },
  ];
  const exit = () =>{
    localStorage.removeItem("token")
    props.history.replace("/login")

  }
  return (
    <Header style={{ padding: '0 16px', background: colorBgContainer }}>
      <Button
        type="text"
        icon={props.isfold ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(props.changeFold)}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
      <div style={{ float: 'right' }}>
        <span>欢迎<span style={{color:"red"}}>{username}</span>回来</span>
        <Dropdown
          menu={{
            items,
          }}
        >
          <Space>
            <Avatar size="large" icon={<UserOutlined />} />
          </Space>

        </Dropdown>
      </div>
    </Header>
  )
}
const mapStateToProps = (state) =>{
  return{
    isfold:state.sider.isfold
  }
}
const mapDispatchToProps = {
   changeFold:sider
      //  return{
      //   type:'sider'
      //  }

}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(TopHeader))
