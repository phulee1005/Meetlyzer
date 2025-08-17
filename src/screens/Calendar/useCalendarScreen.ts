import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootStackNavigationProp } from "@navigation/type";
import { RootState, AppDispatch } from "@store/index";
import { useGetGoogleMeetingsQuery } from "services/bot";
import { MeetingGoogleCalendar } from "types/record";
import { socket } from "utils/socket";

export interface CalendarEvent {
  date: string; // Format: YYYY-MM-DD
  events: MeetingGoogleCalendar[];
}

export const useCalendarScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<RootStackNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [markedDates, setMarkedDates] = useState({});
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  // RTK Query hooks
  const {
    data: googleCalendarData,
    isLoading: isLoadingGoogleCalendar,
    refetch: refetchGoogleCalendar,
  } = useGetGoogleMeetingsQuery(
    { today: false },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  // Socket listener for real-time updates
  useEffect(() => {
    const scheduleGoogleChannel = "google_calendar";

    socket.on(scheduleGoogleChannel, () => {
      refetchGoogleCalendar();
    });

    return () => {
      socket.off(scheduleGoogleChannel);
    };
  }, [refetchGoogleCalendar]);

  // Process calendar events and create marked dates
  useEffect(() => {
    if (googleCalendarData?.response?.list) {
      const events = googleCalendarData.response.list;
      const eventsByDate: { [key: string]: MeetingGoogleCalendar[] } = {};
      const marked: { [key: string]: any } = {};

      // Group events by date
      events.forEach((event) => {
        if (event.startTime) {
          const date = new Date(event.startTime);
          const dateString = date.toISOString().split("T")[0]; // YYYY-MM-DD format

          if (!eventsByDate[dateString]) {
            eventsByDate[dateString] = [];
          }
          eventsByDate[dateString].push(event);
        }
      });

      // Create marked dates for calendar
      Object.keys(eventsByDate).forEach((dateString) => {
        const eventCount = eventsByDate[dateString].length;
        marked[dateString] = {
          marked: true,
          dotColor: eventCount > 3 ? "#FF6B6B" : "#4CAF50",
          textColor: "#6B4F3B",
          selectedColor: "#FADFCB",
          selectedTextColor: "#6B4F3B",
        };
      });

      setCalendarEvents(
        Object.keys(eventsByDate).map((date) => ({
          date,
          events: eventsByDate[date],
        }))
      );
      setMarkedDates(marked);
    }
  }, [googleCalendarData]);

  // Get events for selected date
  const getEventsForSelectedDate = useCallback(() => {
    const selectedDateString = selectedDate.toISOString().split("T")[0];
    const eventData = calendarEvents.find(
      (event) => event.date === selectedDateString
    );
    return eventData?.events || [];
  }, [selectedDate, calendarEvents]);

  // Handle date selection
  const handleDateSelect = useCallback((date: any) => {
    setSelectedDate(new Date(date.timestamp));
  }, []);

  // Handle event press
  const handleEventPress = useCallback((event: MeetingGoogleCalendar) => {
    // TODO: Navigate to event detail or join meeting
  }, []);

  // Handle month change
  const handleMonthChange = useCallback((month: any) => {
    // TODO: Fetch events for the new month if needed
  }, []);

  return {
    // Data
    selectedDate,
    markedDates,
    eventsForSelectedDate: getEventsForSelectedDate(),
    calendarEvents,
    isGoogleCalendarRegistered:
      googleCalendarData?.response?.registerGoogleCalendar || false,

    // Loading states
    isLoadingGoogleCalendar,

    // Handlers
    handleDateSelect,
    handleEventPress,
    handleMonthChange,
    refetchGoogleCalendar,
  };
};
