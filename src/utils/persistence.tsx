import { createMMKV, MMKV } from 'react-native-mmkv';

const storage = createMMKV();

const KEY = 'TODOS';

export const saveTodos = (todos: any) => {
  // console.log(todos);

  storage.set(KEY, JSON.stringify(todos));
};

export const loadTodos = () => {
  const data = storage.getString(KEY);

  return data ? JSON.parse(data) : [];
};
