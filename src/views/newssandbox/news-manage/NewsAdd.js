import React, { useEffect, useRef, useState } from 'react'
import { Typography, Form, Input, Select, Steps, Button, message, notification } from 'antd';
import axios from 'axios';
import style from './News.module.css'
import NewsEditor from '../../../components/sandbox/news-manage/NewsEditor';
const { Title } = Typography;

export default function NewsAdd(props) {
  const [api, contextHolder] = notification.useNotification()
  const USER = JSON.parse(localStorage.getItem('token'))
  const [formInfo, setformInfo] = useState("")
  const [content, setcontent] = useState("")
  const [titleList, settitleList] = useState([])
  const [current, setcurrent] = useState(0)
  const NewsForm = useRef(null)
  useEffect(() => {
    axios.get("/categories").then(res => {
      settitleList(res.data)
    })
  }, [])
  
  const handleNext = () => {
    if (current === 0) {
      NewsForm.current.validateFields().then(res => {
        setformInfo(res)

        setcurrent(current + 1)
      }).catch(error => {

      })
    } else {
      if (content === "" || content.trim() === "<p></p>") {
        message.info("新闻内容不能为空")
      } else {
        setcurrent(current + 1)
      }

    }

  }
  const handlePrevious = () => {
    setcurrent(current - 1)
  }
  const handleSave = (auditState) => {
    axios.post("/news", {
      ...formInfo,
      "content": content,
      "region": USER.region ? USER.region : "全球",
      "author": USER.username,
      "roleId": USER.roleId,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      // "publishTime": 1615778496314
    }).then(res => {
      setTimeout(() => {
        props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
      }, 1000)
      api.info({
        message: `通知`,
        description: `您可以到${auditState === 0 ? '草稿箱' : '审核列表中'}查看您的新闻`,
        placement: 'bottomRight',
      })
    })
  }
  return (
    <div><Title level={2}>撰写新闻</Title>
      {contextHolder}
      <Steps
        current={current}
        items={[
          {
            title: '基本信息',
            description: "新闻标题,新闻分类",
          },
          {
            title: '新闻内容',
            description: '新闻主体内容',
          },
          {
            title: '新闻提交',
            description: '保存草稿或者提交审核',
          },
        ]}
      />
      <div style={{ marginTop: "20px" }} className={current === 0 ? '' : style.active}>
        <Form
          ref={NewsForm}
          name="basic"
          labelCol={{
            span: 3,
          }}
          wrapperCol={{
            span: 21,
          }}
        >
          <Form.Item
            label="新闻标题"
            name="title"
            rules={[
              {
                required: true,
                message: '请输入你的新闻标题!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="新闻分类"
            name="categoryId"
            rules={[
              {
                required: true,
                message: '请输入你的新闻分类!',
              },
            ]}
          >
            <Select
              options={
                titleList.map(item => ({
                  key: item.id,
                  value: item.id,
                  label: item.title,
                }))
              }
            />
          </Form.Item>
        </Form>
      </div>
      <div style={{ marginTop: "20px" }} className={current === 1 ? '' : style.active}><NewsEditor getContent={(value) => {
        setcontent(value)
      }} /></div>
      <div style={{ marginTop: "20px" }} className={current === 2 ? '' : style.active}>333</div>
      <Button type='primary' className={current < 2 ? '' : style.active} onClick={() => { handleNext() }}>下一步</Button>
      <Button type='primary' className={current > 0 ? '' : style.active} onClick={() => { handlePrevious() }} >上一步</Button>
      <Button className={current === 2 ? '' : style.active} onClick={() => { handleSave(0) }}>保存草稿</Button>
      <Button danger className={current === 2 ? '' : style.active} onClick={() => { handleSave(1) }}>提交审核</Button>
    </div>
  )
}
