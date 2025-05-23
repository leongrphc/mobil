import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useAppData } from '../components/TaskContext';

const NotesScreen = () => {
  const { notes, addNote, deleteNote } = useAppData();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');

  const handleAddNote = () => {
    if (!title || !content || !date) {
      Alert.alert('Please fill in all fields');
      return;
    }
    addNote({ title, content, date });
    setTitle('');
    setContent('');
    setDate('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notes</Text>
      <FlatList
        data={notes}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Text style={styles.noteDate}>{item.date}</Text>
            <Text style={styles.noteContent}>{item.content}</Text>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteNote(index)}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No notes yet.</Text>}
      />
      <View style={styles.addNoteSection}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Date (e.g. 2024-05-18)"
          value={date}
          onChangeText={setDate}
        />
        <TextInput
          style={[styles.input, { height: 60 }]}
          placeholder="Content"
          value={content}
          onChangeText={setContent}
          multiline
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAddNote}>
          <Text style={styles.addBtnText}>Add Note</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#222', marginBottom: 18, alignSelf: 'center' },
  noteCard: { backgroundColor: '#FFF', borderRadius: 14, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  noteTitle: { fontSize: 16, fontWeight: '700', color: '#3F51B5' },
  noteDate: { fontSize: 12, color: '#888', marginBottom: 4 },
  noteContent: { fontSize: 14, color: '#222', marginBottom: 8 },
  deleteBtn: { alignSelf: 'flex-end', backgroundColor: '#E57373', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  deleteText: { color: '#FFF', fontWeight: 'bold' },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 40 },
  addNoteSection: { marginTop: 20 },
  input: { backgroundColor: '#FFF', borderRadius: 10, padding: 10, marginBottom: 10, fontSize: 16, borderWidth: 1, borderColor: '#E6E8F0' },
  addBtn: { backgroundColor: '#3F51B5', borderRadius: 20, paddingVertical: 12, alignItems: 'center', marginTop: 6 },
  addBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default NotesScreen; 