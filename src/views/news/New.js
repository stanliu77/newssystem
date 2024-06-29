import React, { useEffect, useState } from 'react'
import { Typography, Card, Col, Row, List } from 'antd';
import axios from 'axios';
import _ from "lodash"
const { Title } = Typography
export default function New() {
    const [newsObj, setnewsObj] = useState(null)
    useEffect(() => {
        axios.get(`/news?_expand=category`).then(res => {
            setnewsObj(_.groupBy(res.data, item => item.category.title))
        })
    }, [])
    const data = []
    for (var i in newsObj) {
        data.push({
            categoryName: i,
            title: newsObj[i].map(item => ({
                id: item.id,
                newsTitle: item.title
            }))
        })
    }
    return (
        <div style={{width:"95%",margin:"auto"}}>
            <Title level={2} style={{ margin: "40px" }}>全球大新闻 <span style={{ color: "gray", fontSize: "20px" }}>查看新闻</span></Title>
            <Row gutter={[16,16]}>
                {data.map(item => <Col span={8} key={item.categoryName}>
                    <Card title={item.categoryName} bordered={true} hoverable={true}>
                        <List dataSource={item.title}
                            renderItem={(title) => (
                                <List.Item key={title.id}>
                                    <a href={`#/detail/${title.id}`} >{title.newsTitle}</a>
                                </List.Item>
                            )}/>
                    </Card>
                </Col>)}
            </Row>
        </div>
    )
}
