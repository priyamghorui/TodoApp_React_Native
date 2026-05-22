import { saveTodos } from '../../utils/persistence';

const initialstate: any = [];
export const todoReducer = (state = initialstate, action: any) => {
  // console.log(">>",state,this);
  switch (action.type) {
    case 'add_todo':
      saveTodos([...state, action.data]);
      return [...state, action.data];
    case 'remove_todo':
      // console.log('>', action.data);
      const dataAfterRemoveItem = state.filter(e => e.id != action.data);
      // console.log(dataAfterRemoveItem);
      saveTodos(dataAfterRemoveItem);
      return dataAfterRemoveItem;
    case 'edit_todo':
      saveTodos(
        state.map(todo =>
          todo.id === action.data.id
            ? { ...todo, text: action.data.text, titel: action.data.titel }
            : todo,
        ),
      );
      return state.map(todo =>
        todo.id === action.data.id
          ? { ...todo, text: action.data.text, titel: action.data.titel }
          : todo,
      );
    case 'toggle_complete':
      saveTodos(
        state.map(todo =>
          todo.id === action.data.id
            ? { ...todo, completed: todo.completed == true ? false : true }
            : todo,
        ),
      );
      return state.map(todo =>
        todo.id === action.data.id
          ? { ...todo, completed: todo.completed == true ? false : true }
          : todo,
      );
    case 'hydrateTodos':
      // console.log('<>', action.data);

      return action.data;
    default:
      return state;
  }
};
