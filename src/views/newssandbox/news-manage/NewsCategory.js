import React, { useEffect, useState, useContext, useRef } from 'react'
import { Table, Button, Form, notification, Input } from 'antd'
import { DeleteOutlined, } from '@ant-design/icons'
import axios from 'axios';

export default function Audit() {
  const [api, contextHolder] = notification.useNotification()
  const [dataSource, setdataSource] = useState([])
  useEffect(() => {
    axios.get(`/categories`).then(res => {
      setdataSource(res.data)
    })
  }, [])
  const EditableContext = React.createContext(null);
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current?.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  }
  const handleSave = (record) => {
    setdataSource(dataSource.map(item => {
      if (item.id === record.id) {
        return {
          id: item.id,
          title: record.title,
          value: record.value
        }
      }return item
    }))
    axios.patch(`/categories/${record.id}`, {
      title: record.title,
      value: record.value
    })
  }
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }

    },
    {
      title: '新闻分类',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: "title",
        title: "新闻分类",
        handleSave
      })
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => { deleteCategory(item) }} />
        </div>
      }
    },
  ]

  const deleteCategory = (item) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/news/${item.id}`).then(res => {
      api.info({
        message: `通知`,
        description: "您已删除此条分类",
        placement: 'bottomRight',
      })
    })
  }

  return (
    <div>
      {contextHolder}
      <Table components={components}
        rowClassName={() => 'editable-row'} dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
    </div>
  )
}

