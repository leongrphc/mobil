import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useAppData } from '../components/TaskContext';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

const categories = [
  { label: 'Meeting', emoji: '📅' },
  { label: 'UI Design', emoji: '🎨' },
  { label: 'Development', emoji: '💻' },
  { label: 'Marketing', emoji: '📢' },
];

const AddScreen = () => {
  const [mode, setMode] = useState<'task' | 'project' | 'note'>('task');

  // Task state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [showTaskDate, setShowTaskDate] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Project state
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [showStartDate, setShowStartDate] = useState(false);
  const [endDate, setEndDate] = useState('');
  const [showEndDate, setShowEndDate] = useState(false);
  const [status, setStatus] = useState('Planned');

  // Note state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteDate, setNoteDate] = useState('');
  const [showNoteDate, setShowNoteDate] = useState(false);

  const { addTask, addProject, addNote } = useAppData();
  const navigation = useNavigation<any>();

  const handleCreateTask = () => {
    if (!title || !date || !selectedCategory) {
      Alert.alert('Please fill in all required fields.');
      return;
    }
    addTask({ title, date, description, category: selectedCategory });
    setTitle('');
    setDate('');
    setDescription('');
    setSelectedCategory(null);
    Alert.alert('Success', 'Task added successfully!');
  };

  const handleCreateProject = () => {
    if (!projectTitle || !startDate || !endDate) {
      Alert.alert('Please fill in all required fields.');
      return;
    }
    addProject({ title: projectTitle, description: projectDescription, startDate, endDate, status });
    setProjectTitle('');
    setProjectDescription('');
    setStartDate('');
    setEndDate('');
    setStatus('Planned');
    Alert.alert('Success', 'Project added successfully!');
  };

  const handleCreateNote = () => {
    if (!noteTitle || !noteContent || !noteDate) {
      Alert.alert('Please fill in all required fields.');
      return;
    }
    addNote({ title: noteTitle, content: noteContent, date: noteDate });
    setNoteTitle('');
    setNoteContent('');
    setNoteDate('');
    Alert.alert('Success', 'Note added successfully!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.modeTabs}>
        <TouchableOpacity style={[styles.modeTab, mode === 'task' && styles.modeTabActive]} onPress={() => setMode('task')}>
          <Text style={mode === 'task' ? styles.modeTabTextActive : styles.modeTabText}>Task</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.modeTab, mode === 'project' && styles.modeTabActive]} onPress={() => setMode('project')}>
          <Text style={mode === 'project' ? styles.modeTabTextActive : styles.modeTabText}>Project</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.modeTab, mode === 'note' && styles.modeTabActive]} onPress={() => setMode('note')}>
          <Text style={mode === 'note' ? styles.modeTabTextActive : styles.modeTabText}>Note</Text>
        </TouchableOpacity>
      </View>
      {mode === 'task' && (
        <>
          <Text style={styles.header}>Create New Task</Text>
          <TextInput
            style={styles.input}
            placeholder="Title*"
            value={title}
            onChangeText={setTitle}
          />
          <TouchableOpacity style={styles.input} onPress={() => setShowTaskDate(true)}>
            <Text style={{ color: date ? '#222' : '#888' }}>{date ? date : 'Pick a date*'}</Text>
          </TouchableOpacity>
          {showTaskDate && (
            <DateTimePicker
              value={date ? new Date(date) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowTaskDate(false);
                if (selectedDate) setDate(selectedDate.toISOString().slice(0, 10));
              }}
            />
          )}
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <Text style={styles.label}>Category*</Text>
          <View style={styles.categories}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.label}
                style={[styles.category, selectedCategory === cat.label && styles.categorySelected]}
                onPress={() => setSelectedCategory(cat.label)}
              >
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                <Text style={[styles.categoryText, selectedCategory === cat.label && styles.categoryTextSelected]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleCreateTask}>
            <Text style={styles.buttonText}>Create Task</Text>
          </TouchableOpacity>
        </>
      )}
      {mode === 'project' && (
        <>
          <Text style={styles.header}>Create New Project</Text>
          <TextInput
            style={styles.input}
            placeholder="Title*"
            value={projectTitle}
            onChangeText={setProjectTitle}
          />
          <TouchableOpacity style={styles.input} onPress={() => setShowStartDate(true)}>
            <Text style={{ color: startDate ? '#222' : '#888' }}>{startDate ? startDate : 'Pick start date*'}</Text>
          </TouchableOpacity>
          {showStartDate && (
            <DateTimePicker
              value={startDate ? new Date(startDate) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowStartDate(false);
                if (selectedDate) setStartDate(selectedDate.toISOString().slice(0, 10));
              }}
            />
          )}
          <TouchableOpacity style={styles.input} onPress={() => setShowEndDate(true)}>
            <Text style={{ color: endDate ? '#222' : '#888' }}>{endDate ? endDate : 'Pick end date*'}</Text>
          </TouchableOpacity>
          {showEndDate && (
            <DateTimePicker
              value={endDate ? new Date(endDate) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowEndDate(false);
                if (selectedDate) setEndDate(selectedDate.toISOString().slice(0, 10));
              }}
            />
          )}
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Description"
            value={projectDescription}
            onChangeText={setProjectDescription}
            multiline
          />
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusRow}>
            {['Planned', 'In Progress', 'Completed'].map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.statusPill, status === s && styles.statusPillActive]}
                onPress={() => setStatus(s)}
              >
                <Text style={status === s ? styles.statusPillTextActive : styles.statusPillText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleCreateProject}>
            <Text style={styles.buttonText}>Create Project</Text>
          </TouchableOpacity>
        </>
      )}
      {mode === 'note' && (
        <>
          <Text style={styles.header}>Create New Note</Text>
          <TextInput
            style={styles.input}
            placeholder="Title*"
            value={noteTitle}
            onChangeText={setNoteTitle}
          />
          <TouchableOpacity style={styles.input} onPress={() => setShowNoteDate(true)}>
            <Text style={{ color: noteDate ? '#222' : '#888' }}>{noteDate ? noteDate : 'Pick a date*'}</Text>
          </TouchableOpacity>
          {showNoteDate && (
            <DateTimePicker
              value={noteDate ? new Date(noteDate) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowNoteDate(false);
                if (selectedDate) setNoteDate(selectedDate.toISOString().slice(0, 10));
              }}
            />
          )}
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Content*"
            value={noteContent}
            onChangeText={setNoteContent}
            multiline
          />
          <TouchableOpacity style={styles.button} onPress={handleCreateNote}>
            <Text style={styles.buttonText}>Create Note</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA', padding: 24 },
  modeTabs: { flexDirection: 'row', justifyContent: 'center', marginBottom: 18 },
  modeTab: { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 20, backgroundColor: '#E6E8F0', marginRight: 10 },
  modeTabActive: { backgroundColor: '#3F51B5' },
  modeTabText: { color: '#3F51B5', fontWeight: '500', fontSize: 16 },
  modeTabTextActive: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#222', marginBottom: 24, alignSelf: 'center' },
  input: { backgroundColor: '#FFF', borderRadius: 10, padding: 12, marginBottom: 14, fontSize: 16, borderWidth: 1, borderColor: '#E6E8F0' },
  label: { fontSize: 16, fontWeight: '600', color: '#222', marginBottom: 8 },
  categories: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 },
  category: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E6E8F0', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 10, marginBottom: 10 },
  categorySelected: { backgroundColor: '#3F51B5' },
  categoryEmoji: { fontSize: 18, marginRight: 6 },
  categoryText: { color: '#3F51B5', fontWeight: '500' },
  categoryTextSelected: { color: '#FFF', fontWeight: '700' },
  button: { backgroundColor: '#3F51B5', borderRadius: 20, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  statusRow: { flexDirection: 'row', marginBottom: 18 },
  statusPill: { backgroundColor: '#E6E8F0', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, marginRight: 10 },
  statusPillActive: { backgroundColor: '#3F51B5' },
  statusPillText: { color: '#3F51B5', fontWeight: '500' },
  statusPillTextActive: { color: '#FFF', fontWeight: '700' },
});

export default AddScreen; 