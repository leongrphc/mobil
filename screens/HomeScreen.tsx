import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useAppData } from '../components/TaskContext';

const getToday = () => new Date().toISOString().slice(0, 10);
const today = getToday();

const profilePhotos = [
  require('../assets/profile-placeholder.png'),
  require('../assets/profile-placeholder2.png'),
  require('../assets/profile-placeholder3.png'),
];

const HomeScreen = () => {
  const { tasks, projects, notes, profile, finishTask, finishedTasks, deleteFinishedTask, finishProject, finishedProjects, deleteFinishedProject, finishNote, finishedNotes, deleteFinishedNote } = useAppData();
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Quick stats for today
  const todayTasks = tasks.filter(t => t.date === today);
  const todayProjects = projects.filter(p => p.startDate === today || p.endDate === today);
  const todayNotes = notes.filter(n => n.date === today);

  // Upcoming items (next 3 by date, any type)
  const allItems = [
    ...tasks.map(t => ({ ...t, type: 'task', date: t.date })),
    ...projects.map(p => ({ ...p, type: 'project', date: p.startDate })),
    ...notes.map(n => ({ ...n, type: 'note', date: n.date })),
  ];
  const upcoming = allItems
    .filter(item => item.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  const typeIcon = (type: string) => type === 'task' ? '🗂️' : type === 'project' ? '📁' : '📝';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, <Text style={styles.bold}>{profile.name}!</Text></Text>
          <Text style={styles.subtext}>Here's your overview for today</Text>
        </View>
        <Image source={profilePhotos[profile.photoIdx]} style={styles.avatar} />
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Today's Overview</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>🗂️</Text>
            </View>
            <Text style={styles.statNum}>{todayTasks.length}</Text>
            <Text style={styles.statLabel}>Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>📁</Text>
            </View>
            <Text style={styles.statNum}>{todayProjects.length}</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>📝</Text>
            </View>
            <Text style={styles.statNum}>{todayNotes.length}</Text>
            <Text style={styles.statLabel}>Notes</Text>
          </View>
        </View>
      </View>

      <View style={styles.upcomingContainer}>
        <Text style={styles.sectionTitle}>Upcoming</Text>
        <View style={styles.upcomingList}>
          {upcoming.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.empty}>No upcoming items</Text>
            </View>
          ) : (
            upcoming.map((item, idx) => (
              <TouchableOpacity
                key={item.id + item.type}
                style={styles.upcomingCard}
                onPress={() => { setSelectedItem(item); setShowModal(true); }}
              >
                <View style={styles.upcomingIconContainer}>
                  <Text style={styles.upcomingIcon}>{typeIcon(item.type)}</Text>
                </View>
                <View style={styles.upcomingContent}>
                  <Text style={styles.upcomingTitle}>{item.title}</Text>
                  <Text style={styles.upcomingDate}>{item.date}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
      {/* Finished Tasks Section */}
      {finishedTasks.length > 0 && (
        <View style={styles.upcomingContainer}>
          <Text style={styles.sectionTitle}>Finished Tasks</Text>
          <View style={styles.upcomingList}>
            {finishedTasks.map(task => (
              <View key={task.id} style={styles.upcomingCard}>
                <View style={styles.upcomingIconContainer}>
                  <Text style={styles.upcomingIcon}>🗂️</Text>
                </View>
                <View style={styles.upcomingContent}>
                  <Text style={styles.upcomingTitle}>{task.title}</Text>
                  <Text style={styles.upcomingDate}>{task.date}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteFinishedTask(task.id)} style={{ marginLeft: 8 }}>
                  <Text style={{ fontSize: 18 }}>🗑️</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
      {/* Finished Projects Section */}
      {finishedProjects.length > 0 && (
        <View style={styles.upcomingContainer}>
          <Text style={styles.sectionTitle}>Finished Projects</Text>
          <View style={styles.upcomingList}>
            {finishedProjects.map(project => (
              <View key={project.id} style={styles.upcomingCard}>
                <View style={styles.upcomingIconContainer}>
                  <Text style={styles.upcomingIcon}>📁</Text>
                </View>
                <View style={styles.upcomingContent}>
                  <Text style={styles.upcomingTitle}>{project.title}</Text>
                  <Text style={styles.upcomingDate}>{project.startDate} - {project.endDate}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteFinishedProject(project.id)} style={{ marginLeft: 8 }}>
                  <Text style={{ fontSize: 18 }}>🗑️</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
      {/* Finished Notes Section */}
      {finishedNotes.length > 0 && (
        <View style={styles.upcomingContainer}>
          <Text style={styles.sectionTitle}>Finished Notes</Text>
          <View style={styles.upcomingList}>
            {finishedNotes.map(note => (
              <View key={note.id} style={styles.upcomingCard}>
                <View style={styles.upcomingIconContainer}>
                  <Text style={styles.upcomingIcon}>📝</Text>
                </View>
                <View style={styles.upcomingContent}>
                  <Text style={styles.upcomingTitle}>{note.title}</Text>
                  <Text style={styles.upcomingDate}>{note.date}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteFinishedNote(note.id)} style={{ marginLeft: 8 }}>
                  <Text style={{ fontSize: 18 }}>🗑️</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
      {/* Detay Modalı */}
      {selectedItem && (
        <Modal
          visible={showModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 24, minWidth: 280, alignItems: 'center' }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>{selectedItem.title}</Text>
              <Text style={{ fontSize: 15, color: '#3F51B5', marginBottom: 8 }}>{selectedItem.date}</Text>
              {selectedItem.description && <Text style={{ fontSize: 15, marginBottom: 8 }}>{selectedItem.description}</Text>}
              {selectedItem.type === 'task' && (
                <TouchableOpacity
                  style={{ backgroundColor: '#3F51B5', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 24, marginTop: 12 }}
                  onPress={() => {
                    finishTask(selectedItem.id);
                    setShowModal(false);
                  }}
                >
                  <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Finished</Text>
                </TouchableOpacity>
              )}
              {selectedItem.type === 'project' && (
                <TouchableOpacity
                  style={{ backgroundColor: '#3F51B5', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 24, marginTop: 12 }}
                  onPress={() => {
                    finishProject(selectedItem.id);
                    setShowModal(false);
                  }}
                >
                  <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Finished</Text>
                </TouchableOpacity>
              )}
              {selectedItem.type === 'note' && (
                <TouchableOpacity
                  style={{ backgroundColor: '#3F51B5', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 24, marginTop: 12 }}
                  onPress={() => {
                    finishNote(selectedItem.id);
                    setShowModal(false);
                  }}
                >
                  <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Finished</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setShowModal(false)} style={{ marginTop: 16 }}>
                <Text style={{ color: '#3F51B5', fontWeight: 'bold' }}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F6FA',
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20,
    paddingTop: 40,
  },
  greeting: { 
    fontSize: 24, 
    color: '#222',
    marginBottom: 4,
  },
  bold: { 
    fontWeight: 'bold', 
    color: '#222' 
  },
  subtext: { 
    color: '#666', 
    fontSize: 15,
  },
  avatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25,
    backgroundColor: '#DDD',
  },
  statsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#222',
    marginBottom: 16,
  },
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
  },
  statCard: { 
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: { 
    fontSize: 20,
  },
  statNum: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#3F51B5',
    marginBottom: 4,
  },
  statLabel: { 
    fontSize: 14, 
    color: '#666',
  },
  upcomingContainer: {
    padding: 20,
    paddingTop: 0,
  },
  upcomingList: {
    gap: 12,
  },
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  upcomingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  upcomingIcon: { 
    fontSize: 20,
  },
  upcomingContent: {
    flex: 1,
  },
  upcomingTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#222',
    marginBottom: 4,
  },
  upcomingDate: { 
    fontSize: 13, 
    color: '#3F51B5',
  },
  emptyCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  empty: { 
    color: '#666', 
    fontSize: 16,
  },
});

export default HomeScreen; 