const generateId = () => {
  return (
    Math.random()
      .toString(36)
      .substring(2) + new Date().getTime().toString(36)
  )
}

// APP CODE

const ADD_TODO = "ADD_TODO"
const REMOVE_TODO = "REMOVE_TODO"
const TOGGLE_TODO = "TOGGLE_TODO"
const ADD_GOAL = "ADD_GOAL"
const REMOVE_GOAL = "REMOVE_GOAL "

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

const checkAndDispatch = (store, action) => {
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

  return store.dispatch(action)
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
    default:
      return state
  }
}

const store = Redux.createStore(
  Redux.combineReducers({
    todos,
    goals
  })
)

store.subscribe(() => {
  const { todos, goals } = store.getState()

  document.getElementById("goals").innerHTML = ""
  document.getElementById("todos").innerHTML = ""

  todos.forEach(addTodoToDom)
  goals.forEach(addGoalToDom)
})

//   DOM code

const createRemoveButton = onClick => {
  const removeBtn = document.createElement("button")
  removeBtn.innerHTML = "X"
  removeBtn.addEventListener("click", onClick)
  return removeBtn
}

const addTodoToDom = todo => {
  const node = document.createElement("li")
  const text = document.createTextNode(todo.name)

  const removeBtn = createRemoveButton(() => {
    checkAndDispatch(store, removeTodoAction(todo.id))
  })

  node.appendChild(text)
  node.appendChild(removeBtn)

  node.style.textDecoration = todo.complete ? "line-through" : "none"
  node.addEventListener("click", () => {
    checkAndDispatch(store, toggleTodoAction(todo.id))
  })

  document.getElementById("todos").appendChild(node)
}

const addGoalToDom = goal => {
  const node = document.createElement("li")
  const text = document.createTextNode(goal.name)

  const removeBtn = createRemoveButton(() => {
    checkAndDispatch(store, removeGoalAction(goal.id))
  })

  node.appendChild(text)
  node.appendChild(removeBtn)

  document.getElementById("goals").appendChild(node)
}

const addTodo = () => {
  const input = document.getElementById("todo")
  const name = input.value
  input.value = ""

  checkAndDispatch(
    store,
    addTodoAction({
      id: generateId(),
      name,
      complete: false
    })
  )
}

const addGoal = () => {
  const input = document.getElementById("goal")
  const name = input.value
  input.value = ""

  checkAndDispatch(
    store,
    addGoalAction({
      id: generateId(),
      name
    })
  )
}

document.getElementById("todoBtn").addEventListener("click", addTodo)

document.getElementById("goalBtn").addEventListener("click", addGoal)
