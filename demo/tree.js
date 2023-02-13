import React, { useState } from 'react'
import { Drawer, useExpand } from '../index'

export default
function Tree({ level = 0 }) {
  const [children, loadChildren] = useChildren()
  const drawer = useExpand(false)
  const [loading, setLoading] = useState(0)
  return <div className = 'tree'>
    <label
      onClick = {async () => {
        if(loading == 1) return

        if(!drawer.expand && !children) {
          setLoading(1)
          await loadChildren()
          setLoading(2)
        }
        drawer.toggle()
      }}
      style = {{
        paddingLeft: level + 'em'
      }}
    >
      <Label level = {level} expand = {drawer.expand} loading = {loading} length = {children?.length ?? null} />
    </label>
    <Drawer
      expand = {drawer.expand}
      y = {true}
    >{children?.map(item =>
      <Tree level = {level + 1} key = {item} />
    )}</Drawer>
  </div>
}

function Label({ level, expand, loading, length }) {
  const style = {
    display: 'inline-block',
    width: '8em',
    lineHeight: 2,
    padding: '0 .5em',
    background: '#eee',
    marginRight: '1em'
  }
  return <>
    <span style = {style}>level: {level}</span>
    <span style = {style}>expand: {String(expand)}</span>
    <span style = {style}>{{
      0: '未加载',
      1: '加载中',
      2: '已加载'
    }[loading]}</span>
    <span style = {style}>length: {String(length)}</span>
  </>
}

function useChildren() {
  const [result, set] = useState()
  return [
    result,
    async function loadChildren() {
      await new Promise(res => {
        setTimeout(res, 1000)
      })
      const size = Math.floor(Math.random() * 5) + 1
      const result = []
      for(let i=0; i<size; i++)
        result.push(i)
      set(result)
    }
  ]
}
