import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ShiftDetails'>;

export default function ShiftDetailsScreen({route}: Props) {
  const {shift} = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={{uri: shift.logo}} style={styles.logo} />
        <View style={{flex: 1}}>
          <Text style={styles.title}>{shift.companyName}</Text>
          <Text style={styles.address}>{shift.address}</Text>
        </View>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Время и тип</Text>
        <Text style={styles.line}>{`${shift.dateStartByCity} • ${shift.timeStartByCity} — ${shift.timeEndByCity}`}</Text>
        <Text style={styles.line}>{shift.workTypes}</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Набор</Text>
        <Text style={styles.line}>{`Нужно: ${shift.planWorkers} чел.`}</Text>
        <Text style={styles.line}>{`Набрано: ${shift.currentWorkers} чел.`}</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Оплата</Text>
        <Text style={styles.amount}>{`${shift.priceWorker} ₽`}</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Рейтинг клиента</Text>
        <Text style={styles.line}>{`${shift.customerRating} / 5`}</Text>
        <Text style={styles.line}>{`${shift.customerFeedbacksCount} отзывов`}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  logo: { width: 64, height: 64, borderRadius: 8, marginRight: 12, backgroundColor: '#eee' },
  title: { fontSize: 18, fontWeight: '700' },
  address: { color: '#666', marginTop: 4 },
  block: { backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 12, elevation: 1 },
  blockTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  line: { color: '#333', marginTop: 2 },
  amount: { fontSize: 20, fontWeight: '700' },
});


