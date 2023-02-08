import React from 'react'

export default
function({
  className,
  x,
  y,
  duration = .3,
  expand,
  children
}) {
  return <div
    className = {className}
  >
    <div
    >{children}</div>
  </div>
}