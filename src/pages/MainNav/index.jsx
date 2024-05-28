import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Layout, message, Avatar, Button, Drawer, Modal } from 'antd'
import { SettingFilled, UserOutlined } from '@ant-design/icons'
import PubSub from 'pubsub-js'
import MainMenu from '../MainMenu'
import styles from './index.module.scss'
import { removeCookie } from '../../untils/auth'

const { Header, Footer, Sider, Content } = Layout
export let ws

export default function MainNav() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  function isSignOut() {
    let modal
    modal = Modal.confirm({
      title: '你确定要退出登录吗？',
      content: '点击确定后，你将会退出登录。',
      onOk() {
        // 在这里添加退出登录的代码
        removeCookie('token_admin')
        navigate('/login')
      },
      onCancel() {
        // 在这里添加取消退出登录的代码
        modal.destroy()
      }
    })
  }
  function reconnect() {
    // lockReconnect加锁，防止onclose、onerror两次重连
    console.log('正在进行重连')
    // 进行重连
    setTimeout(function () {
      initWebSocket()
    }, 1000)
  }
  function initWebSocket() {
    ws = new WebSocket(`ws:localhost:8000?id=${localStorage.getItem('id')}`)
    ws.onopen = function () {
      console.log('localhost:8000，连接成功')
    }
    ws.onmessage = function (e) {
      let item = JSON.parse(e.data)
      console.log(item)
      if (item.code === 300) {
        message.success('您有一条新消息请在线在线咨询中查看')
        PubSub.publish('message', item)
      } else if (item.code === 301) {
        PubSub.publish('message', item)
      }
    }
    ws.onclose = function (e) {
      console.log('close')
      reconnect()
    }
  }
  useEffect(() => {
    initWebSocket()
  }, [])

  return (
    <div className={styles.content}>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0',
          backgroundColor: '#007c7c'
        }}
      >
        <div className={styles.left}>
          <img
            src="http://www.bddhospital.com.cn/Uploads/Picture/2022/01/17/s61e4ed8c3879a.png"
            alt="img"
          />
          <div className={styles.title}>保定胸外医院挂号系统</div>
        </div>
        <div className={styles.right}>
          <Avatar size={50} icon={<UserOutlined />} style={{ margin: '5px' }} />
          <div>username</div>
          <SettingFilled
            style={{ fontSize: '200%', marginRight: '20px' }}
            onClick={showDrawer}
          />
        </div>
      </Header>
      <Layout style={{ height: '100%' }}>
        <Sider style={{ boxShadow: '0px 0px 4px 0px rgba(0,0,0,.1)' }}>
          <MainMenu></MainMenu>
        </Sider>
        <Layout>
          <Content style={{ padding: 30 }}>
            <Outlet></Outlet>
          </Content>
        </Layout>
      </Layout>
      <Footer style={{ backgroundColor: '#333' }}></Footer>
      <Drawer title="setting" placement="right" onClose={onClose} open={open}>
        <Button type="primary" danger onClick={isSignOut}>
          退出登录
        </Button>
      </Drawer>
    </div>
  )
}
