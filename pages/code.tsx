import * as React from 'react'
import Page from '../layouts/main'
import Cleave from 'cleave.js/react'
import css from '../styles/pages/code.scss'

import routes from '../server/routes'
const { Link, Router } = routes

/* CONFIG */
const lengthOfRoom = 6
const cleaveInputOptions = {
  numericOnly: true,
  blocks: [1]
}

const getRoomFromRefs = (numberRefs) => {
  if (numberRefs.length <= 0) {
    return ''
  } else {
    return numberRefs[0].element.value
      + getRoomFromRefs(numberRefs.slice(1))
  }
}

class Code extends React.Component {
  numberRefs = []

  // Listens for a number input and then focuses on the next input
  handleKeyUp (index, event) {
    const { nativeEvent: { data: key } } = event

    if (index + 1 === lengthOfRoom) {
      // Check if the input is the last one
      Router.push(`/party/${getRoomFromRefs(this.numberRefs)}`)
    } else if (key && key.search(/\d/) >= 0) {
      // Otherwise focus on the next number input
      this.numberRefs[index + 1].element.focus()
    }
  }

  // Listens for backspace and then focuses on the last input
  handleKeyDown (index, event) {
    const isDeleteKey = event.keyCode === 8
    const currentValue = event.currentTarget.value
    const isEmpty = currentValue.length === 0

    if (index !== 0 && isDeleteKey && isEmpty) {
      this.numberRefs[index - 1].element.focus()
    }
  }

  render () {
    const numberInputs = new Array(lengthOfRoom)
      .fill(undefined)
      .map((_, index) => {
        return (
          <Cleave
            autoFocus={index === 0} // only autofocus the first one
            type='number'
            placeholder='0'
            pattern='[0-9]*'
            options={cleaveInputOptions}
            className={css.numberInput}
            key={index}
            ref={(instance) => { this.numberRefs[index] = instance }}
            onChange={this.handleKeyUp.bind(this, index)}
            onKeyDown={this.handleKeyDown.bind(this, index)}
            data-cy={`number-${index}`}
          />
        )
      })

    return (
      <Page>
        <div className={css.container}>
          {/* Title */}
          <div>
            <Link route='/find'>
              <span className={css.backButton}>
                ← Choose a different option
              </span>
            </Link>
            <h1 className={css.hero}>Enter Code</h1>
          </div>
          {/* Number Inputs */}
          <div className={css.verticallyCenter}>
            <div className={css.inputContainer}>
              {numberInputs}
            </div>
          </div>
        </div>
      </Page>
    )
  }
}

export default Code
