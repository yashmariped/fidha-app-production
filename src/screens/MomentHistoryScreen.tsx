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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>
          Moment History
        </Text>
        <Text style={styles.subtitle}>
          Connections that felt real
        </Text>
      </View>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.l,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: SIZES.h2,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.xs,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: SIZES.body1,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
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
    backgroundColor: COLORS.primary,
  },
  username: {
    fontSize: SIZES.body1,
    fontFamily: FONTS.medium,
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
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.textSecondary,
  },
});

export default MomentHistoryScreen; 