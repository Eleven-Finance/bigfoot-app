import React from 'react'

function Icon(props) {
  const {icon} = props
  return (
    <span className={"avatar-title rounded-circle bg-transparent font-size-18"} >
      <img src={icon.default} />
    </span>
  )
}

export default Icon;