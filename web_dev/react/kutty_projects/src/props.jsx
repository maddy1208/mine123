import React from 'react'
import propTypes from 'prop-types'

const Props = (props) => {
  return (
    <div>
      <table>
        <tbody>
        <tr><th>Name</th><td>{props.name}</td></tr>
        <tr><th>Age</th><td>{props.age}</td></tr>

        <tr><th>Married st</th><td>{props.ismarried}</td></tr>
        </tbody>
      </table>
    </div>
  )
}




export default Props;

Props.propTypes={
    name:propTypes.string,
    age:propTypes.number,
    ismarried:propTypes.bool
}

