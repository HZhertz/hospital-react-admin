import React, { useEffect, useState } from 'react'
import MyHeader from '../../components/myHeader'
import MyTable from '../../components/myTable'
import api from "../../api"
import Editor from 'wangeditor'
import { Input, Select, Form, Button, Divider, Upload, Checkbox, Modal, DatePicker, message, InputNumber } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import utils from "../../untils/tool"
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"

let Edit
export default function SystemHospitalAnnouncement() {
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
    function getSystemHospitalAnnouncement(current = 1) {
        let params = {
            pageNum: current,
            pageSize: 8,
            title
        }
        setLoading(true)
        api.getSystemHospitalAnnouncement(params).then(res => {
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
    async function uploadFiles(file) {
        let formData = new FormData()
        formData.append("image", file)
        let r = ""
        let res = await api.addSystemHospitalAnnouncementImage(formData)
        if (res.code === 200) {
            message.success("图片上传成功")
            r = res.data
        } else {
            message.error("图片上传失败")
        }
        return r
    }
    function setWangeditor() {
        Edit = new Editor('#wangeditor');
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
        api.addSystemHospitalAnnouncementImage(formData).then(res => {
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
        form.setFieldValue("content", content)
        form.validateFields().then(value => {
            let { title, content, image } = value
            let formData = new FormData()
            formData.append("title", title)
            formData.append("content", content)
            formData.append("image", image)
            if (moduleTitle === "新增") {
                api.addSystemHospitalAnnouncement(formData).then(res => {
                    if (res.code === 200) {
                        message.success("添加成功")
                        getSystemHospitalAnnouncement()
                    } else {
                        message.error("添加失败")
                    }
                }).finally(() => setVisibility(false))
            } else {
                formData.append("id", moduleItem.id)
                api.editSystemHospitalAnnouncement(formData).then(res => {
                    if (res.code === 200) {
                        message.success("修改成功")
                        getSystemHospitalAnnouncement()
                    } else {
                        message.error("修改失败")
                    }
                }).finally(() => setVisibility(false))
            }
        })
    }
    useEffect(() => {
        getSystemHospitalAnnouncement()
    }, [])
    const formHTML = (
        <Form layout='inline'>
            <Form.Item>
                <Input style={{ width: 200 }} onInput={(e) => setTitle(e.target.value)} placeholder='请输入医院公告标题'></Input>
            </Form.Item>
            <Form.Item>
                <Button type='primary' onClick={() => getSystemHospitalAnnouncement()}>查询</Button>
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
            title: '公告简介',
            dataIndex: 'content',
            key: 5,
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
                            setVisibility(true)
                            setImageUrl(record.image)
                            setContent(record.content)
                            setModuleTitle("修改")
                            setModuleItem(record)
                            form.setFieldsValue(record)
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
                            api.deleteSystemHospitalAnnouncement(record.id).then(res => {
                                if (res.code === 200) {
                                    message.success("删除成功")
                                    getSystemHospitalAnnouncement()
                                } else {
                                    message.error("删除失败")
                                }
                            })
                        }} style={{ padding: 0 }} type='link'>删除</Button>
                        <Divider
                            style={{ visibility: 'hidden' }}
                            type="vertical"
                        />
                        <Button onClick={() => {
                            let params = {
                                id: record.id,
                                isRecommend: record.isRecommend ? 0 : 1
                            }
                            api.setSystemHospitalAnnouncementRecommend(params).then(res => {
                                if (res.code === 200) {
                                    message.success(res.message)
                                    getSystemHospitalAnnouncement()
                                } else {
                                    message.error(res.message)
                                }
                            })
                        }} style={{ padding: 0 }} type='link'>{record.isRecommend ? "取消推荐" : "首页推荐"}</Button>
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
                    setContent("")
                    setImageUrl("")
                    setModuleTitle("新增")
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
                onCurrent={getSystemHospitalAnnouncement}
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
                        <div id="wangeditor"></div>
                    </Form.Item>
                    <Form.Item label="公告首图" name="image" rules={[{ required: true, message: '请上传公告首图' }]}>
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
                                        上传公告首图
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
