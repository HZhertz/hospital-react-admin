import React, { useEffect, useState } from 'react'
import MyHeader from '../../components/myHeader'
import MyTable from '../../components/myTable'
import api from "../../api"
import _ from 'lodash'
import moment from 'moment';
import { Input, Select, Form, Button, Divider, Modal, DatePicker, message, InputNumber } from 'antd'
const { TextArea } = Input
const { Option, OptGroup } = Select;
export default function SystemRegister() {
    const [form] = Form.useForm();

    const [option, setOption] = useState([])
    const [doctorOption, setDoctorOption] = useState({})
    const [departmentId, setDepartmentId] = useState(0)
    const [title, setTitle] = useState("")
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [current, setCurrent] = useState(1)
    const [visibility, setVisibility] = useState(false)
    const [moduleTitle, setModuleTitle] = useState("")
    const [moduleItem, setModuleItem] = useState({})
    function getTemaList() {
        let params = {
            pageNum: 1,
            pageSize: 999,
            title: ""
        }
        api.getTemaList(params).then(res => {
            setOption(res.data.list)
        })
    }
    function getDoctorList() {
        let params = {
            pageNum: 1,
            pageSize: 999,
            title: "",
            departmentId: 0
        }
        api.getDoctorList(params).then(res => {
            let r = _.groupBy(res.data.list, (item) => item.departmentTitle)
            setDoctorOption(r)
        })
    }
    function getRegisterList(current = 1) {
        setLoading(true)
        let params = {
            pageNum: current,
            pageSize: 8,
            title: title,
            departmentId: departmentId ? departmentId : 0
        }
        api.getRegisterList(params).then(res => {
            if (res.code === 200) {
                let r = res.data.list.map((item, index) => {
                    return {
                        key: index + 1,
                        ...item
                    }
                })
                setData(r)
                setTotal(res.data.count)
            }
        }).finally(() => setLoading(false))
        setCurrent(current)
    }
    function handleOk() {
        form.validateFields().then(value => {
            let { doctorId, sittingTime, sittingNum } = value
            let formData = new FormData()
            formData.append("doctorId", doctorId)
            formData.append("sittingTime", moment(sittingTime).format("YYYY-MM-DD"))
            formData.append("sittingNum", sittingNum)
            if (moduleTitle === "新增") {
                api.addRegister(formData).then(res => {
                    if (res.code === 200) {
                        message.success("新增成功")
                        getRegisterList()

                    } else {
                        message.error(res.message || "新增失败")
                    }
                }).finally(() => setVisibility(false))
            } else {
                formData.append("id", moduleItem.id)
                api.editRegister(formData).then(res => {
                    if (res.code === 200) {
                        message.success("修改成功")
                        getRegisterList()

                    } else {
                        message.error(res.message || "修改失败")
                    }
                }).finally(() => setVisibility(false))

            }
        })
    }
    useEffect(() => {
        getTemaList()
        getRegisterList()
        getDoctorList()
    }, [])
    const formHTML = (
        <Form layout='inline'>
            <Form.Item>
                <Select
                    style={{ width: 200 }}
                    allowClear
                    onChange={(value) => setDepartmentId(value)}
                    placeholder='请选择归属科室'>
                    {
                        <React.Fragment>
                            {
                                option.map(item => {
                                    return (
                                        <Option key={item.id} value={item.id}>{item.title}</Option>
                                    )
                                })
                            }
                        </React.Fragment>
                    }
                </Select>
            </Form.Item>
            <Form.Item>
                <Input style={{ width: 200 }} onInput={(e) => setTitle(e.target.value)} placeholder='请输入医生姓名'></Input>
            </Form.Item>
            <Form.Item>
                <Button type='primary' onClick={() => getRegisterList()}>查询</Button>
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
        },
        {
            title: '职称',
            dataIndex: 'professionalTitle',
            key: 3,
            ellipsis: true,
        },
        {
            title: '归属科室',
            dataIndex: 'departmentTitle',
            key: 4,
            ellipsis: true,
        },
        {
            title: '坐诊时间',
            dataIndex: 'sittingTime',
            key: 5,
            ellipsis: true,
        },
        {
            title: '挂号数量',
            dataIndex: 'sittingNum',
            key: 6,
            ellipsis: true,
        },
        {
            title: '剩余数量',
            dataIndex: 'surplusSittingNum',
            key: 6,
            ellipsis: true,
        },
        {
            title: '操作',
            key: 7,
            width: 200,
            render: (text, record) => {
                let disable = false
                if (moment().endOf("day").format("YYYY-MM-DD") >= record.sittingTime) disable = true
                return (
                    <div>
                        <Button style={{ padding: 0 }} disabled={disable} type='link' onClick={() => {
                            setVisibility(true)
                            setModuleTitle("修改")
                            let r = {
                                ...record,
                                sittingTime: moment(record.sittingTime)
                            }
                            setModuleItem(r)
                            form.setFieldsValue(r)
                        }}>修改</Button>
                        <Divider
                            style={{ visibility: 'hidden' }}
                            type="vertical"
                        />
                        <Button style={{ padding: 0 }} type='link' onClick={() => {
                            api.deleteRegister(record.id).then(res => {
                                if (res.code === 200) {
                                    message.success("删除成功")
                                    getRegisterList()
                                } else {
                                    message.error("删除失败")
                                }
                            })
                        }}>删除</Button>
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
                    form.resetFields()
                }}
                columns={columns}
                data={data}
                loading={loading}
                total={total}
                current={current}
                onCurrent={(current) => {
                    getRegisterList(current)
                }}
            ></MyTable>
            <Modal width={800}
                onOk={handleOk}
                title={moduleTitle}
                open={visibility}
                cancelText="取消"
                okText="确定"
                onCancel={() => setVisibility(false)}>
                <Form form={form} labelCol={{ span: 3 }} labelAlign={"right"}>
                    <Form.Item label="坐诊医生" name="doctorId" rules={[{ required: true, message: '请选择医生' }]}>
                        <Select
                            style={{ width: 200 }}
                            showSearch
                            optionFilterProp="children"
                            placeholder='请选择医生'>
                            {
                                <React.Fragment>
                                    {
                                        Object.keys(doctorOption).map(key => {
                                            return <OptGroup key={key} label={key}>
                                                {
                                                    doctorOption[key].map(item => {
                                                        return (
                                                            <Option key={item.id} value={item.id}>{item.doctorName}</Option>

                                                        )
                                                    })
                                                }
                                            </OptGroup>
                                        })
                                    }
                                </React.Fragment>
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="坐诊日期" name="sittingTime" rules={[{ required: true, message: '请设置坐诊日期' }]}>
                        <DatePicker
                            style={{ width: 200 }}
                            placeholder="请设置坐诊日期"
                            format="YYYY-MM-DD"
                            disabledDate={
                                (current) => {
                                    return current && current < moment().endOf('day') || current > moment().add(1, "week");
                                }
                            } />
                    </Form.Item>
                    <Form.Item label="放号数" name="sittingNum" rules={[{ required: true, message: '请设置放号数' }]}>
                        <InputNumber style={{ width: 200 }} min={1} placeholder="请设置放号数" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
