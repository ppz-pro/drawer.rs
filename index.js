import React, { useState } from 'react'

export
function useExpand(defaultValue = true) {
  const [expand, setExpand] = useState(defaultValue)
  return {
    expand,
    toggle: () => setExpand(!expand),
    set: setExpand
  }
}

/**
 * 抽屉盒子
 * + 通过 outer 元素，调用 animate 方法，实现动画
 * + 通过 inner 元素，保持动画播放时（及闭合动画后），内部元素不会因为 outer 尺寸变化而受到挤压
 */
export
class Drawer extends React.Component {
  constructor(props) {
    if(!props.x && !props.y)
      console.error('x 和 y 至少设置一个，否则抽屉无法伸缩')
    super(props)
    this.animation = null
    this.outerRef = React.createRef()
    this.innerRef = React.createRef()
  }

  async componentDidUpdate(prevProp) {
    if(prevProp.expand != this.props.expand) { // 展开 <=> 闭合
      const innerStyle = () => this.innerRef.current.style
      const outerStyle = () => this.outerRef.current.style

      // 初始状态
      let rect = this.outerRef.current.getBoundingClientRect()
      const first = {}
      if(this.props.x)
        first.width = rect.right - rect.left + 'px'
      if(this.props.y)
        first.height = rect.bottom - rect.top + 'px'

      // 取消正在播放的动画
      if(this.animation)
        this.animation.cancel()

      // 设置和获取最终状态
      const last = {}
      if(this.props.expand) { // 展开
        // 设置最终状态
        if(this.props.x) {
          innerStyle().width = null
          outerStyle().width = null // 取消宽度限制
        }
        if(this.props.y) {
          innerStyle().height = null
          outerStyle().height = null // 取消高度限制
        }
        // 获取最终状态
        const lastRect = this.outerRef.current.getBoundingClientRect()
        if(this.props.x)
          last.width = lastRect.right - lastRect.left + 'px'
        if(this.props.y)
          last.height = lastRect.bottom - lastRect.top + 'px'
      } else { // 闭合
        if(this.props.x) {
          outerStyle().width = 0
          last.width = 0
        }
        if(this.props.y) {
          outerStyle().height = 0
          last.height = 0
        }
      }

      // 动画开始前，保持 inner 形状
      if(!this.animation) { // 如果动画正在播放，则形状已经固定
        if(this.props.x)
          innerStyle().width = this.props.expand ? last.width : first.width
        if(this.props.y)
          innerStyle().height = this.props.expand ? last.height : first.height
      }

      // 播放！
      let animation = // 当前作用域保存一个引用
      this.animation = // 实例上的更新（顺便抛弃旧的 animation）
      this.outerRef.current.animate(
        [first, last],
        {
          duration: this.props.duration,
          easing: this.props.timingFunction
        }
      )

      // 等到动画结束
      await sleep(this.props.duration)
      if(animation == this.animation) {
        // 如果 this.animation 没变，说明没有“正在进行的动画”，此时需要清除动画产生的东西
        this.animation = null
        if(this.props.expand) { // 展开后，取消 inner 固定
          if(this.props.x)
            innerStyle().width = null
          if(this.props.y)
            innerStyle().height = null
        } // 闭合后，保持原 inner 固定
      }
      // 没有 else：如果 this.animation 变了，那么就让后面的动画处理
    }
  }

  async componentDidMount() {
    const { x, y, expand } = this.props
    if(!expand) { // 初始状态为闭合时
      const innerRect = this.innerRef.current.getBoundingClientRect()
      if(x) {
        this.innerRef.current.style.width = innerRect.right - innerRect.left + 'px'
        this.outerRef.current.style.width = 0
      }
      if(y) {
        this.innerRef.current.style.height = innerRect.bottom - innerRect.top + 'px'
        this.outerRef.current.style.height = 0
      }
    }
  }

  render() {
    return React.createElement(
      'div',
      {
        className: this.props.className,
        ref: this.outerRef, 
        style: {
          overflow: 'hidden',
          ...this.props.style
        }
      },
      React.createElement(
        'div',
        {
          ref: this.innerRef,
          style: {
            overflow: 'hidden' // 包住内部元素的 margin
          }
        },
        this.props.children
      )
    )
  }
}

Drawer.defaultProps = {
  duration: 300,
  timingFunction: 'ease',
  // className,
  // style,
  // x,
  // y,
  // expand
}

function sleep(duration) {
  return new Promise(res => {
    setTimeout(res, duration)
  })
}