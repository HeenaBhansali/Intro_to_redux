import API from "goals-todos-api"

export const ADD_TODO = "ADD_TODO"
export const REMOVE_TODO = "REMOVE_TODO"
export const TOGGLE_TODO = "TOGGLE_TODO"

const addTodo = todo => {
  return {
    type: ADD_TODO,
    todo
  }
}

const removeTodo = id => {
  return {
    type: REMOVE_TODO,
    id
  }
}

const toggleTodo = id => {
  return {
    type: TOGGLE_TODO,
    id
  }
}

export const handleAddTodo = (name, callback) => dispatch =>
  API.saveTodo(name)
    .then(todo => {
      dispatch(addTodo(todo))
      callback()
    })
    .catch(() => alert("There is an error. Try again."))

export const handleDeleteTodo = todo => dispatch => {
  dispatch(removeTodo(todo.id))
  return API.deleteTodo(todo.id).catch(() => {
    dispatch(addTodo(todo))
    alert("some error occured... Try Again")
  })
}

export const handleToggleTodo = id => dispatch => {
  dispatch(toggleTodo(id))
  return API.saveTodo(id).catch(() => {
    dispatch(toggleTodo(id))
    alert("some error occured... Try Again")
  })
}
