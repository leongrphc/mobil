import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProjectsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.emoji}>📁</Text>
    <Text style={styles.text}>Projects</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F6FA' },
  emoji: { fontSize: 48, marginBottom: 12 },
  text: { fontSize: 22, fontWeight: 'bold', color: '#222' },
});

export default ProjectsScreen; 