import React from 'react'
import { Menu } from 'antd'
import styles from './index.module.scss'
import { useNavigate } from 'react-router-dom'

export default function MainMenu() {
  const navigate = useNavigate()
  function handlTiao({ key }) {
    navigate(key)
  }
  return (
    <div className={styles.menu}>
      <Menu mode="inline" onClick={handlTiao}>
        <Menu.Item key="/mainNav/systemTeam">科室管理</Menu.Item>
        <Menu.Item key="/mainNav/systemUser">医生管理</Menu.Item>
        <Menu.Item key="/mainNav/systemRegister">挂号管理</Menu.Item>
        <Menu.Item key="/mainNav/systemAnnouncement">通知公告</Menu.Item>
        <Menu.Item key="/mainNav/systemHospitalAnnouncement">
          医院公告
        </Menu.Item>
        <Menu.Item key="/mainNav/systemRotograph">轮播图管理</Menu.Item>
        <Menu.Item key="/mainNav/medicalTreatment">在线咨询</Menu.Item>
      </Menu>
    </div>
  )
}
