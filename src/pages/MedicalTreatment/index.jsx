import React, { useCallback, useEffect, useState } from 'react'
import styles from './index.module.scss'
import avaty from '../../assets/img/avaty.png'
import { Button, Divider, Input, message } from 'antd'
import api from '../../api'
import PubSub from 'pubsub-js'
import { ws } from '../MainNav'
const { TextArea } = Input
let user
let userList
let id

export default function MedicalTreatment() {
  const [clickSelectedId, setClickSelectedId] = useState(0)
  const [list, setList] = useState([])
  const [messageList, setMessageList] = useState([])
  const [value, setValue] = useState('')

  function getMedicalTreatment(id) {
    let params = { userId: id }
    api.getMedicalTreatment(params).then((res) => {
      setMessageList(res.list)
      userList = res.list
      scrollBottom('#ulDiv')
    })
  }

  function selectUser(item, index) {
    if (clickSelectedId === item.senderId) return
    setClickSelectedId(item.senderId)
    user = item.senderId
    getMedicalTreatment(item.senderId)
    id = item.senderId
  }
  useEffect(() => {
    console.log('clickSelectedId', clickSelectedId)
  }, [clickSelectedId])

  function getUserMedicalTreatment() {
    api.getUserMedicalTreatment().then((res) => {
      setList(res.list)
    })
  }
  /**
   *
   * @param {string} id
   *
   */
  function scrollBottom(id) {
    let div = document.querySelector(id)
    setTimeout(() => {
      div.scrollTop = div.scrollHeight
    }, 500)
  }
  function handlSend() {
    if (!value) return message.error('发送内容不能为空')
    let item = {
      senderId: localStorage.getItem('id'),
      receiver: list.find((item) => item.senderId === clickSelectedId).senderId,
      content: value
    }
    ws.send(JSON.stringify(item))
    setValue('')
  }

  useEffect(() => {
    getUserMedicalTreatment()
    //获取即使通讯 进行对应更新
    let timer = PubSub.subscribe('message', (_, { code, senderId }) => {
      if (code === 300) {
        getUserMedicalTreatment()
        if (user !== 0 && id == senderId)
          getMedicalTreatment(userList[user - 1].senderId)
      } else if (code === 301) {
        getMedicalTreatment(clickSelectedId)
      }
    })
    return () => {
      PubSub.unsubscribe(timer)
    }
  })

  return (
    <div className={styles.father}>
      <div className={styles.left}>
        {list.map((item, index) => {
          return (
            <div
              onClick={() => selectUser(item, index + 1)}
              key={item.id}
              className={styles.left_item}
              style={
                clickSelectedId === index + 1
                  ? { background: '#E6F7FF', color: '#1890ff' }
                  : {}
              }
            >
              {item.username}
            </div>
          )
        })}
      </div>
      {clickSelectedId !== 0 ? (
        <div className={styles.right}>
          <div className={styles.username}>
            {list.find((item) => item.senderId === clickSelectedId).username}
          </div>
          <Divider></Divider>
          <div className={styles.ulDiv} id="ulDiv">
            <ul className={styles.ul}>
              {messageList.map((item) => {
                return (
                  <li key={item.id} className={styles.li}>
                    <img
                      alt="img"
                      className={
                        localStorage.getItem('id') == item.senderId
                          ? styles.imgRight
                          : styles.imgLeft
                      }
                      src={avaty}
                    ></img>
                    <div
                      className={
                        localStorage.getItem('id') == item.senderId
                          ? styles.sayRight
                          : styles.sayLeft
                      }
                    >
                      {item.content}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
          <TextArea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{ marginTop: 10, fontSize: 18 }}
            rows={4}
          ></TextArea>
          <Button className={styles.button} type="primary" onClick={handlSend}>
            发送
          </Button>
        </div>
      ) : (
        '暂无信息'
      )}
    </div>
  )
}
