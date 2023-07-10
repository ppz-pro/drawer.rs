import { E } from '@ppzp/utils.rc'
import { Drawer, useExpand } from '../index.js'
import Tree from './tree.js'

export default
function App() {
  return E.div(
    E(Vertical),
    E(Horizontal),
    E(Double),
    E.div(
      E.h1('Tree'),
      E(Tree)
    )
  )
}

function Vertical() {
  let state = useExpand(false)
  return E.section(
    E.h1('纵向'),
    E.button({ onClick: state.toggle }, 'expand: ' + state.expand),
    E(Drawer,
      {
        className: 'drawer',
        expand: state.expand,
        y: true
      },
      E.ul(
        E.li('皮皮仔'),
        E.li('丑丑仔'),
        E.li('静静'),
        E.li('牙牙仔')
      )
    )
  )
}

function Horizontal() {
  let state = useExpand()
  return E.section(
    E.h1('横向'),
    E.button({ onClick: state.toggle}, 'expand: ' + state.expand),
    E(Drawer,
      {
        className: 'drawer',
        expand: state.expand,
        x: true
      },
      E.ul(
        E.li('皮皮仔'),
        E.li('丑丑仔'),
        E.li('静静'),
        E.li('牙牙仔')
      )
    )
  )
}

function Double() {
  let state = useExpand(true)
  return E.section(
    E.h1('双向'),
    E.button({ onClick: state.toggle }, 'expand: ' + state.expand),
    E(Drawer,
      {
        className: 'drawer',
        expand: state.expand,
        x: true,
        y: true
      },
      E.ul(
        E.li('皮皮仔'),
        E.li('丑丑仔'),
        E.li('静静'),
        E.li('牙牙仔')
      )
    )
  )
}
