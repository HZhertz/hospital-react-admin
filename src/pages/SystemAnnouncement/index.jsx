import React, { useEffect, useState } from 'react'
import MyHeader from '../../components/myHeader'
import MyTable from '../../components/myTable'
import api from "../../api"
import Editor from 'wangeditor'
import { Input, Select, Form, Button, Divider, Checkbox, Modal, DatePicker, message, InputNumber } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import utils from "../../untils/tool"
let Edit
export default function SystemAnnouncement() {
    const [form] = useForm()

    const [content, setContent] = useState("")
    const [title, setTitle] = useState("")
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [current, setCurrent] = useState(1)
    const [visibility, setVisibility] = useState(false)
    const [moduleTitle, setModuleTitle] = useState("")
    const [moduleItem, setModuleItem] = useState({})
    async function uploadFiles(file) {
        let formData = new FormData()
        formData.append("image", file)
        let r = ""
        let res = await api.addAnnouncementImage(formData)
        if (res.code === 200) {
            message.success("图片上传成功")
            r = res.data
        } else {
            message.error("图片上传失败")
        }
        return r
    }
    function setWangeditor() {
        Edit = new Editor('#wangeditor_content');
        Edit.config.onchange = html => {
            setContent(html)
        }
        Edit.config.menus = [
            // 'head',  // 标题
            'bold',  // 粗体
            'fontSize',  // 字号
            'fontName',  // 字体
            'italic',  // 斜体
            'underline',  // 下划线
            'lineHeight',
            'link',  // 插入链接
            // 'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            // 'backColor',  // 背景颜色
            'justify',  // 对齐方式
            'table',
            'image', // 插入图片,
            // 'video'  // 插入视频
            // 'undo',  // 撤销
            // 'redo'  // 重复
        ]
        Edit.config.zIndex = 0;
        Edit.config.placeholder = '请记得编辑你的内容哦';
        Edit.config.showLinkImg = false
        Edit.config.pasteIgnoreImg = true  //忽略粘贴的图片
        Edit.config.uploadImgMaxSize = 2 * 1024 * 1024; // 图片大小2M
        Edit.config.uploadImgMaxLength = 1; // 图片数量最多1张
        Edit.config.uploadFileName = 'editor_img'; // 自定义文件名
        Edit.config.customUploadImg = async function (files, insert) {
            // files 是 input 中选中的文件列表
            if (files[0]) {
                const res = await uploadFiles(files[0])
                insert(res);
            } else {
                message.warning('请选择图片')
            }
        }
        Edit.create();
    }
    function getSystemAnnouncement(current = 1) {
        let params = {
            pageNum: current,
            pageSize: 8,
            title: title
        }
        setLoading(true)
        api.getSystemAnnouncement(params).then(res => {
            if (res.code === 200) {
                let r = res.data.announcementList.map((item, index) => {
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
    function handleOk() {
        form.setFieldValue("content", content)
        form.validateFields().then(value => {
            let { title, content, isAlert } = value
            let formData = new FormData()
            formData.append("title", title)
            formData.append("content", content)
            formData.append("isAlert", isAlert ? 1 : 0)
            if (moduleTitle === "新增") {
                api.addSystemAnnouncement(formData).then(res => {
                    if (res.code === 200) {
                        message.success("公告添加成功")
                        getSystemAnnouncement()
                    } else {
                        message.error("公告添加失败")
                    }
                }).finally(() => setVisibility(false))
            } else {
                formData.append("id", moduleItem.id)
                api.updateSystemAnnouncement(formData).then(res => {
                    if (res.code === 200) {
                        message.success("公告修改成功")
                        getSystemAnnouncement()
                    } else {
                        message.error("公告修改失败")
                    }
                }).finally(() => setVisibility(false))
            }
        })
    }
    useEffect(() => {
        getSystemAnnouncement()
    }, [])
    const formHTML = (
        <Form layout='inline'>
            <Form.Item>
                <Input style={{ width: 200 }} onInput={(e) => setTitle(e.target.value)} placeholder='请输入公告标题'></Input>
            </Form.Item>
            <Form.Item>
                <Button type='primary' onClick={() => getSystemAnnouncement()}>查询</Button>
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
            title: '公告名称',
            dataIndex: 'title',
            key: 2,
            ellipsis: true,
            width: 200
        },
        {
            title: '创建人',
            dataIndex: 'username',
            key: 3,
            ellipsis: true,
            width: 150
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 4,
            ellipsis: true,
            width: 150
        },
        {
            title: '是否弹窗',
            dataIndex: 'isAlert',
            key: 5,
            ellipsis: true,
            width: 100,
            render: (text) => {
                let name = text ? "是" : "否"
                return (
                    <span>{name}</span>
                )
            }
        },
        {
            title: '公告简介',
            dataIndex: 'content',
            key: 6,
            ellipsis: true,
            render: (text) => {
                let content = utils.getContent(text)
                return (
                    <React.Fragment>
                        {content}
                    </React.Fragment>
                )
            }
        },
        {
            title: '操作',
            key: 7,
            width: 200,
            render: (text, record) => {
                return (
                    <div>
                        <Button onClick={() => {
                            setModuleTitle("修改")
                            setVisibility(true)
                            form.setFieldsValue(record)
                            setModuleItem(record)
                            setTimeout(() => {
                                if (!Edit) setWangeditor()
                                Edit.txt.html(record.content)
                            }, 500)

                        }} style={{ padding: 0 }} type='link'>修改</Button>
                        <Divider
                            style={{ visibility: 'hidden' }}
                            type="vertical"
                        />
                        <Button onClick={() => {
                            api.deleteSystemAnnouncement(record.id).then(res => {
                                if (res.code === 200) {
                                    message.success("公告删除成功")
                                    getSystemAnnouncement()
                                } else {
                                    message.error("公告删除失败")
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
                    setModuleTitle("新增")
                    setContent("")
                    setVisibility(true)
                    form.resetFields()
                    setTimeout(() => {
                        setWangeditor()
                        Edit.txt.html("")
                    }, 500)
                }}
                columns={columns}
                data={data}
                loading={loading}
                total={total}
                current={current}
                onCurrent={(current) => getSystemAnnouncement(current)}
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
                    <Form.Item label="公告标题" name="title" rules={[{ required: true, message: '请输入公告标题' }]}>
                        <Input placeholder='请输入公告标题' />
                    </Form.Item>
                    <Form.Item label="公告内容" name="content" rules={[{ required: true, message: '请输入公告内容' }]}>
                        <div id="wangeditor_content"></div>
                    </Form.Item>
                    <Form.Item label="是否弹窗" name="isAlert" valuePropName="checked">
                        <Checkbox />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
