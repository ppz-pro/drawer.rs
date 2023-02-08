import React, { useEffect, useState, useRef } from 'react'

export
function useExpand(defaultValue = true) {
  const [expand, setExpand] = useState(defaultValue)
  return {
    value: expand,
    toggle: () => setExpand(!expand),
    set: setExpand
  }
}

export
function Drawer({
  className,
  x,
  y,
  duration = .3,
  timingFunction = 'ease',
  expand,
  children
}) {
  if(!x && !y)
    console.error('x 和 y 至少设置一个，否则抽屉无法伸缩')
  
  const outerRef = useRef()
  const outerStyle = () => outerRef.current.style
  const innerRef = useRef()
  const innerStyle = () => innerRef.current.style

  const Transition = () => duration + 's all ' + timingFunction

  useEffect(() => {
    async function animate() {
      outerStyle().transition = null
      if(expand) { // 展开
        // FLIP.First 宽高都为零
        // FLIP.Last
        if(x)
          outerStyle().width = null // 取消宽度限制
        if(y)
          outerStyle().height = null // 取消高度限制
        const rect = innerRef.current.getBoundingClientRect()
        let width = rect.right - rect.left
        let height = rect.bottom - rect.top
        // FLIP.Inverse
        if(x) {
          outerStyle().width = 0
          innerStyle().width = width // 保持内部元素形状及排列
        }
        if(y) {
          outerStyle().height = 0
          innerStyle().height = height
        }
        outerStyle().transition = Transition()
        // FLIP.Play
        await nextFrame()
        if(x)
          outerStyle().width = width
        if(y)
          outerStyle().height = height
      } else {
        // 闭合
        // FLIP.First
        const rect = innerRef.current.getBoundingClientRect()
        let width = rect.right - rect.left
        let height = rect.bottom - rect.top
        // FLIP.Last 宽高都为零
        // FLIP.Inverse
        if(x) {
          outerStyle().width = width
          innerStyle().width = width
        }
        if(y) {
          outerStyle().height = height
          innerStyle().height = height
        }
        outerStyle().transition = Transition()
        
        // FLIP.Play
        await nextFrame()
        if(x)
          outerStyle().width = 0
        if(y)
          outerStyle().height = 0
      }
    }
    animate()
  }, [expand])

  return <div
    className = {className}
    ref = {outerRef}
    style = {{
      overflow: 'hidden'
    }}
  >
    <div
      ref = {innerRef}
      style = {{
        overflow: 'hidden' // 包住内部元素的 margin
      }}
    >{children}</div>
  </div>
}

function nextFrame() {
  return new Promise(res => {
    requestAnimationFrame(res)
  })
}

function sleep(duration) {
  duration = duration * 1000
  return new Promise(res => {
    setTimeout(res, duration)
  })
}