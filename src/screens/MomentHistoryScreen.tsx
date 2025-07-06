import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';
import { useMoment } from '../hooks/useMoment';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { LinearGradient } from 'expo-linear-gradient';

type MomentHistoryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MomentHistory'>;
};

interface Moment {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  timestamp: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  status: 'pending' | 'confirmed' | 'rejected';
}

const MomentHistoryScreen: React.FC<MomentHistoryScreenProps> = ({ navigation }) => {
  const { moments, getMomentHistory, isLoading } = useMoment();

  // Gradient colors as tuple for LinearGradient
  const gradientColors: [string, string] = [COLORS.primary, COLORS.primaryLight];

  useEffect(() => {
    getMomentHistory();
  }, [getMomentHistory]);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const moment = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - moment.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const renderMoment = ({ item: moment }: { item: Moment }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'confirmed':
          return COLORS.success;
        case 'rejected':
          return COLORS.error;
        default:
          return COLORS.warning;
      }
    };

    return (
      <Card style={styles.momentCard}>
        <View style={styles.momentHeader}>
          <View style={styles.userInfo}>
            {moment.avatar && (
              <View style={styles.avatar} />
            )}
            <Text style={styles.username}>
              {moment.username}
            </Text>
          </View>
          <Badge
            value={moment.status}
            variant={moment.status === 'confirmed' ? 'success' : moment.status === 'rejected' ? 'error' : 'warning'}
          />
        </View>
        <Text style={styles.timestamp}>
          {new Date(moment.timestamp).toLocaleString()}
        </Text>
        {moment.location && (
          <Text style={styles.location}>
            Location: {moment.location.latitude.toFixed(4)}, {moment.location.longitude.toFixed(4)}
          </Text>
        )}
      </Card>
    );
  };

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.gradientBg}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Moment History</Text>
          <View style={{ width: 50 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.subtitle}>
            Connections that felt real
          </Text>

        {isLoading ? (
            <Text style={styles.loading}>
            Loading moments...
          </Text>
        ) : moments.length === 0 ? (
            <Text style={styles.empty}>
            No moments yet
          </Text>
        ) : (
          <FlatList
            data={moments}
            renderItem={renderMoment}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.l,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryLight,
  },
  backButton: {
    padding: SPACING.s,
  },
  backButtonText: {
    fontSize: SIZES.body1,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  title: {
    fontSize: SIZES.h2,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: SIZES.body1,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.l,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  momentCard: {
    marginBottom: 15,
  },
  momentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: COLORS.primaryLight,
  },
  username: {
    fontSize: SIZES.body1,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  timestamp: {
    fontSize: SIZES.body2,
    marginBottom: 5,
    color: COLORS.textSecondary,
  },
  location: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.textSecondary,
    fontSize: SIZES.body1,
    fontFamily: FONTS.regular,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.textSecondary,
    fontSize: SIZES.body1,
    fontFamily: FONTS.regular,
  },
});

export default MomentHistoryScreen; 