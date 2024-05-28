import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input, message } from 'antd'
import styles from './index.module.scss'
import api from '../../api'

let timer
export default function Reguser() {
  const [form] = Form.useForm()
  const [isDis, setIsDis] = useState(false)
  const navigate = useNavigate()
  async function getCaptcha() {
    try {
      let res = await api.captcha()
      if (res.code === 200) {
        let code = document.querySelector('#co')
        code.innerHTML = res.img
        let svg = code.childNodes[0]
        svg.style.display = 'block'
        svg.style.width = '100%'
        svg.style.height = '100%'
      }
    } catch (e) {
      console.log(e)
    }
  }
  async function handlePhoneCode() {
    form.validateFields(['phone']).then(async (value) => {
      console.log(value)
      let { phone } = value
      let formData = new FormData()
      formData.append('phone', phone)
      try {
        let res = await api.getPhoneCodeReguser(formData)
        if (res.code === 200) {
          message.success(res.message)
          let phoneCodeName = document.querySelector('#phone1')
          phoneCodeName.innerText = '60s'
          let time = 60
          setIsDis(true)
          timer = setInterval(() => {
            if (time === 0) {
              setIsDis(false)
              phoneCodeName.nativeElement.innerText = '获取验证码'
              return clearInterval(timer)
            }
            phoneCodeName.innerText = `${--time}s`
          }, 1000)
        } else {
          message.error(res.message)
        }
      } catch (e) {
        console.log(e)
      }
    })
  }
  async function onRegUserFinish(value) {
    let { username, password, phoneCode, code, phone } = value
    let formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    formData.append('phone', phone)
    formData.append('phoneCode', phoneCode)
    formData.append('code', code)
    formData.append('userRank', 1)
    // formData.append("isRank", 1)
    try {
      let res = await api.regUser(formData)
      if (res.code === 200) {
        message.success(res.message)
        navigate('/login')
      } else {
        message.error(res.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    getCaptcha()
    return () => {
      clearInterval(timer)
    }
  }, [])
  return (
    <div className={styles.content}>
      <Form
        form={form}
        style={{ width: '100%', padding: '0 30px' }}
        labelCol={{
          span: 5
        }}
        wrapperCol={{
          span: 19
        }}
        onFinish={onRegUserFinish}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            {
              required: true,
              message: '请输入用户名'
            },
            {
              pattern: /^.{1,15}$/,
              message: '请输入15位以下'
            }
          ]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码'
            },
            {
              pattern: /^.{6,15}$/,
              message: '请输入15位以下,6位以上'
            }
          ]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
        <Form.Item
          label="确认密码"
          name="checkPassword"
          rules={[
            {
              required: true,
              message: '请确认密码'
            },
            {
              transform: (value) => {
                if (value !== form.getFieldValue('password')) {
                  return true
                }
              },
              message: '两次密码不一致'
            }
          ]}
        >
          <Input.Password placeholder="请确认密码" />
        </Form.Item>
        <Form.Item
          label="手机号"
          name="phone"
          rules={[
            {
              required: true,
              message: '请输入手机号'
            },
            {
              pattern: /^1[3-9]\d{9}$/,
              message: '手机号格式不正确'
            }
          ]}
        >
          <Input placeholder="请输入手机号" />
        </Form.Item>
        <Form.Item
          label="短信验证码"
          name="phoneCode"
          rules={[
            {
              required: true,
              message: '请输入短信验证码'
            }
          ]}
        >
          <div style={{ display: 'flex' }}>
            <Input placeholder="请输入短信验证码" />
            <Button
              disabled={isDis}
              onClick={handlePhoneCode}
              id="phone1"
              type="primary"
              style={{ marginLeft: 10, width: 102, flexShrink: 0 }}
            >
              获取验证码
            </Button>
          </div>
        </Form.Item>
        <Form.Item
          label="验证码"
          name="code"
          rules={[
            {
              required: true,
              message: '请输入验证码'
            }
          ]}
        >
          <div style={{ display: 'flex' }}>
            <Input placeholder="请输入验证码" />
            <div
              onClick={getCaptcha}
              style={{
                width: 102,
                height: 32,
                flexShrink: 0,
                marginLeft: 10,
                cursor: 'pointer'
              }}
              id="co"
            ></div>
          </div>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 5,
            span: 14
          }}
        >
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            注册
          </Button>
        </Form.Item>
        <div style={{ textAlign: 'center' }}>
          已有帐号？
          <span
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={() => {
              navigate('/login')
            }}
          >
            立即登录
          </span>
        </div>
      </Form>
    </div>
  )
}
