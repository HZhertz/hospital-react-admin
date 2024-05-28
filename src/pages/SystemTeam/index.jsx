import { Button, Form, Input, Select, Divider, message, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import MyHeader from '../../components/myHeader'
import MyTable from '../../components/myTable'
import api from "../../api"
const { TextArea } = Input;
export default function SystemTeam() {
    const [form] = Form.useForm();

    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [current, setCurrent] = useState(1)
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState("")
    const [visibility, setVisibility] = useState(false)
    const [moduleTitle, setModuleTitle] = useState("")
    const [moduleItem, setModuleItem] = useState({})
    const columns = [
        {
            title: '序号',
            width: 100,
            ellipsis: true,
            dataIndex: 'key',
            key: 1
        },

        {
            title: '科室标题',
            dataIndex: 'title',
            key: 2,
            ellipsis: true,
            width: 250
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 3,
            ellipsis: true,
            width: 250
        },
        {
            title: '科室简介',
            dataIndex: 'introduction',
            key: 4,
            ellipsis: true,
        },
        {
            title: '擅长领域',
            dataIndex: 'expertise',
            key: 5,
            ellipsis: true,
        },
        {
            title: '操作',
            key: 6,
            width: 200,
            render: (text, record) => {
                return (
                    <div>
                        <Button style={{ padding: 0 }} type='link' onClick={() => {
                            setVisibility(true)
                            setModuleTitle("修改")
                            setModuleItem(record)
                            form.setFieldsValue(record)
                        }}>修改</Button>
                        <Divider
                            style={{ visibility: 'hidden' }}
                            type="vertical"
                        />
                        <Button style={{ padding: 0 }} type='link' onClick={() => {
                            api.deleteTema(record.id).then(res => {
                                if (res.code === 200) {
                                    message.success("科室删除成功")
                                    getTemaList()
                                } else {
                                    message.error("科室删除失败")
                                }
                            })
                        }}>删除</Button>
                    </div>
                )
            }
        },
    ]
    function getTemaList(current = 1) {
        let params = {
            pageNum: current,
            pageSize: 8,
            title: title
        }
        setLoading(true)
        api.getTemaList(params).then(res => {
            if (res.code === 200) {
                let list = res.data.list.map((item, index) => {
                    return {
                        ...item,
                        key: index + 1
                    }
                })
                setData(list)
                setTotal(res.data.count)
            }
        }).finally(() => setLoading(false))
        setCurrent(current)
    }
    function handleOk() {
        form.validateFields().then(values => {
            let { title, introduction, expertise } = values
            let formData = new FormData()
            formData.append("title", title)
            formData.append("introduction", introduction)
            formData.append("expertise", expertise)
            if (moduleTitle == "新增") {
                api.addTema(formData).then(res => {
                    if (res.code === 200) {
                        message.success("科室添加成功")
                        getTemaList()
                        setVisibility(false)
                    } else {
                        message.error("科室添加失败")
                    }
                })
            } else {
                formData.append("id", moduleItem.id)
                api.editTema(formData).then(res => {
                    if (res.code === 200) {
                        message.success("科室修改成功")
                        getTemaList()
                        setVisibility(false)
                    } else {
                        message.error("科室修改失败")
                    }
                })
            }
        })
    }
    useEffect(() => {
        getTemaList()
    }, [])
    const formHTML = (
        <Form layout='inline'>
            <Form.Item>
                <Input onInput={(e) => setTitle(e.target.value)} placeholder='请输入科室名称'></Input>
            </Form.Item>
            <Form.Item>
                <Button type='primary' onClick={() => getTemaList()}>查询</Button>
            </Form.Item>
        </Form>
    )
    return (
        <div>
            <MyHeader formHTML={formHTML}></MyHeader>
            <MyTable onAdd={() => {
                setVisibility(true)
                setModuleTitle("新增")
                form.resetFields()
            }}
                loading={loading}
                columns={columns}
                data={data}
                total={total}
                current={current}
                onCurrent={(current) => {
                    getTemaList(current)
                }}></MyTable>

            <Modal width={800}
                title={moduleTitle}
                open={visibility}
                cancelText="取消"
                okText="确定"
                onCancel={() => setVisibility(false)}
                onOk={handleOk}>
                <Form form={form}>
                    <Form.Item label="科室名称" name="title" rules={[{ required: true, message: '请输入科室名称' }]}>
                        <Input placeholder='请输入科室名称'></Input>
                    </Form.Item>
                    <Form.Item label="科室简介" name="introduction" rules={[{ required: true, message: '请输入科室简介' }]}>
                        <TextArea rows={10} placeholder='请输入科室简介'></TextArea>
                    </Form.Item>
                    <Form.Item label="擅长领域" name="expertise" rules={[{ required: true, message: '请输入擅长领域' }]}>
                        <TextArea rows={10} placeholder='请输入擅长领域'></TextArea>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
