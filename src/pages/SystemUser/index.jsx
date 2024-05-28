import React, { useEffect, useState } from 'react'
import MyHeader from '../../components/myHeader'
import MyTable from '../../components/myTable'
import api from '../../api'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Input,
  Select,
  Form,
  Button,
  Divider,
  Modal,
  message,
  Upload
} from 'antd'
const { TextArea } = Input
const { Option, OptGroup } = Select

export default function SystemUser() {
  const [form] = Form.useForm()

  const [departmentId, setDepartmentId] = useState(0)
  const [title, setTitle] = useState('')
  const [option, setOption] = useState([])
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const [loading, setLoading] = useState(false)
  const [visibility, setVisibility] = useState(false)
  const [moduleTitle, setModuleTitle] = useState('')
  const [moduleItem, setModuleItem] = useState({})
  const [imageUrl, setImageUrl] = useState('')
  function getTemaList() {
    let params = {
      pageNum: 1,
      pageSize: 999,
      title: ''
    }
    api.getTemaList(params).then((res) => {
      setOption(res.data.list)
    })
  }
  function getDoctorList(curren = 1) {
    setLoading(true)
    let params = {
      pageNum: current,
      pageSize: 8,
      title: title,
      departmentId: departmentId ? departmentId : 0
    }
    api
      .getDoctorList(params)
      .then((res) => {
        let r = res.data.list.map((item, index) => {
          return {
            ...item,
            key: index + 1
          }
        })
        setData(r)
        setTotal(res.data.count)
      })
      .finally(() => {
        setLoading(false)
      })
    setCurrent(curren)
  }
  function handleOk() {
    form.validateFields().then((value) => {
      let {
        title,
        doctorDesc,
        doctorExpertise,
        departmentId,
        professionalTitle
      } = value
      let formData = new FormData()
      formData.append('title', title)
      formData.append('doctorDesc', doctorDesc)
      formData.append('doctorExpertise', doctorExpertise)
      formData.append('departmentId', departmentId)
      formData.append('professionalTitle', professionalTitle)
      formData.append('image', imageUrl)
      if (moduleTitle === '新增') {
        api
          .addDoctor(formData)
          .then((res) => {
            if (res.code === 200) {
              message.success('医生添加成功')
              getDoctorList()
            } else {
              message.error('医生添加失败')
            }
          })
          .finally(() => setVisibility(false))
      } else {
        formData.append('id', moduleItem.id)
        api
          .editDoctor(formData)
          .then((res) => {
            if (res.code === 200) {
              message.success('医生修改成功')
              getDoctorList()
            } else {
              message.error('医生修改失败')
            }
          })
          .finally(() => setVisibility(false))
      }
    })
  }
  useEffect(() => {
    getTemaList()
    getDoctorList()
  }, [])
  const formHTML = (
    <Form layout="inline">
      <Form.Item>
        <Select
          style={{ width: 200 }}
          allowClear
          onChange={(value) => setDepartmentId(value)}
          placeholder="请选择归属科室"
        >
          {
            <React.Fragment>
              {option.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.title}
                  </Option>
                )
              })}
            </React.Fragment>
          }
        </Select>
      </Form.Item>
      <Form.Item>
        <Input
          style={{ width: 200 }}
          onInput={(e) => setTitle(e.target.value)}
          placeholder="请输入医生姓名"
        ></Input>
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={() => getDoctorList()}>
          查询
        </Button>
      </Form.Item>
    </Form>
  )
  const columns = [
    {
      title: '序号',
      width: 100,
      ellipsis: true,
      dataIndex: 'key',
      key: 1
    },

    {
      title: '姓名',
      dataIndex: 'doctorName',
      key: 2,
      ellipsis: true,
      width: 100
    },
    {
      title: '医生简介',
      dataIndex: 'doctorDesc',
      key: 3,
      ellipsis: true
    },
    {
      title: '职称',
      dataIndex: 'professionalTitle',
      key: 4,
      ellipsis: true,
      width: 100
    },
    {
      title: '擅长领域',
      dataIndex: 'doctorExpertise',
      key: 5,
      ellipsis: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 6,
      ellipsis: true,
      width: 250
    },
    {
      title: '归属科室',
      dataIndex: 'departmentTitle',
      key: 7,
      ellipsis: true,
      width: 150
    },
    {
      title: '操作',
      key: 8,
      width: 200,
      render: (text, record) => {
        return (
          <div>
            <Button
              style={{ padding: 0 }}
              type="link"
              onClick={() => {
                let obj = {
                  ...record,
                  title: record.doctorName
                }
                setModuleTitle('修改')
                setModuleItem(obj)
                setVisibility(true)
                form.setFieldsValue(obj)
                setImageUrl(obj.image)
              }}
            >
              修改
            </Button>
            <Divider style={{ visibility: 'hidden' }} type="vertical" />
            <Button
              style={{ padding: 0 }}
              type="link"
              onClick={() => {
                api.deleteDoctor(record.id).then((res) => {
                  if (res.code === 200) {
                    message.success('删除成功')
                    getDoctorList()
                  } else {
                    message.error('删除失败')
                  }
                })
              }}
            >
              删除
            </Button>
          </div>
        )
      }
    }
  ]
  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('必须上传图片')
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('图片大小不能超过2MB')
      return false
    }
    let formData = new FormData()
    formData.append('image', file)
    api.uploadDoctor(formData).then((res) => {
      if (res.code === 200) {
        setImageUrl(res.data)
        message.success('图片上传成功')
      } else {
        message.error('图片上传失败')
      }
    })
  }
  return (
    <div>
      <MyHeader formHTML={formHTML}></MyHeader>
      <MyTable
        onAdd={() => {
          setVisibility(true)
          setModuleTitle('新增')
          form.resetFields()
          setImageUrl('')
        }}
        columns={columns}
        data={data}
        total={total}
        current={current}
        loading={loading}
        onCurrent={(current) => {
          getDoctorList(current)
        }}
      ></MyTable>
      <Modal
        width={800}
        onOk={handleOk}
        title={moduleTitle}
        open={visibility}
        cancelText="取消"
        okText="确定"
        onCancel={() => setVisibility(false)}
      >
        <Form form={form} labelCol={{ span: 3 }} labelAlign={'right'}>
          <Form.Item
            label="医生姓名"
            name="title"
            rules={[{ required: true, message: '请输入医生姓名' }]}
          >
            <Input placeholder="请输入医生姓名"></Input>
          </Form.Item>
          <Form.Item
            label="归属科室"
            name="departmentId"
            rules={[{ required: true, message: '请选择归属科室' }]}
          >
            <Select style={{ width: 200 }} placeholder="请选择归属科室">
              {
                <React.Fragment>
                  {option.map((item) => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.title}
                      </Option>
                    )
                  })}
                </React.Fragment>
              }
            </Select>
          </Form.Item>
          <Form.Item
            label="职称"
            name="professionalTitle"
            rules={[{ required: true, message: '请选择职称' }]}
          >
            <Select style={{ width: 200 }} placeholder="请选择职称">
              <Option key="1" value="实习医师">
                实习医师
              </Option>
              <Option key="2" value="住院医师">
                住院医师
              </Option>
              <Option key="3" value="主治医师">
                主治医师
              </Option>
              <Option key="4" value="副主任医师">
                副主任医师
              </Option>
              <Option key="5" value="主任医师">
                主任医师
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="医生简介"
            name="doctorDesc"
            rules={[{ required: true, message: '请输入医生简介' }]}
          >
            <TextArea rows={10} placeholder="请输入医生简介"></TextArea>
          </Form.Item>
          <Form.Item
            label="擅长领域"
            name="doctorExpertise"
            rules={[{ required: true, message: '请输入擅长领域' }]}
          >
            <TextArea rows={10} placeholder="请输入擅长领域"></TextArea>
          </Form.Item>
          <Form.Item label="医生头像" name="image">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="avatar"
                  style={{
                    width: '100%'
                  }}
                />
              ) : (
                <div>
                  <PlusOutlined />
                  <div
                    style={{
                      marginTop: 8
                    }}
                  >
                    上传头像
                  </div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
