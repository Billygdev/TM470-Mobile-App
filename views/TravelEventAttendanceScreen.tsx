import { TravelEventBooking } from '@/models/firestoreEventModel';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Checkbox, Divider, Text, TextInput, useTheme } from 'react-native-paper';
import { useTravelEventAttendanceViewModel } from '../viewModels/useTravelEventAttendanceViewModel';

const TravelEventAttendanceScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const {
    bookings,
    loading,
    error,
    toggleAttendance,
    updateSeatsAttended,
    handleSaveAttendance,
  } = useTravelEventAttendanceViewModel(id as string);

  return (
    <ScrollView
      testID="attendance-screen-root"
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text variant="headlineMedium" style={[styles.title, { color: colors.onBackground }]}>
        Mark Attendance
      </Text>

      {loading && <ActivityIndicator size="large" testID="attendance-loading" />}
      {error && <Text testID="attendance-error" style={[styles.error, { color: colors.error }]}>{error}</Text>}

      {!loading && (
        <>
          {/* Header row */}
          <View style={styles.tableRow}>
            <Text style={[styles.headerCell, { color: colors.onBackground }]}>Name</Text>
            <Text style={[styles.headerCell, { color: colors.onBackground }]}>Attended</Text>
            <Text style={[styles.headerCell, { color: colors.onBackground }]}>Seats</Text>
          </View>
          <Divider style={{ marginBottom: 8 }} />

          {/* Booking rows */}
          {bookings.length === 0 ? (
            <Text testID="attendance-empty" style={[styles.emptyText, { color: colors.onBackground }]}>
              No bookings
            </Text>
          ) : (
            bookings.map((booking: TravelEventBooking, index: any) => (
              <View key={booking.id || index} style={styles.tableRow}>
                <View style={styles.cell}>
                  <Text
                    testID={`booking-name-${index}`}
                    style={{ color: colors.onBackground, textAlign: 'center' }}
                  >
                    {booking.bookerName}
                  </Text>
                </View>

                <View
                  testID={`attendance-checkbox-${index}`}
                  style={styles.cell}
                >
                  <Checkbox
                    status={booking.attended ? 'checked' : 'unchecked'}
                    onPress={() => toggleAttendance(index)}
                  />
                </View>

                <View style={styles.cell}>
                  <TextInput
                    accessibilityLabel={`booking-seats-${index}`}
                    mode="outlined"
                    dense
                    keyboardType="numeric"
                    value={(
                      booking.seatsAttended !== undefined
                        ? booking.seatsAttended
                        : booking.seatsBooked
                    ).toString()}
                    editable={booking.attended}
                    onChangeText={(text) => {
                      const parsed = parseInt(text) || 0;
                      if (parsed <= booking.seatsBooked) updateSeatsAttended(index, parsed);
                    }}
                    style={[styles.seatsInput]}
                    theme={{ roundness: 4 }}
                    right={
                      <TextInput.Affix
                        text={`/ ${booking.seatsBooked}`}
                        textStyle={{ color: '#999', fontSize: 16 }}
                      />
                    }
                  />
                </View>
              </View>
            ))
          )}

          <Button
            mode="contained"
            style={styles.button}
            accessibilityLabel="Save Attendance"
            onPress={handleSaveAttendance}
          >
            Save Attendance
          </Button>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    marginBottom: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatsInput: {
    width: 100,
    height: 40,
    fontSize: 16,
    textAlign: 'right',
    justifyContent: 'center',
    paddingVertical: 0,
  },
  button: {
    marginTop: 16,
  },
  error: {
    textAlign: 'center',
    marginVertical: 12,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default TravelEventAttendanceScreen;