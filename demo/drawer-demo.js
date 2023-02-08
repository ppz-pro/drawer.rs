import React from 'react'
import { Drawer, useExpand } from '../index'

export default
function App() {
  return <div>
    <Vertical />
    <Horizontal />
    <Double />
  </div>
}

function Vertical() {
  let state = useExpand(true)
  return <section>
    <h1>纵向</h1>
    <button onClick = {state.toggle}>expand: {String(state.value)}</button>
    <Drawer
      className = "drawer"
      expand = {state.value}
      y = {true}
    >
      <ul>
        <li>皮皮仔</li>
        <li>丑丑仔</li>
        <li>静静</li>
        <li>牙牙仔</li>
      </ul>
    </Drawer>
  </section>
}

function Horizontal() {
  let state = useExpand(true)
  return <section>
    <h1>横向</h1>
    <button onClick = {state.toggle}>expand: {String(state.value)}</button>
    <Drawer
      className = "drawer"
      expand = {state.value}
      x = {true}
    >
      <ul>
        <li>皮皮仔</li>
        <li>丑丑仔</li>
        <li>静静</li>
        <li>牙牙仔</li>
      </ul>
    </Drawer>
  </section>
}

function Double() {
  let state = useExpand(true)
  return <section>
    <h1>双向</h1>
    <button onClick = {state.toggle}>expand: {String(state.value)}</button>
    <Drawer
      className = "drawer"
      expand = {state.value}
      x = {true}
      y = {true}
    >
      <ul>
        <li>皮皮仔</li>
        <li>丑丑仔</li>
        <li>静静</li>
        <li>牙牙仔</li>
      </ul>
    </Drawer>
  </section>
}
