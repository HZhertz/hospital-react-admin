import React, { useEffect, useState } from 'react'
import MyHeader from '../../components/myHeader'
import MyTable from '../../components/myTable'
import moment from 'moment'
import api from "../../api"
import { Input, Select, Form, Button, Divider, Upload, Checkbox, Modal, DatePicker, message, InputNumber } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import utils from "../../untils/tool"
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"
const { RangePicker } = DatePicker;
export default function SystemRotograph() {
    const [form] = useForm()
    const [imageUrl, setImageUrl] = useState("")
    const [content, setContent] = useState("")
    const [title, setTitle] = useState("")
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [current, setCurrent] = useState(1)
    const [visibility, setVisibility] = useState(false)
    const [moduleTitle, setModuleTitle] = useState("")
    const [moduleItem, setModuleItem] = useState({})

    function getSystemRotographList(current = 1) {
        let params = {
            pageNum: current,
            pageSize: 8,
            title
        }
        setLoading(true)
        api.getSystemRotographList(params).then(res => {
            if (res.code === 200) {
                let r = res.data.list.map((item, index) => {
                    return {
                        ...item,
                        key: index + 1
                    }
                })
                setData(r)
                setTotal(res.data.count)
            }
        }).finally(() => setLoading(false))
        setCurrent(current)
    }

    function beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('必须上传图片');
            return false
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小不能超过2MB');
            return false
        }
        let formData = new FormData()
        formData.append("image", file)
        api.addSystemRotographImage(formData).then(res => {
            if (res.code === 200) {
                setImageUrl(res.data)
                message.success("图片上传成功")
            } else {
                message.error("图片上传失败")
            }
        })
    }
    function handleOk() {
        form.setFieldValue("image", imageUrl)
        form.validateFields().then(value => {
            let { title, address, image, time } = value
            console.log(time)
            let formData = new FormData()
            formData.append("title", title)
            formData.append("address", address)
            formData.append("image", image)
            formData.append("startTime", time ? moment(time[0]).format("YYYY-MM-DD HH:mm:ss") : null)
            formData.append("endTime", time ? moment(time[1]).format("YYYY-MM-DD HH:mm:ss") : null)
            if (moduleTitle === "新增") {
                api.addSystemRotograph(formData).then(res => {
                    if (res.code === 200) {
                        message.success("新增成功")
                        getSystemRotographList()
                    } else {
                        message.error("新增失败")
                    }
                }).finally(() => setVisibility(false))
            } else {
                formData.append("id", moduleItem.id)
                api.editSystemRotograph(formData).then(res => {
                    if (res.code === 200) {
                        message.success("修改成功")
                        getSystemRotographList()
                    } else {
                        message.error("修改失败")
                    }
                }).finally(() => setVisibility(false))
            }
        })
    }
    useEffect(() => {
        getSystemRotographList()
    }, [])
    const formHTML = (
        <Form layout='inline'>
            <Form.Item>
                <Input style={{ width: 200 }} onInput={(e) => setTitle(e.target.value)} placeholder='请输入轮播图标题'></Input>
            </Form.Item>
            <Form.Item>
                <Button type='primary' onClick={() => getSystemRotographList()}>查询</Button>
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
            title: '标题',
            dataIndex: 'title',
            key: 2,
            ellipsis: true,
            width: 200
        },
        {
            title: '链接',
            dataIndex: 'address',
            key: 3,
            ellipsis: true,
        },
        {
            title: '创建人',
            dataIndex: 'username',
            key: 4,
            ellipsis: true,
            width: 200
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 5,
            ellipsis: true,
        },
        {
            title: '生效时间',
            dataIndex: 'startTime',
            key: 6,
            ellipsis: true,
            render: (text) => {
                let c = text === "null" ? null : text
                return (
                    <React.Fragment>
                        {c}
                    </React.Fragment>
                )
            }
        },
        {
            title: '失效时间',
            dataIndex: 'endTime',
            key: 7,
            ellipsis: true,
            render: (text) => {
                let c = text === "null" ? null : text
                return (
                    <React.Fragment>
                        {c}
                    </React.Fragment>
                )
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 8,
            ellipsis: true,
            width: 100,
            fixed: 'right',
        },
        {
            title: '操作',
            key: 9,
            width: 200,
            fixed: 'right',
            render: (text, record) => {
                return (
                    <div>
                        <Button onClick={() => {
                            let { title, address, image, startTime, endTime } = record
                            let info = {
                                title,
                                address,
                                time: [startTime != "null" ? moment(startTime) : null, endTime != "null" ? moment(endTime) : null]
                            }
                            setModuleTitle("修改")
                            setModuleItem(record)
                            setVisibility(true)
                            setImageUrl(image)
                            form.setFieldsValue(info)

                        }} style={{ padding: 0 }} type='link'>修改</Button>
                        <Divider
                            style={{ visibility: 'hidden' }}
                            type="vertical"
                        />
                        <Button onClick={() => {
                            api.deleteSystemRotograph(record.id).then(res => {
                                if (res.code === 200) {
                                    message.success("删除成功")
                                    getSystemRotographList()
                                } else {
                                    message.error("删除失败")
                                }
                            })
                        }} style={{ padding: 0 }} type='link'>删除</Button>
                    </div>
                )
            }
        },
    ]
    return (
        <div>
            <MyHeader formHTML={formHTML}></MyHeader>
            <MyTable
                onAdd={() => {
                    setVisibility(true)
                    setModuleTitle("新增")
                    setImageUrl("")
                    form.resetFields()
                }}
                columns={columns}
                data={data}
                loading={loading}
                total={total}
                current={current}
                oncurrent={getSystemRotographList}
                scroll={{
                    x: 1500,
                }}
            ></MyTable>
            <Modal
                onOk={handleOk}
                width={800}
                title={moduleTitle}
                open={visibility}
                cancelText="取消"
                okText="确定"
                onCancel={() => setVisibility(false)}>
                <Form form={form} labelCol={{ span: 3 }} labelAlign={"right"}>
                    <Form.Item label="轮播图标题" name="title" rules={[{ required: true, message: '请输入轮播图标题' }]}>
                        <Input placeholder='请输入轮播图标题' />
                    </Form.Item>
                    <Form.Item label="轮播图链接" name="address" rules={[{ required: true, message: '请输入轮播图链接' }]}>
                        <Input placeholder='请输入轮播图链接' />
                    </Form.Item>
                    <Form.Item label="生效时间" name="time" >
                        <RangePicker showTime />
                    </Form.Item>
                    <div style={{ position: "relative", color: 'rgb(255, 135, 49)', fontSize: 12, top: -10, left: 100 }}>时间如果不选择，则默认“即时生效”且“长期有效”</div>
                    <Form.Item label="图片上传" name="image" rules={[{ required: true, message: '请上传图片' }]}>
                        <Upload
                            name='avatar'
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
                                        width: '100%',
                                    }}
                                />
                            ) : (
                                <div>
                                    <PlusOutlined />
                                    <div
                                        style={{
                                            marginTop: 8,
                                        }}
                                    >
                                        上传图片
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
