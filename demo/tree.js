import { useState } from 'react'
import { E } from '@ppzp/utils.rc'
import { Drawer, useExpand } from '../index.js'

export default
function Tree({ level = 0 }) {
  const [children, loadChildren] = useChildren()
  const drawer = useExpand(false)
  const [loading, setLoading] = useState(0)
  return E({ plass: 'tree' },
    E.label(
      {
        async onClick() {
          if(loading == 1) return

          if(!drawer.expand && !children) {
            setLoading(1)
            await loadChildren()
            setLoading(2)
          }
          drawer.toggle()
        },
        style: {
          paddingLeft: level + 'em'
        }
      },
      E(Label, {
        level,
        expand: drawer.expand,
        loading,
        length: children?.length ?? null
      })
    ),
    E(Drawer,
      {
        expand: drawer.expand,
        y: true
      },
      children?.map(item =>
        E(Tree, { level: level + 1, key: item })
      )
    )
  )
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
  return E._(
    E.span({ style }, 'level: ' + level),
    E.span({ style }, 'expand: ' + expand),
    E.span({ style },
      {
        0: '未加载',
        1: '加载中',
        2: '已加载'
      }[loading]
    ),
    E.span({ style }, 'length: ' + length)
  )
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
