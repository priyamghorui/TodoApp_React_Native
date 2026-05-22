import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Modal,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CheckCircle2,
  Circle,
  Trash2,
  Edit3,
  Eye,
  Plus,
  Search,
  Sparkles,
  X,
  Calendar,
} from 'lucide-react-native';
import {
  addTodo,
  editTodo,
  removeTodo,
  toggleCompleteTodo,
} from '../redux/action/action';
import { useDispatch, useSelector } from 'react-redux';
import LoadTodos from '../components/home/LoadTodos';

const formatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export default function Home() {
  const todosRedux = useSelector(state => state.todoReducer);
  const loadReducer = useSelector(state => state.loadReducer);
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  const [todoTitle, setTodoTitle] = useState('');
  const [todoInput, setTodoInput] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [viewingTodo, setViewingTodo] = useState(null);

  const titleInputRef = useRef(null);

  const handleModalShow = () => {
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 100);
  };

  const handleOpenAddModal = () => {
    setEditingTodoId(null);
    setTodoTitle('');
    setTodoInput('');
    setModalVisible(true);
  };

  const handleOpenEditModal = todo => {
    setEditingTodoId(todo.id);
    setTodoTitle(todo.titel || '');
    setTodoInput(todo.text || '');
    setModalVisible(true);
  };

  const handleOpenViewModal = todo => {
    setViewingTodo(todo);
    setViewModalVisible(true);
  };

  const handleSaveTodo = () => {
    if (!todoTitle.trim()) return;

    if (editingTodoId) {
      dispatch(
        editTodo({
          id: editingTodoId,
          titel: todoTitle.trim(),
          text: todoInput.trim(),
        }),
      );
    } else {
      const newTodo = {
        id: Date.now().toString(),
        titel: todoTitle.trim(),
        text: todoInput.trim(),
        completed: false,
        createdAt: Date.now(),
      };

      dispatch(addTodo(newTodo));
    }

    Keyboard.dismiss();
    setTodoTitle('');
    setTodoInput('');
    setModalVisible(false);
    setEditingTodoId(null);
  };

  const handleDeleteTodo = id => {
    dispatch(removeTodo(id));
  };

  const toggleComplete = id => {
    dispatch(toggleCompleteTodo({ id: id }));
  };

  const filteredTodos = todosRedux.filter(
    todo =>
      (todo.titel || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.text || '').toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>TaskFlow</Text>
          <Text style={styles.subtitle}>Get things done today</Text>
        </View>
        <View style={styles.coolBadge}>
          <Text style={styles.coolBadgeText}>V 1.0</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Search color="#94a3b8" size={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your tasks..."
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.statsBanner}>
        <Text style={styles.statsText}>
          {todosRedux.filter(t => t.completed).length} of {todosRedux.length}{' '}
          tasks completed
        </Text>
      </View>
      {loadReducer ? (
        <LoadTodos />
      ) : (
        <FlatList
          data={filteredTodos}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No tasks found. Time to relax! ☕
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.todoCard,
                item.completed && styles.todoCardCompleted,
              ]}
            >
              <TouchableOpacity
                onPress={() => toggleComplete(item.id)}
                style={styles.todoCheckContainer}
              >
                {item.completed ? (
                  <CheckCircle2
                    color="#22c55e"
                    size={22}
                    style={styles.checkIcon}
                  />
                ) : (
                  <Circle color="#64748b" size={22} style={styles.checkIcon} />
                )}
                <View style={styles.todoContentBlock}>
                  <Text
                    style={[
                      styles.todoTitleText,
                      item.completed && styles.todoTextCompleted,
                    ]}
                  >
                    {item.titel}
                  </Text>

                  {item.text ? (
                    <Text
                      style={[
                        styles.todoBodySnippet,
                        item.completed && styles.todoTextCompleted,
                      ]}
                      numberOfLines={1}
                    >
                      {item.text}
                    </Text>
                  ) : null}

                  <View style={styles.dateBadgeContainer}>
                    <Calendar color="#64748b" size={12} />
                    <Text style={styles.todoDateText}>
                      {formatter.format(item.createdAt)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={() => handleOpenViewModal(item)}
                  style={styles.iconButton}
                >
                  <Eye color="#6366f1" size={18} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleOpenEditModal(item)}
                  style={styles.iconButton}
                >
                  <Edit3 color="#94a3b8" size={18} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteTodo(item.id)}
                  style={styles.iconButton}
                >
                  <Trash2 color="#ef4444" size={18} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={handleOpenAddModal}>
        <Plus color="#ffffff" size={28} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onShow={handleModalShow}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingTodoId ? 'Edit Task' : 'Create New Task'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color="#94a3b8" size={22} />
              </TouchableOpacity>
            </View>

            <TextInput
              ref={titleInputRef}
              style={styles.modalTitleInput}
              placeholder="Task Title..."
              placeholderTextColor="#64748b"
              value={todoTitle}
              onChangeText={setTodoTitle}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Add description notes (optional)..."
              placeholderTextColor="#64748b"
              value={todoInput}
              onChangeText={setTodoInput}
              multiline
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveTodo}
            >
              <Text style={styles.saveButtonText}>
                {editingTodoId ? 'Save Changes' : 'Add Task'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={viewModalVisible}
        onRequestClose={() => setViewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={2}>
                {viewingTodo?.titel}
              </Text>
              <TouchableOpacity onPress={() => setViewModalVisible(false)}>
                <X color="#94a3b8" size={22} />
              </TouchableOpacity>
            </View>

            <View style={styles.viewTimelineRow}>
              <Calendar color="#64748b" size={14} />
              <Text style={styles.viewDateText}>
                Created on {viewingTodo ? formatter.format(viewingTodo.createdAt) : ''}
              </Text>
            </View>

            <View style={styles.viewBodyWrapper}>
              <Text style={styles.viewBodyText}>
                {viewingTodo?.text || 'No additional description provided.'}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155' }]}
              onPress={() => setViewModalVisible(false)}
            >
              <Text style={[styles.saveButtonText, { color: '#94a3b8' }]}>Close Preview</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  coolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1b4b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#312e81',
  },
  coolBadgeText: {
    color: '#818cf8',
    fontSize: 12,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#334155',
  },
  todoContentBlock: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 12,
  },
  dateBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  todoDateText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 15,
  },
  statsBanner: {
    paddingHorizontal: 20,
    marginVertical: 4,
  },
  statsText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#475569',
    fontSize: 15,
    textAlign: 'center',
  },
  todoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
    elevation: 2,
  },
  todoCardCompleted: {
    opacity: 0.6,
    backgroundColor: '#111827',
    borderColor: '#1f2937',
  },
  todoCheckContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    paddingRight: 10,
  },
  checkIcon: {
    marginTop: 2,
  },
  todoTitleText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  todoBodySnippet: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '400',
    marginTop: 2,
    lineHeight: 18,
  },
  todoTextCompleted: {
    color: '#64748b',
    textDecorationLine: 'line-through',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  iconButton: {
    padding: 6,
    marginLeft: 2,
  },
  viewTimelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewDateText: {
    color: '#64748b',
    fontSize: 13,
    marginLeft: 6,
  },
  viewBodyWrapper: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  viewBodyText: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#6366f1',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderTopWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    paddingRight: 10,
  },
  modalTitleInput: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 16,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 10 : 0,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});