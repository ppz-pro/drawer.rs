import React, { useEffect, useState, useRef } from 'react'

export
function useExpand(defaultValue = true) {
  const [expand, setExpand] = useState(defaultValue)
  return {
    expand,
    toggle: () => setExpand(!expand),
    set: setExpand
  }
}

{ // TODO: useNonreactive 给组件以“非状态”数据
  let lastID = 0
  // 给每个实例搞一个不变的 id
  var useInstanceID = function() {
    const [id] = useState(() => lastID++)
    return id
  }
}

const animatingMap = new Map() // <instanceID, animatingNum: 未结束的动画个数>

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
  const instanceID = useInstanceID()
  // TODO：找更好的方案
  if(animatingMap[instanceID] === undefined) // 给未设置的设置
    animatingMap[instanceID] = 0

  if(!x && !y)
    console.error('x 和 y 至少设置一个，否则抽屉无法伸缩')
  
  const outerRef = useRef()
  const outerStyle = () => outerRef.current.style
  const innerRef = useRef()
  const innerStyle = () => innerRef.current.style

  const Transition = () => duration + 's all ' + timingFunction

  useEffect(() => {
    async function animate() {
      outerStyle().transition = null // 清空过度
      animatingMap[instanceID]++ // 有新动画了，+1
      if(expand) { // 展开
        // FLIP.First 宽高都为零
        // FLIP.Last
        if(x)
          outerStyle().width = null // 取消宽度限制
        if(y)
          outerStyle().height = null // 取消高度限制
        const rect = innerRef.current.getBoundingClientRect()
        let width = rect.right - rect.left + 'px'
        let height = rect.bottom - rect.top + 'px'
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
        let width = rect.right - rect.left + 'px'
        let height = rect.bottom - rect.top + 'px'
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

      await sleep(duration)
      // 等到动画结束，-1
      animatingMap[instanceID]--
      if(animatingMap[instanceID] == 0) { // 动画全播完了
        outerStyle().transition = null // 把过度删掉
        if(expand) { // 如果是展开状态，把限宽、限高删掉
          if(x) {
            outerStyle().width = null
            innerStyle().width = null
          }
          if(y) {
            outerStyle().height = null
            innerStyle().height = null
          }
        }
      }
    }
    animate()
  }, [expand])

  return React.createElement(
    'div',
    {
      className,
      ref: outerRef, 
      style: {
        overflow: 'hidden'
      }
    },
    React.createElement(
      'div',
      {
        ref: innerRef,
        style: {
          overflow: 'hidden' // 包住内部元素的 margin
        }
      },
      children
    )
  )
}

function nextFrame() {
  return new Promise(res => {
    requestAnimationFrame(res)
  })
}

function sleep(duration) {
  return new Promise(res => {
    setTimeout(res, duration * 1000)
  })
}