import React, { Component } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { connect } from 'react-redux'
import { getDailyReminderValue, getMetricMetaInfo, timeToString } from '../utils/helpers'
import { submitEntry, removeEntry } from '../utils/api'
import { Ionicons } from '@expo/vector-icons'
import UdaciSlider from './UdaciSlider'
import UdaciSteppers from './UdaciSteppers'
import DateHeader from './DateHeader'
import TextButton from './TextButton'
import { addEntry } from '../actions'

function SubmitBtn({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
    >
      <Text>Submit</Text>
    </TouchableOpacity>
  )
}

class AddEntry extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0,
  }

  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric)

    this.setState((state) => {
      const count = state[metric] + step

      return {
        ...state,
        [metric]: count > max ? max : count,
      }
    })
  }

  decrement = (metric) => {
    this.setState((state) => {
      const count = state[metric] - getMetricMetaInfo(metric).step

      return {
        ...state,
        [metric]: count < 0 ? 0 : count,
      }
    })
  }

  slide = (metric, value) => {
    this.setState(() => ({
      [metric]: value,
    }))
  }

  submit = () => {
    const key = timeToString()
    const entry = this.state

    //TODO: navigate home, clear local notification
    this.props.dispatch(addEntry({
      [key]: entry,
    }))

    submitEntry({ key, entry })

    this.setState({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0,
    })
  }

  reset = () => {
    const key = timeToString()

    // TODO: route home
    removeEntry(key)

    this.props.dispatch(addEntry({
      [key]: getDailyReminderValue(),
    }))
  }

  render() {
    const metInfo = getMetricMetaInfo()

    if (this.props.alreadyLogged) {
      return (
        <View>
          <Ionicons
            name='md-happy'
            size={100}
          />
          <Text>You already logged your information for today</Text>
          <TextButton onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      )
    }

    return (
      <View>
        <DateHeader date={new Date().toLocaleDateString()}/>
        {Object.keys(metInfo).map((key) => {
          const { getIcon, type, ...rest } = metInfo[key]
          const value = this.state[key]

          return (
            <View key={key}>
              {getIcon()}
              {type === 'slider'
                ? <UdaciSlider
                    value={value}
                    onChange={(value) => this.slide(key, value)}
                    {...rest}
                  />
                : <UdaciSteppers
                    value={value}
                    onIncrement={() => this.increment(key)}
                    onDecrement={() => this.decrement(key)}
                    {...rest}
                  />
                }
            </View>
          )
        })}
        <SubmitBtn onPress={this.submit}/>
      </View>
    )
  }
}

function mapStateToProps(state) {
  const key = timeToString()

  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined',
  }
}

export default connect(mapStateToProps)(AddEntry)
