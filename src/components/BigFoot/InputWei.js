import React from 'react'
import {
  Input,
} from "reactstrap"

function InputWei(props) {
  return (
    <Input
      type="number"
      min={0}
      step={0.0000000000000001} //note: using (1/ 1**16) <-- (1/ 1**18) seems not to work on FireFox 
      onInput={(e) => e.target.value = Number(e.target.value).toFixed(18)} 
      {...props}
      />
  )
}

export default InputWei;