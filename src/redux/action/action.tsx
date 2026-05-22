export function addTodo(item) {
  return {
    type: 'add_todo',
    data: item,
  };
}
export function removeTodo(item) {
  return {
    type: 'remove_todo',
    data: item,
  };
}
export function editTodo(item) {
  return {
    type: 'edit_todo',
    data: item,
  };
}
export function toggleCompleteTodo(item) {
  return {
    type: 'toggle_complete',
    data: item,
  };
}
export function hydrateTodos(item) {
  return {
    type: 'hydrateTodos',
    data: item,
  };
}
export function setLoadFalse() {
  return {
    type: 'set_load_false',
  };
}
