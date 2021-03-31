import React from 'react'
import CurrencyInput from 'react-currency-input-field';

function InputWei(props) {
  return (
    <CurrencyInput
      allowNegativeValue={false}
      defaultValue={0}
      decimalsLimit={18}
      {...props}
    />
  )
}

export default InputWei;