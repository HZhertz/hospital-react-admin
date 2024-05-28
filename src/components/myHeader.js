import { Form } from 'antd'
import React from 'react'
import styles from "./myHeader.module.scss"

export default function MyHeader(props) {
    let { formHTML } = props
    return (
        <div className={styles.top}>
            {formHTML}
        </div>
    )
}
