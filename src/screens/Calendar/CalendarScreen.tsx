import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { fontScale, heightScale, widthScale } from "utils/scale";
import { Colors } from "constants/colors";
import { useTranslation } from "react-i18next";
import { useCalendarScreen } from "./useCalendarScreen";
import EventItem from "components/EventItem";
import { MeetingGoogleCalendar } from "types/record";

export default function CalendarScreen() {
  const { t } = useTranslation();
  const {
    selectedDate,
    markedDates,
    eventsForSelectedDate,
    isGoogleCalendarRegistered,
    isLoadingGoogleCalendar,
    handleDateSelect,
    handleEventPress,
    handleMonthChange,
  } = useCalendarScreen();

  const formatSelectedDate = () => {
    return selectedDate.toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isGoogleCalendarRegistered) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notConnectedContainer}>
          <Text style={styles.notConnectedTitle}>
            {t("calendar.notConnected")}
          </Text>
          <Text style={styles.notConnectedDescription}>
            {t("calendar.notConnectedDescription")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("calendar.title")}</Text>
      </View>

      <Calendar
        current={new Date().toISOString().split("T")[0]}
        onDayPress={handleDateSelect}
        onMonthChange={handleMonthChange}
        markedDates={{
          ...markedDates,
          [selectedDate.toISOString().split("T")[0]]: {
            ...(markedDates as any)[selectedDate.toISOString().split("T")[0]],
            selected: true,
          },
        }}
        theme={{
          backgroundColor: Colors.background,
          calendarBackground: Colors.white,
          textSectionTitleColor: Colors.primaryText,
          selectedDayBackgroundColor: Colors.primaryButton,
          selectedDayTextColor: Colors.primaryText,
          todayTextColor: Colors.primaryText,
          dayTextColor: Colors.primaryText,
          textDisabledColor: Colors.secondaryText,
          dotColor: Colors.success,
          selectedDotColor: Colors.primaryText,
          arrowColor: Colors.primaryText,
          monthTextColor: Colors.primaryText,
          indicatorColor: Colors.primaryText,
          textDayFontWeight: "400",
          textMonthFontWeight: "600",
          textDayHeaderFontWeight: "500",
          textDayFontSize: fontScale(16),
          textMonthFontSize: fontScale(18),
          textDayHeaderFontSize: fontScale(14),
        }}
        style={styles.calendar}
        monthFormat="MMMM yyyy"
      />

      <View style={styles.eventsContainer}>
        <View style={styles.eventsHeader}>
          <Text style={styles.eventsTitle}>
            {t("calendar.eventsFor")} {formatSelectedDate()}
          </Text>
          {isLoadingGoogleCalendar && (
            <ActivityIndicator size="small" color={Colors.primaryText} />
          )}
        </View>

        <ScrollView
          style={styles.eventsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.eventsListContent}
        >
          {eventsForSelectedDate.length === 0 ? (
            <View style={styles.noEventsContainer}>
              <Text style={styles.noEventsText}>{t("calendar.noEvents")}</Text>
              <Text style={styles.noEventsDescription}>
                {t("calendar.noEventsDescription")}
              </Text>
            </View>
          ) : (
            eventsForSelectedDate.map((event: MeetingGoogleCalendar) => (
              <EventItem
                key={event.eventId}
                event={event}
                onPress={handleEventPress}
              />
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: widthScale(20),
    paddingVertical: heightScale(16),
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  title: {
    fontSize: fontScale(24),
    fontWeight: "bold",
    color: Colors.primaryText,
  },
  calendar: {
    marginHorizontal: widthScale(20),
    marginVertical: heightScale(16),
    borderRadius: widthScale(12),
    elevation: 4,
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventsContainer: {
    flex: 1,
    paddingHorizontal: widthScale(20),
  },
  eventsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: heightScale(16),
  },
  eventsTitle: {
    fontSize: fontScale(18),
    fontWeight: "600",
    color: Colors.primaryText,
  },
  eventsList: {
    flex: 1,
  },
  eventsListContent: {
    paddingBottom: heightScale(20),
  },
  noEventsContainer: {
    alignItems: "center",
    paddingVertical: heightScale(40),
  },
  noEventsText: {
    fontSize: fontScale(16),
    fontWeight: "600",
    color: Colors.primaryText,
    marginBottom: heightScale(8),
  },
  noEventsDescription: {
    fontSize: fontScale(14),
    color: Colors.secondaryText,
    textAlign: "center",
    lineHeight: fontScale(20),
  },
  notConnectedContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: widthScale(40),
  },
  notConnectedTitle: {
    fontSize: fontScale(20),
    fontWeight: "600",
    color: Colors.primaryText,
    textAlign: "center",
    marginBottom: heightScale(12),
  },
  notConnectedDescription: {
    fontSize: fontScale(16),
    color: Colors.secondaryText,
    textAlign: "center",
    lineHeight: fontScale(22),
  },
});
