import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import {
  Bell,
  Settings,
  Calendar,
  ShieldCheck,
  Video,
  CreditCard,
  ChevronRight,
  Clock,
  Star,
  Play,
} from 'lucide-react-native';

import aminaImage from '../../assets/images/amina.png';
import danielImage from '../../assets/images/daniel.png';

// --- Mock Data ---
const UPCOMING_SESSIONS = [
  {
    id: '1',
    month: 'AUG',
    day: '21',
    doctor: 'Dr. Sarah Dixon',
    type: 'Medical',
    time: '11:30 AM - 12:00 PM',
  },
  {
    id: '2',
    month: 'AUG',
    day: '22',
    doctor: 'Marketing Team Sync',
    type: 'Work',
    time: '2:00 PM - 3:00 PM',
  },
];

const AVAILABLE_INTERPRETERS = [
  {
    id: '1',
    name: 'Amina Okafor',
    rating: 4.9,
    languages: ['USL', 'English'],
    image: aminaImage,
  },
  {
    id: '2',
    name: 'Daniel Brooks',
    rating: 4.9,
    languages: ['USL', 'English'],
    image: danielImage,
  },
];

export default function HomeScreen() {
// export default function DeafUserDashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FE" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- Header --- */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingTitle}>Good morning,</Text>
            <Text style={styles.greetingSubtitle}>
              How can we help you communicate today?
            </Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Bell color="#1E1E2D" size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Settings color="#1E1E2D" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Hero Card (Start Session) --- */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTag}>ON-DEMAND SERVICE</Text>
            <Text style={styles.heroTitle}>Start session now</Text>
            <Text style={styles.heroSubtitle}>
              Connect with a certified interpreter in under two minutes.
            </Text>
            <TouchableOpacity style={styles.startButton}>
              <Play color="#4C3C9B" size={16} fill="#4C3C9B" />
              <Text style={styles.startButtonText}>Start VRI Session</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Quick Actions (Schedule & Accessibility) --- */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIconBg, { backgroundColor: '#F3EFFF' }]}>
              <Calendar color="#8A70E8" size={20} />
            </View>
            <Text style={styles.actionTitle}>Schedule</Text>
            <Text style={styles.actionSubtitle}>Book for later</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIconBg, { backgroundColor: '#E6F8F6' }]}>
              <ShieldCheck color="#3BC3B0" size={20} />
            </View>
            <Text style={styles.actionTitle}>Accessibility</Text>
            <Text style={styles.actionSubtitle}>Setup preferred</Text>
          </TouchableOpacity>
        </View>

        {/* --- Activity Overview --- */}
        <Text style={styles.sectionTitle}>Activity Overview</Text>
        <View style={styles.quickActionsRow}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={[styles.actionIconBg, { backgroundColor: '#F3EFFF' }]}>
                <Video color="#8A70E8" size={20} />
              </View>
              <Text style={styles.statValue}></Text>
            </View>
            <Text style={styles.statLabel}>SESSIONS</Text>
            {/* <Text style={styles.statValue}>12</Text> */}
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={[styles.actionIconBg, { backgroundColor: '#F3EFFF' }]}>
                <CreditCard color="#8A70E8" size={20} />
              </View>
            </View>
            <Text style={styles.statLabel}>BALANCE</Text>
            <Text style={styles.statValue}></Text>
          </View>
        </View>

        {/* --- Upcoming Sessions --- */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Upcoming sessions</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all <ChevronRight size={14} /></Text>
          </TouchableOpacity>
        </View>

        {UPCOMING_SESSIONS.map((session) => (
          <TouchableOpacity key={session.id} style={styles.sessionCard}>
            <View style={styles.dateBox}>
              <Text style={styles.dateMonth}>{session.month}</Text>
              <Text style={styles.dateDay}>{session.day}</Text>
            </View>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTitle}>
                {session.doctor} <Text style={styles.sessionType}>{session.type}</Text>
              </Text>
              <View style={styles.sessionTimeRow}>
                <Clock color="#6B7280" size={14} />
                <Text style={styles.sessionTime}>{session.time}</Text>
              </View>
            </View>
            <ChevronRight color="#C4C4C4" size={20} />
          </TouchableOpacity>
        ))}

        {/* --- Available Interpreters --- */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Available interpreters</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all <ChevronRight size={14} /></Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.interpretersScroll} >
          {AVAILABLE_INTERPRETERS.map((interpreter) => (
            <View key={interpreter.id} style={styles.interpreterCard}>
              <Image source={interpreter.image} style={styles.interpreterImage} />
              <View style={styles.interpreterInfo}>
                <View style={styles.interpreterNameRow}>
                  <Text style={styles.interpreterName}>{interpreter.name}</Text>
                  <View style={styles.ratingRow}>
                    <Star color="#FFB800" size={12} fill="#FFB800" />
                    <Text style={styles.ratingText}>{interpreter.rating}</Text>
                  </View>
                </View>
                <Text style={styles.interpreterLangs}>
                  {interpreter.languages.join(' · ')}
                </Text>
                <View style={styles.tagsRow}>
                  {interpreter.languages.map((lang, idx) => (
                    <View key={idx} style={styles.langTag}>
                      <Text style={styles.langTagText}>{lang}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <TouchableOpacity style={styles.viewProfileButton}>
                <Text style={styles.viewProfileText}>View Profile</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE', // Very light purple/grey background
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: 50,
  },
  heroCard: {
    backgroundColor: '#4C3C9B', // Deep purple
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  heroContent: {
    zIndex: 2,
    width: '75%',
  },
  heroTag: {
    color: '#A594F9',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#D1CBF4',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 8,
  },
  startButtonText: {
    color: '#4C3C9B',
    fontWeight: '700',
    fontSize: 14,
  },
  heroDecoration: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    zIndex: 1,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  actionIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    color: '#4C3C9B',
    fontSize: 14,
    fontWeight: '600',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  dateBox: {
    backgroundColor: '#F8F9FE',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 16,
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 2,
  },
  dateDay: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4C3C9B',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  sessionType: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
  },
  sessionTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sessionTime: {
    fontSize: 13,
    color: '#6B7280',
  },
  interpretersScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  interpreterCard: {
    width: 240,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  interpreterImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  interpreterInfo: {
    marginBottom: 16,
  },
  interpreterNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  interpreterName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  interpreterLangs: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  langTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  langTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4B5563',
  },
  viewProfileButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewProfileText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4C3C9B',
  },
});