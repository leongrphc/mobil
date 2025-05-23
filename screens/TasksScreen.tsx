import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Modal, Alert } from 'react-native';
import { useAppData } from '../components/TaskContext';
import AntDesign from 'react-native-vector-icons/AntDesign';

const categoryEmojis: Record<string, string> = {
  'Meeting': '📅',
  'UI Design': '🎨',
  'Development': '💻',
  'Marketing': '📢',
};

// Helper to get next 7 days
const getNext7Days = () => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      date: d.toISOString().slice(0, 10),
      day: d.getDate(),
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
    });
  }
  return days;
};

const TasksScreen = () => {
  const { tasks, projects, notes, deleteTask, deleteProject, deleteNote } = useAppData();
  const [selectedDate, setSelectedDate] = useState(getNext7Days()[0].date);
  const [menuTaskId, setMenuTaskId] = useState<string | null>(null);
  const [showTasks, setShowTasks] = useState(true);
  const [showProjects, setShowProjects] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const days = getNext7Days();

  // Helper to count items for a date
  const getCounts = (date: string) => ({
    tasks: tasks.filter(t => t.date === date).length,
    projects: projects.filter(p => p.startDate === date || p.endDate === date).length,
    notes: notes.filter(n => n.date === date).length,
  });

  const filteredTasks = tasks.filter(task => task.date === selectedDate);
  const filteredProjects = projects.filter(p => p.startDate === selectedDate || p.endDate === selectedDate);
  const filteredNotes = notes.filter(n => n.date === selectedDate);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Day</Text>
      <FlatList
        data={days}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.date}
        style={styles.dateList}
        renderItem={({ item }) => {
          const counts = getCounts(item.date);
          return (
            <TouchableOpacity
              style={[styles.datePill, selectedDate === item.date && styles.datePillActive]}
              onPress={() => setSelectedDate(item.date)}
            >
              <Text style={selectedDate === item.date ? styles.dateDayActive : styles.dateDay}>{item.day}</Text>
              <Text style={selectedDate === item.date ? styles.dateWeekdayActive : styles.dateWeekday}>{item.weekday}</Text>
              {/* Görev/Proje/Not bilgisi */}
              <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                {counts.tasks > 0 && (
                  <Text style={{ fontSize: 18, marginVertical: 1, textAlign: 'center' }}>{'🗂️'}</Text>
                )}
                {counts.projects > 0 && (
                  <Text style={{ fontSize: 18, marginVertical: 1, textAlign: 'center' }}>{'📁'}</Text>
                )}
                {counts.notes > 0 && (
                  <Text style={{ fontSize: 18, marginVertical: 1, textAlign: 'center' }}>{'📝'}</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
      {/* Expandable Tasks Section */}
      <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowTasks(v => !v)}>
        <Text style={styles.sectionTitle}>Tasks</Text>
        <AntDesign name={showTasks ? 'up' : 'down'} size={18} color="#3F51B5" />
      </TouchableOpacity>
      {showTasks && (
        <ScrollView style={{ maxHeight: 180 }}>
          {filteredTasks.length === 0 ? (
            <Text style={styles.empty}>No tasks for this day.</Text>
          ) : (
            filteredTasks.map(task => (
              <View key={task.id} style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.emoji}>{categoryEmojis[task.category] || '🗂️'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{task.title}</Text>
                    <Text style={styles.date}>{task.date}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setMenuTaskId(task.id)}>
                    <Text style={styles.menuDots}>⋮</Text>
                  </TouchableOpacity>
                </View>
                {task.description ? (
                  <Text style={styles.desc}>{task.description}</Text>
                ) : null}
                <Text style={styles.category}>{task.category}</Text>
                {/* Menu Modal Placeholder */}
                <Modal
                  visible={menuTaskId === task.id}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setMenuTaskId(null)}
                >
                  <TouchableOpacity style={styles.menuOverlay} onPress={() => setMenuTaskId(null)}>
                    <View style={styles.menuModal}>
                      <TouchableOpacity onPress={() => { setMenuTaskId(null); Alert.alert('Edit coming soon!'); }}>
                        <Text style={styles.menuItem}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        setMenuTaskId(null);
                        Alert.alert(
                          'Delete Task',
                          'Are you sure you want to delete this task?',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Delete', style: 'destructive', onPress: () => deleteTask(task.id) },
                          ]
                        );
                      }}>
                        <Text style={[styles.menuItem, { color: '#E57373' }]}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Modal>
              </View>
            ))
          )}
        </ScrollView>
      )}
      {/* Expandable Projects Section */}
      <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowProjects(v => !v)}>
        <Text style={styles.sectionTitle}>Projects</Text>
        <AntDesign name={showProjects ? 'up' : 'down'} size={18} color="#3F51B5" />
      </TouchableOpacity>
      {showProjects && (
        <ScrollView style={{ maxHeight: 120 }}>
          {filteredProjects.length === 0 ? (
            <Text style={styles.empty}>No projects for this day.</Text>
          ) : (
            filteredProjects.map(project => (
              <View key={project.id} style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.emoji}>📁</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{project.title}</Text>
                    <Text style={styles.date}>{project.startDate} - {project.endDate}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setMenuTaskId(project.id + '-project')}>
                    <Text style={styles.menuDots}>⋮</Text>
                  </TouchableOpacity>
                </View>
                {project.description ? <Text style={styles.desc}>{project.description}</Text> : null}
                <Text style={styles.category}>{project.status}</Text>
                <Modal
                  visible={menuTaskId === project.id + '-project'}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setMenuTaskId(null)}
                >
                  <TouchableOpacity style={styles.menuOverlay} onPress={() => setMenuTaskId(null)}>
                    <View style={styles.menuModal}>
                      <TouchableOpacity onPress={() => { setMenuTaskId(null); Alert.alert('Edit coming soon!'); }}>
                        <Text style={styles.menuItem}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        setMenuTaskId(null);
                        Alert.alert(
                          'Delete Project',
                          'Are you sure you want to delete this project?',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Delete', style: 'destructive', onPress: () => deleteProject(project.id) },
                          ]
                        );
                      }}>
                        <Text style={[styles.menuItem, { color: '#E57373' }]}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Modal>
              </View>
            ))
          )}
        </ScrollView>
      )}
      {/* Expandable Notes Section */}
      <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowNotes(v => !v)}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <AntDesign name={showNotes ? 'up' : 'down'} size={18} color="#3F51B5" />
      </TouchableOpacity>
      {showNotes && (
        <ScrollView style={{ maxHeight: 120 }}>
          {filteredNotes.length === 0 ? (
            <Text style={styles.empty}>No notes for this day.</Text>
          ) : (
            filteredNotes.map(note => (
              <View key={note.id} style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.emoji}>📝</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{note.title}</Text>
                    <Text style={styles.date}>{note.date}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setMenuTaskId(note.id + '-note')}>
                    <Text style={styles.menuDots}>⋮</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.desc}>{note.content}</Text>
                <Modal
                  visible={menuTaskId === note.id + '-note'}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setMenuTaskId(null)}
                >
                  <TouchableOpacity style={styles.menuOverlay} onPress={() => setMenuTaskId(null)}>
                    <View style={styles.menuModal}>
                      <TouchableOpacity onPress={() => { setMenuTaskId(null); Alert.alert('Edit coming soon!'); }}>
                        <Text style={styles.menuItem}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        setMenuTaskId(null);
                        Alert.alert(
                          'Delete Note',
                          'Are you sure you want to delete this note?',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Delete', style: 'destructive', onPress: () => deleteNote(note.id) },
                          ]
                        );
                      }}>
                        <Text style={[styles.menuItem, { color: '#E57373' }]}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Modal>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#222', marginBottom: 10, alignSelf: 'center' },
  dateList: { marginBottom: 18 },
  datePill: { alignItems: 'center', padding: 10, borderRadius: 14, backgroundColor: '#E6E8F0', marginRight: 10, width: 54, minHeight: 90, justifyContent: 'flex-start' },
  datePillActive: { backgroundColor: '#3F51B5' },
  dateDay: { color: '#3F51B5', fontWeight: '700', fontSize: 18 },
  dateDayActive: { color: '#FFF', fontWeight: '700', fontSize: 18 },
  dateWeekday: { color: '#3F51B5', fontWeight: '500', fontSize: 13 },
  dateWeekdayActive: { color: '#FFF', fontWeight: '500', fontSize: 13 },
  empty: { color: '#888', fontSize: 16, textAlign: 'center', marginTop: 40 },
  card: { backgroundColor: '#FFF', borderRadius: 14, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  emoji: { fontSize: 28, marginRight: 12 },
  title: { fontSize: 17, fontWeight: 'bold', color: '#222' },
  date: { fontSize: 13, color: '#3F51B5', fontWeight: '500' },
  desc: { fontSize: 14, color: '#444', marginTop: 6, marginBottom: 4 },
  category: { fontSize: 12, color: '#888', alignSelf: 'flex-end', fontWeight: '600' },
  menuDots: { fontSize: 24, color: '#888', paddingHorizontal: 8 },
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center' },
  menuModal: { backgroundColor: '#FFF', borderRadius: 12, padding: 18, minWidth: 120, alignItems: 'flex-start', elevation: 5 },
  menuItem: { fontSize: 16, paddingVertical: 6, fontWeight: '500', color: '#222' },
  countRow: { flexDirection: 'row', marginTop: 4, justifyContent: 'center', alignItems: 'center' },
  countItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 2, backgroundColor: 'rgba(63,81,181,0.08)', borderRadius: 8, paddingHorizontal: 4, paddingVertical: 1 },
  countIcon: { fontSize: 13, marginRight: 2 },
  countText: { fontSize: 13, color: '#3F51B5', fontWeight: 'bold' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#E6E8F0', borderRadius: 10, padding: 10, marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#3F51B5' },
  iconStack: { flexDirection: 'column', alignItems: 'center', marginTop: 4 },
  stackIcon: { fontSize: 16, marginVertical: 1 },
});

export default TasksScreen; 