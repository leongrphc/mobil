import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, ScrollView, Modal, TextInput } from 'react-native';
import { useAppData } from '../components/TaskContext';

const motivationQuotes = [
  { quote: "The best way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { quote: "Well done is better than well said.", author: "Benjamin Franklin" },
  { quote: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { quote: "Do not wait to strike till the iron is hot; but make it hot by striking.", author: "William Butler Yeats" },
  { quote: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { quote: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer" },
  { quote: "What you do today can improve all your tomorrows.", author: "Ralph Marston" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
];

const profilePhotos = [
  require('../assets/profile-placeholder.png'),
  require('../assets/profile-placeholder2.png'),
  require('../assets/profile-placeholder3.png'),
];

const ProfileScreen = () => {
  const { tasks, finishedTasks, projects, finishedProjects, notes, finishedNotes, profile, updateProfile } = useAppData();
  const [darkMode, setDarkMode] = useState(false);

  // Profil bilgisi (düzenlenebilir)
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [photoIdx, setPhotoIdx] = useState(profile.photoIdx);
  const [editModal, setEditModal] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editEmail, setEditEmail] = useState(email);
  const [editPhotoIdx, setEditPhotoIdx] = useState(photoIdx);

  // Motivasyon sözü
  const [motivation] = useState(() => {
    const idx = Math.floor(Math.random() * motivationQuotes.length);
    return motivationQuotes[idx];
  });

  // İstatistikler
  const activeTasks = tasks.length;
  const completedTasks = finishedTasks.length;
  const activeProjects = projects.length;
  const completedProjects = finishedProjects.length;
  const activeNotes = notes.length;
  const completedNotes = finishedNotes.length;

  // Son tamamlananlar
  const lastTask = finishedTasks[0];
  const lastProject = finishedProjects[0];
  const lastNote = finishedNotes[0];

  // Rozetler
  const badges = [];
  if (completedTasks >= 10) badges.push({ icon: '🏅', label: '10 Tasks Completed' });
  if (completedProjects >= 5) badges.push({ icon: '🎖️', label: '5 Projects Completed' });
  if (completedNotes >= 10) badges.push({ icon: '📝', label: '10 Notes Taken' });
  if (completedTasks >= 1 && completedProjects >= 1 && completedNotes >= 1) badges.push({ icon: '🌟', label: 'All-Rounder' });

  return (
    <ScrollView style={[styles.container, darkMode && { backgroundColor: '#23243a' }]} contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
      {/* Profil Bilgisi */}
      <Image source={profilePhotos[profile.photoIdx]} style={styles.avatar} />
      <Text style={[styles.name, darkMode && { color: '#FFF' }]}>{profile.name}</Text>
      <Text style={[styles.email, darkMode && { color: '#BBB' }]}>{profile.email}</Text>
      <TouchableOpacity style={styles.editBtn} onPress={() => {
        setEditName(name); setEditEmail(email); setEditPhotoIdx(photoIdx); setEditModal(true);
      }}>
        <Text style={styles.editBtnText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* İstatistikler */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{completedTasks}</Text>
          <Text style={styles.statLabel}>Completed Tasks</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{completedProjects}</Text>
          <Text style={styles.statLabel}>Completed Projects</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{completedNotes}</Text>
          <Text style={styles.statLabel}>Completed Notes</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{activeTasks}</Text>
          <Text style={styles.statLabel}>Active Tasks</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{activeProjects}</Text>
          <Text style={styles.statLabel}>Active Projects</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{activeNotes}</Text>
          <Text style={styles.statLabel}>Active Notes</Text>
        </View>
      </View>

      {/* Last Completed */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, darkMode && { color: '#FFF' }]}>Last Completed</Text>
        {!lastTask && !lastProject && !lastNote ? (
          <Text style={[styles.empty, darkMode && { color: '#BBB' }]}>No completed items yet.</Text>
        ) : (
          <>
            {lastTask && (
              <View style={styles.lastItem}><Text style={styles.emoji}>🗂️</Text><Text style={styles.lastText}>{lastTask.title}</Text></View>
            )}
            {lastProject && (
              <View style={styles.lastItem}><Text style={styles.emoji}>📁</Text><Text style={styles.lastText}>{lastProject.title}</Text></View>
            )}
            {lastNote && (
              <View style={styles.lastItem}><Text style={styles.emoji}>📝</Text><Text style={styles.lastText}>{lastNote.title}</Text></View>
            )}
          </>
        )}
      </View>

      {/* Motivation */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, darkMode && { color: '#FFF' }]}>Motivation</Text>
        <Text style={[styles.motivationQuote, darkMode && { color: '#FFF' }]}>
          “{motivation.quote}”
        </Text>
        <Text style={[styles.motivationAuthor, darkMode && { color: '#BBB' }]}>- {motivation.author}</Text>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, darkMode && { color: '#FFF' }]}>App Info</Text>
        <Text style={[styles.infoText, darkMode && { color: '#BBB' }]}>Productivity App v1.0.0</Text>
        <TouchableOpacity style={styles.infoBtn}>
          <Text style={styles.infoBtnText}>Send Feedback</Text>
        </TouchableOpacity>
      </View>

      {/* Rozetler */}
      {badges.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && { color: '#FFF' }]}>Badges</Text>
          <View style={styles.badgeRow}>
            {badges.map((badge, i) => (
              <View key={i} style={styles.badge}>
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <Text style={styles.badgeLabel}>{badge.label}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Edit Profile Modal */}
      <Modal visible={editModal} transparent animationType="slide" onRequestClose={() => setEditModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 24, minWidth: 280, alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Edit Profile</Text>
            <TouchableOpacity onPress={() => setEditPhotoIdx((editPhotoIdx + 1) % profilePhotos.length)}>
              <Image source={profilePhotos[editPhotoIdx]} style={[styles.avatar, { marginTop: 0, marginBottom: 12 }]} />
              <Text style={{ color: '#3F51B5', fontSize: 13, marginBottom: 8 }}>Change Photo</Text>
            </TouchableOpacity>
            <TextInput
              style={{ borderWidth: 1, borderColor: '#E6E8F0', borderRadius: 10, padding: 10, width: 220, marginBottom: 12, fontSize: 16 }}
              value={editName}
              onChangeText={setEditName}
              placeholder="Name"
            />
            <TextInput
              style={{ borderWidth: 1, borderColor: '#E6E8F0', borderRadius: 10, padding: 10, width: 220, marginBottom: 12, fontSize: 16 }}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="Email"
              keyboardType="email-address"
            />
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <TouchableOpacity
                style={{ backgroundColor: '#3F51B5', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 24, marginRight: 10 }}
                onPress={() => {
                  updateProfile({ name: editName, email: editEmail, photoIdx: editPhotoIdx });
                  setName(editName);
                  setEmail(editEmail);
                  setPhotoIdx(editPhotoIdx);
                  setEditModal(false);
                }}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: '#EEE', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 24 }}
                onPress={() => setEditModal(false)}
              >
                <Text style={{ color: '#3F51B5', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  avatar: { width: 90, height: 90, borderRadius: 45, marginTop: 32, marginBottom: 8, backgroundColor: '#DDD' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#222', marginBottom: 2, textAlign: 'center' },
  email: { color: '#666', fontSize: 15, marginBottom: 8, textAlign: 'center' },
  editBtn: { backgroundColor: '#3F51B5', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 18, marginBottom: 18 },
  editBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '100%', marginBottom: 8 },
  statBox: { alignItems: 'center', backgroundColor: '#FFF', borderRadius: 14, paddingVertical: 12, margin: 6, width: '30%', minWidth: 90, elevation: 2 },
  statNum: { fontSize: 20, fontWeight: 'bold', color: '#3F51B5' },
  statLabel: { fontSize: 13, color: '#666', marginTop: 2 },
  section: { width: '90%', backgroundColor: '#FFF', borderRadius: 16, padding: 18, marginTop: 18, elevation: 2 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#222', marginBottom: 10 },
  empty: { color: '#888', fontSize: 15, textAlign: 'center' },
  lastItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  emoji: { fontSize: 18, marginRight: 8 },
  lastText: { fontSize: 15, color: '#222' },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E6E8F0', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6, marginRight: 10, marginBottom: 8 },
  badgeIcon: { fontSize: 18, marginRight: 6 },
  badgeLabel: { fontSize: 13, color: '#3F51B5', fontWeight: '600' },
  motivationQuote: { fontSize: 16, fontStyle: 'italic', textAlign: 'center', marginBottom: 4 },
  motivationAuthor: { fontSize: 13, textAlign: 'center', color: '#888' },
  infoText: { color: '#666', fontSize: 14, marginBottom: 8 },
  infoBtn: { backgroundColor: '#3F51B5', borderRadius: 16, paddingVertical: 10, alignItems: 'center', marginTop: 6 },
  infoBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
});

export default ProfileScreen; 