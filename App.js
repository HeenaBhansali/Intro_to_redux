const generateId = () =>
  Math.random()
    .toString(36)
    .substring(2) + new Date().getTime().toString(36)

// APP CODE

const ADD_TODO = "ADD_TODO"
const REMOVE_TODO = "REMOVE_TODO"
const TOGGLE_TODO = "TOGGLE_TODO"
const ADD_GOAL = "ADD_GOAL"
const REMOVE_GOAL = "REMOVE_GOAL "
const RECEIVE_DATA = "RECEIVE_DATA"

// Action Creators

const addTodoAction = todo => {
  return {
    type: ADD_TODO,
    todo
  }
}

const removeTodoAction = id => {
  return {
    type: REMOVE_TODO,
    id
  }
}

const toggleTodoAction = id => {
  return {
    type: TOGGLE_TODO,
    id
  }
}

const addGoalAction = goal => {
  return {
    type: ADD_GOAL,
    goal
  }
}

const removeGoalAction = id => {
  return {
    type: REMOVE_GOAL,
    id
  }
}

const receiveDataAction = (todos, goals) => {
  return {
    type: RECEIVE_DATA,
    todos,
    goals
  }
}

const handleAddTodo = (name, callback) => dispatch =>
  API.saveTodo(name)
    .then(todo => {
      dispatch(addTodoAction(todo))
      callback()
    })
    .catch(() => alert("There is an error. Try again."))

const handleDeleteTodo = todo => dispatch => {
  dispatch(removeTodoAction(todo.id))
  return API.deleteTodo(todo.id).catch(() => {
    dispatch(addTodoAction(todo))
    alert("some error occured... Try Again")
  })
}

const handleToggleTodo = id => dispatch => {
  dispatch(toggleTodoAction(id))
  return API.saveTodo(id).catch(() => {
    dispatch(toggleTodoAction(id))
    alert("some error occured... Try Again")
  })
}

const handleAddGoal = (name, callback) => dispatch =>
  API.saveGoal(name)
    .then(goal => {
      dispatch(addGoalAction(goal))
      callback()
    })
    .catch(() => alert("There is an error. Try again."))

const handleDeleteGoal = goal => dispatch => {
  dispatch(removeGoalAction(goal.id))
  return API.deleteGoal(goal.id).catch(() => {
    dispatch(addGoalAction(goal))
    alert("some error occured... Try Again")
  })
}

const handleInitialData = () => dispatch =>
  Promise.all([API.fetchTodos(), API.fetchGoals()]).then(([todos, goals]) => {
    dispatch(receiveDataAction(todos, goals))
  })

// Middleware function

const checker = store => next => action => {
  if (
    action.type === ADD_TODO &&
    action.todo.name.toLowerCase().indexOf("bitcoin") !== -1
  ) {
    return alert("NOPE, THAT'S A BAD IDEA")
  }

  if (
    action.type === ADD_GOAL &&
    action.goal.name.toLowerCase().indexOf("bitcoin") !== -1
  ) {
    return alert("NOPE, THAT'S A BAD IDEA")
  }

  return next(action)
}

const logger = store => next => action => {
  console.group(action.type)
  console.log("The action: ", action)
  const result = next(action)
  console.log("The new state: ", store.getState())
  console.groupEnd()
  return result
}

// Reducer function

const todos = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo])
    case REMOVE_TODO:
      return state.filter(todo => todo.id !== action.id)
    case TOGGLE_TODO:
      return state.map(todo =>
        todo.id !== action.id
          ? todo
          : Object.assign({}, todo, { complete: !todo.complete })
      )
    case RECEIVE_DATA:
      return action.todos
    default:
      return state
  }
}

const goals = (state = [], action) => {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal])
    case REMOVE_GOAL:
      return state.filter(goal => goal.id !== action.id)
    case RECEIVE_DATA:
      return action.goals
    default:
      return state
  }
}

const loading = (state = true, action) => {
  switch (action.type) {
    case RECEIVE_DATA:
      return false
    default:
      return state
  }
}

const store = Redux.createStore(
  Redux.combineReducers({
    todos,
    goals,
    loading
  }),
  Redux.applyMiddleware(ReduxThunk.default, checker, logger)
)

const List = props => {
  return (
    <ul>
      {props.items.map(item => (
        <li key={item.id}>
          <span
            onClick={() => props.toggle && props.toggle(item.id)}
            style={{
              textDecoration: item.complete ? "line-through" : "none"
            }}
          >
            {item.name}
          </span>
          <button onClick={() => props.remove(item)}> X </button>
        </li>
      ))}
    </ul>
  )
}

class Todos extends React.Component {
  addItem = e => {
    e.preventDefault()
    this.props.dispatch(
      handleAddTodo(this.input.value, () => (this.input.value = ""))
    )
  }

  removeItem = todo => {
    this.props.dispatch(handleDeleteTodo(todo))
  }

  toggleItem = id => {
    this.props.dispatch(handleToggleTodo(id))
  }

  render() {
    return (
      <div>
        <h1>Todo List</h1>
        <input
          type="text"
          placeholder="Add Todo"
          ref={input => (this.input = input)}
        />
        <button onClick={this.addItem}> Add Todo</button>
        <List
          items={this.props.todos}
          remove={this.removeItem}
          toggle={this.toggleItem}
        />
      </div>
    )
  }
}

const ConnectedTodos = ReactRedux.connect(state => ({
  todos: state.todos
}))(Todos)

class Goals extends React.Component {
  addItem = e => {
    e.preventDefault()

    this.props.dispatch(
      handleAddGoal(this.input.value, () => (this.input.value = ""))
    )
  }

  removeItem = goal => {
    this.props.dispatch(handleDeleteGoal(goal))
  }

  render() {
    return (
      <div>
        <h1>Goals</h1>
        <input
          type="text"
          placeholder="Add Goal"
          ref={input => (this.input = input)}
        />
        <button onClick={this.addItem}> Add Goal</button>
        <List items={this.props.goals} remove={this.removeItem} />
      </div>
    )
  }
}

const ConnectedGoals = ReactRedux.connect(state => ({
  goals: state.goals
}))(Goals)

class App extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props

    dispatch(handleInitialData())
  }

  render() {
    const { loading } = this.props

    if (loading === true) {
      return <h3>Loading...</h3>
    }

    return (
      <div>
        <ConnectedTodos />
        <ConnectedGoals />
      </div>
    )
  }
}

const ConnectedApp = ReactRedux.connect(state => ({
  loading: state.loading
}))(App)

ReactDOM.render(
  <ReactRedux.Provider store={store}>
    <ConnectedApp />
  </ReactRedux.Provider>,
  document.getElementById("app")
)
