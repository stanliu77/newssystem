import React, { useEffect, useState } from 'react'
import { Layout, Menu, } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  FileTextOutlined,
  ToolOutlined,
  EditOutlined,
  UnorderedListOutlined,
  DeleteOutlined,
  HighlightOutlined,
  ZoomInOutlined,
  DesktopOutlined ,
  ImportOutlined ,
  FileDoneOutlined,
  EyeInvisibleOutlined,
  BarsOutlined
} from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';

const { Sider } = Layout;

function SideMenu(props) {
  const selectKey = [props.location.pathname]
  const openKey = ["/"+props.location.pathname.split("/")[1]]
  const [menu, setMenu] = useState([])
  const {role:{rights}} = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res =>
      setMenu(transformList(res.data))
    )
  }, [])
  const checkPage = (item) =>{
      return item.pagepermisson&&rights.includes(item.key)
  }
  const transformList = (data) => {
    return data.map(item=>{ 
      const { rightId, ...restProps } = item
      if (checkPage(item)){
      return {
      ...restProps,
      icon:iconList[item.key],
      label: item.title,
      children: item.children && item.children.length > 0 ? transformList(item.children) : undefined
    }}
    return null
    }).filter(item=>item!=null)
  }
  
  const iconList = {
    "/home": <HomeOutlined />,
    "/user-manage": <SettingOutlined />,
    "/user-manage/list": <UserOutlined />,
    "/right-manage": <ToolOutlined />,
    "/right-manage/role/list": <UserOutlined />,
    "/right-manage/right/list": <UserOutlined />,
    '/news-manage':<FileTextOutlined/>,
    '/news-manage/add':<EditOutlined/>,
    '/news-manage/draft':<DeleteOutlined/>,
    '/news-manage/category':<UnorderedListOutlined/>,
    '/audit-manage':<HighlightOutlined/>,
    '/audit-manage/list':<BarsOutlined/>,
    '/audit-manage/audit':<ZoomInOutlined/>,
    '/publish-manage':<DesktopOutlined />,
    '/publish-manage/unpublished':<ImportOutlined />,
    '/publish-manage/published':<FileDoneOutlined/>,
    '/publish-manage/sunset':<EyeInvisibleOutlined/>,
    
    

  }
  const handler = (evt) => {
    return props.history.push(evt.key)

  }
  return (
    <Sider trigger={null} collapsible collapsed={props.isfold}>
      <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div className="demo-logo-vertical">全球新闻发布管理系统</div>
      <div style={{flex:1,overflow:'auto'}}><Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectKey}
        defaultOpenKeys={openKey}
        items={menu}
        onClick={handler} 
      />
      </div>
      </div>
    </Sider>
  )
}
const mapStateToProps = (state) =>{
  return{
    isfold:state.sider.isfold
  }
}
export default connect(mapStateToProps)(withRouter(SideMenu))

