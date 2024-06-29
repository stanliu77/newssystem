import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Row, Avatar, List, Drawer } from 'antd';
import { InfoCircleOutlined, BarChartOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as echarts from 'echarts';
import _ from "lodash"
const { Meta } = Card
export default function Home() {
  const [viewList, setviewList] = useState([])
  const [likeList, setlikeList] = useState([])
  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem("token"))
  const barRef = useRef()
  const pieRef = useRef()
  const [open, setOpen] = useState(false)
  const [newsList, setnewsList] = useState([])
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=5`).then(res => {
      setviewList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=5`).then(res => {
      setlikeList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category').then(res => {
        setnewsList(res.data)
        renderBar(_.groupBy((res.data), item => item.category.title))
      
    })
    return () => {
      window.onresize = null
    }
  }, [])
  const renderBar = (obj) => {
    var chartDom = barRef.current;
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      title: {
        text: "新闻分类图示"
      },
      legend: {
        data: ["数量"],
        top: '10px'
      },
      xAxis: {
        axisLabel: {
          rotate: 45,
          interval: 0
        },
        type: 'category',
        data: Object.keys(obj)
      },
      yAxis: {
        type: 'value',
        minInterval: 1
      },
      series: [
        {
          name: "数量",
          data: Object.values(obj).map(item => item.length),
          type: 'bar',
          color: [
            '#2f4554'
          ]
        }
      ]
    };

    option && myChart.setOption(option);
    window.onresize = () => {
      myChart.resize()
    }
  }
  const renderPie = () => {
    const list = newsList.filter(item => item.author === username)
    var groupObj =  _.groupBy(list, item => item.category.title)
    var myChart
    var chartDom = pieRef.current;
    myChart = echarts.init(chartDom)
    var option;
    var dataList = []
    for(var i in groupObj){
      dataList.push({
        value:groupObj[i].length,
        name:i
      })
    }
    option = {
      title: {
        text: '当前用户新闻分类展示',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: dataList,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    option && myChart.setOption(option)
  }
  const handlePie = () => {
    setTimeout(()=>{
      renderPie()
    },0)
    setOpen(true)
}
  const onClose = () => {
    setOpen(false);
  }
  
  return (
    <div className='demo-logo-vertical'>
      <Row gutter={16}>
        <Col span={8}>
          <Card title={<div><span>用户最常浏览</span> <BarChartOutlined /></div>} bordered={false}>
            <List
              bordered={false}
              dataSource={viewList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title={<div><span>用户点赞最多</span> <BarChartOutlined /></div>} bordered={false}>
            <List
              bordered={false}
              dataSource={likeList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <InfoCircleOutlined key="info" onClick={() => handlePie()} />
            ]}
          >
            <Meta
              avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
              title={username}
              description={<div><span>{region ? region : "全球"}</span>  {roleName}</div>}
            />
          </Card>
        </Col>
      </Row>
      <div ref={barRef} style={{ width: "100%", height: "400px", marginTop: "20px" }}></div>
      <Drawer title="个人新闻分类" onClose={onClose} open={open} width="500px">
        <div ref={pieRef} style={{ width: "500px", height: "400px" }}></div>
      </Drawer>
    </div>
  )
}
