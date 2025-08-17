export interface RecordMeeting {
  _id: string;
  deletedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  isActive: boolean;
  user: string;
  meetingCode: string;
  title: string;
  organizer: string;
  joiningStatus: JOINING_STATUS;
  recordUri: string;
  messagesInMeeting: MessageInMeeting[];
  recording: boolean;
  translateStatus: TRANSLATE_STATUS;
  summary: string;
  summaryCore: string | null;
  platform: PLATFORM;
  chatWithAIAssistant: string;
  createdAt: string;
  updatedAt: string;
  translationAI: TranslationAI[];
}

export enum PLATFORM {
  google = "google",
  zoom = "zoom",
  mst = "mst",
  import = "import",
  undefined = "undefined",
}

export enum TRANSLATE_STATUS {
  NEW = "NEW",
  PROCESSING = "PROCESSING",
  DONE = "DONE",
  SUMMARY = "SUMMARY",
  FAILED = "FAILED",
}

export enum JOINING_STATUS {
  NEW = "NEW",
  IMPORT = "IMPORT",
  PROCESSING = "PROCESSING",
  WATING_FOR_ADMIT = "WATING_FOR_ADMIT",
  DONE = "DONE",
  FAILED = "FAILED",
}

export enum SUMMARY_CORE {
  GPT = "GPT",
  ALIBABA = "ALIBABA",
  GEMINI = "GEMINI",
}

export type TranslationAI = {
  _id: string;
  isActive: boolean;
  meeting: string;
  bookmark: false;
  tag: string;
  speaker: string;
  start: number;
  end: number;
  time: string;
  newWords: boolean;
  transcript: string;
};
export type MessageInMeeting = {
  sender: string;
  message: string;
  time: number;
};

export interface GoogleMeetingsResponse {
  registerGoogleCalendar: boolean;
  list: MeetingGoogleCalendar[];
  total: number;
}

export type MeetingGoogleCalendar = {
  summary: string;
  startTime: string;
  hangoutLink: string;
  eventId: string;
  platform: PLATFORM;
};
