import React, {
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native'

import { applyMiddleware, createStore, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { firebaseReducer, syncFirebase, firebaseToProps } from 'refire'
import { connect, Provider } from 'react-redux'

const firebaseBindings = {
  "settings": {
    path: "settings"
  }
}

const reducer = combineReducers({
  firebase: firebaseReducer(firebaseBindings),
  // your other reducers
})
const store = compose(applyMiddleware(thunk))(createStore)(reducer)

const {unsubscribe} = syncFirebase({
  store: store,
  url: "https://refire-hackathon-app.firebaseio.com/",
  bindings: firebaseBindings,
  onAuth: (authData) => {},
  onCancel: (error) => {}
})


class RefireHackathon extends Component {
  render() {
    const { value: settings = {} } = this.props.settings || {}
    if (!settings.indexTitle) {
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>
            Loading...
          </Text>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          {settings.indexTitle}
        </Text>
      </View>
    )
  }
}

const HackathonComponent = connect(
  firebaseToProps(["settings"])
)(RefireHackathon)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <HackathonComponent />
      </Provider>
    )
  }
}

export default App
