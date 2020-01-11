const Context = React.createContext()

function connect(mapStateToProps) {
  return Component => {
    class Receiver extends React.Component {
      componentDidMount() {
        const { subscribe } = this.props.store

        this.unsubscribe = subscribe(() => this.forceUpdate())
      }

      componentWillUnmount() {
        this.unsubscribe()
      }

      render() {
        const { dispatch, getState } = this.props.store
        const state = getState()
        const stateNeeded = mapStateToProps(state)
        return <Component {...stateNeeded} dispatch={dispatch} />
      }
    }

    class ConnectedComponent extends React.Component {
      render() {
        return (
          <Context.Consumer>
            {store => <Receiver store={store} />}
          </Context.Consumer>
        )
      }
    }
    return ConnectedComponent
  }
}

class Provider extends React.Component {
  render() {
    return (
      <Context.Provider value={this.props.store}>
        {this.props.children}
      </Context.Provider>
    )
  }
}
