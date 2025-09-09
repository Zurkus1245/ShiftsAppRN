import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, Alert, FlatList, Image, Platform, Pressable, RefreshControl, StyleSheet, Text, View} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {fetchShiftsByLocation} from '../api/shifts';
import type {Shift} from '../types';
import type {RootStackParamList} from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ShiftsList'>;

export default function ShiftsListScreen({navigation}: Props) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocationPermission = useCallback(async () => {
    try {
      const permission = Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      let status = await check(permission);
      if (status !== RESULTS.GRANTED) {
        status = await request(permission);
      }
      return status === RESULTS.GRANTED;
    } catch (e) {
      return false;
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const granted = await requestLocationPermission();
      if (!granted) {
        setError('Разрешение на геолокацию не предоставлено');
        setLoading(false);
        return;
      }
      await new Promise<void>((resolve, reject) => {
        Geolocation.getCurrentPosition(
          async position => {
            try {
              const {latitude, longitude} = position.coords;
              const data = await fetchShiftsByLocation({latitude, longitude});
              setShifts(data);
              resolve();
            } catch (err: any) {
              setError(err?.message ?? 'Ошибка загрузки смен');
              reject(err);
            } finally {
              setLoading(false);
            }
          },
          error => {
            setError(error?.message ?? 'Не удалось получить геолокацию');
            setLoading(false);
            reject(error);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      });
    } catch {
      // уже обработано
    }
  }, [requestLocationPermission]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);

  const renderItem = useCallback(({item}: {item: Shift}) => {
    return (
      <Pressable style={styles.card} onPress={() => navigation.navigate('ShiftDetails', {shift: item})}>
        <Image source={{uri: item.logo}} style={styles.logo} />
        <View style={styles.info}>
          <Text style={styles.title}>{item.companyName}</Text>
          <Text style={styles.subtitle}>{item.address}</Text>
          <Text style={styles.meta}>
            {item.dateStartByCity} • {item.timeStartByCity}-{item.timeEndByCity} • {item.workTypes}
          </Text>
          <Text style={styles.meta}>
            {`Оплата: ${item.priceWorker}₽ • ${item.currentWorkers}/${item.planWorkers} чел.`}
          </Text>
          <Text style={styles.meta}>{`Рейтинг: ${item.customerRating} (${item.customerFeedbacksCount})`}</Text>
        </View>
      </Pressable>
    );
  }, [navigation]);

  const keyExtractor = useCallback((item: Shift, index: number) => (item.id ?? `${item.companyName}-${index}`), []);

  if (loading && shifts.length === 0) {
    return (
      <View style={styles.center}> 
        <ActivityIndicator />
        <Text style={styles.loading}>Загрузка смен…</Text>
      </View>
    );
  }

  if (error && shifts.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Pressable style={styles.retry} onPress={loadData}>
          <Text style={styles.retryText}>Повторить</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={shifts}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={shifts.length === 0 ? styles.center : styles.list}
      ListEmptyComponent={<Text>Смены не найдены</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loading: { marginTop: 12 },
  error: { color: 'red', textAlign: 'center', marginBottom: 12 },
  retry: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#007AFF', borderRadius: 8 },
  retryText: { color: 'white' },
  list: { padding: 12 },
  card: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 12, elevation: 2 },
  logo: { width: 56, height: 56, borderRadius: 8, marginRight: 12, backgroundColor: '#eee' },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600' },
  subtitle: { color: '#666', marginTop: 2 },
  meta: { color: '#333', marginTop: 2 },
});


