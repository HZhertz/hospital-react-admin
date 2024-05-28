import { Button, Table } from 'antd'
import React from 'react'
import styles from './myTable.module.scss'

export default function MyTable(props) {
  let {
    onAdd,
    onCurrent,
    columns,
    data,
    total,
    pageSize = 8,
    current,
    loading = true,
    scroll
  } = props
  return (
    <div className={styles.bottom}>
      <div className={styles.bottom_top}>
        <span>共{total}条数据</span>
        {onAdd && (
          <Button onClick={onAdd} type="primary">
            新增
          </Button>
        )}
      </div>
      <Table
        size="small"
        columns={columns}
        loading={loading}
        dataSource={data}
        pagination={{
          total,
          pageSize,
          current,
          position: ['bottomCenter'],
          onChange: onCurrent
        }}
        style={{ marginTop: 10 }}
        scroll={scroll ? scroll : false}
      />
    </div>
  )
}
