import React, { useEffect } from 'react'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import { Layout,theme} from 'antd'
import '../newssandbox/NewSandBox.css'
import NewsRouter from '../../components/sandbox/NewsRouter'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Spin } from 'antd'
import { connect } from 'react-redux'
const { Content } = Layout
function NewsSandBox(props) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  nProgress.start()
  useEffect(()=>{
    nProgress.done()
  })
  return (
    <Layout className='ant-layout'>
      <SideMenu></SideMenu>
      <Layout>
        <TopHeader></TopHeader>
        <Spin spinning={props.isload}>
        <Content style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
           
          }}>
          <NewsRouter></NewsRouter>
        </Content>
        </Spin>
      </Layout>
    </Layout>
  )
}
const mapStateToProps = (state)=>{
  return{
    isload:state.loading.isload
  }
}
export default connect(mapStateToProps)(NewsSandBox)