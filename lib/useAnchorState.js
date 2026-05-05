import { useState } from "react";
import { Mail, Mic, Forward } from "lucide-react";

export const initialItems = [
  {
    id: 1,
    source: "email",
    sourceDetail: "School · Mon 11:04am",
    sourceFrom: "Merhavim Elementary",
    text: "Pay 4th-grade trip fee by Friday",
    suggestedSlots: ["Wed 8:00 PM", "Thu 9:00 PM"],
    snoozeCount: 0,
  },
  {
    id: 2,
    source: "voice",
    sourceDetail: "WhatsApp voice · yesterday 5:45pm",
    sourceFrom: "From you, while driving",
    transcript: '"Confirm Tom\'s dentist appointment Thursday."',
    text: "Confirm Tom's dentist appointment Thursday",
    suggestedSlots: ["Wed 6:30 PM", "Thu 8:30 AM"],
    snoozeCount: 0,
  },
  {
    id: 3,
    source: "email",
    sourceDetail: "Dental Clinic · Mon 4:32pm",
    sourceFrom: "Dr. Levi's Office",
    text: "Confirm Tom's appointment Tuesday 3pm",
    suggestedSlots: ["Today, 12:00 PM", "Today, 6:00 PM"],
    snoozeCount: 0,
  },
  {
    id: 4,
    source: "forward",
    sourceDetail: "WhatsApp forward · Sun 9:12pm",
    sourceFrom: "Forwarded from your husband",
    text: "Don't forget to renew car insurance — expires next month",
    suggestedSlots: ["Tue 9:00 PM", "Sat 10:00 AM"],
    snoozeCount: 0,
  },
  {
    id: 5,
    source: "email",
    sourceDetail: "Contractor · Thu 2:14pm",
    sourceFrom: "Avi Renovations",
    text: "Quote for kitchen — review and respond",
    suggestedSlots: ["Sat 10:00 AM", "Sun 9:00 AM"],
    snoozeCount: 1,
  },
  {
    id: 6,
    source: "email",
    sourceDetail: "LinkedIn · Mon 8:14pm",
    sourceFrom: "LinkedIn Newsletter",
    text: "Update your LinkedIn profile (10 tips inside)",
    suggestedSlots: [],
    snoozeCount: 0,
    isLikelyDismiss: true,
  },
];

export const initialSnoozed = [
  {
    id: 101,
    source: "email",
    sourceFrom: "Insurance Co.",
    text: "Annual policy review — your input needed",
    snoozedFrom: "Mon",
    returnsOn: "Sun morning",
    daysUntil: 5,
    snoozeCount: 1,
  },
  {
    id: 102,
    source: "voice",
    sourceFrom: "From you, in the kitchen",
    text: "Ask sister about Friday dinner plans",
    snoozedFrom: "Tue",
    returnsOn: "Tomorrow morning",
    daysUntil: 1,
    snoozeCount: 1,
  },
  {
    id: 103,
    source: "email",
    sourceFrom: "Amir (accountant)",
    text: "Q3 expense reconciliation — review attached",
    snoozedFrom: "Wed",
    returnsOn: "Friday morning",
    daysUntil: 3,
    snoozeCount: 0,
  },
];

export const snoozeOptions = [
  { label: "Tomorrow morning", hint: "Tue 7:00 AM" },
  { label: "This weekend", hint: "Sat 9:00 AM" },
  { label: "Next week", hint: "Mon 7:00 AM" },
  { label: "1 hour before next event", hint: "Wed 9:00 AM" },
];

export const customTimeOptions = [
  "Today, 6:00 PM",
  "Tomorrow, 8:00 AM",
  "Tomorrow, 8:00 PM",
  "Friday, 10:00 AM",
  "Saturday, 9:00 AM",
  "Next Monday, 9:00 AM",
];

export const sourceConfig = {
  email: { Icon: Mail, bg: "#dcefe5", color: "#136342" },
  voice: { Icon: Mic, bg: "#d8e8e2", color: "#15715f" },
  forward: { Icon: Forward, bg: "#dde2ff", color: "#4d65ff" },
};

export const priorWeekHistory = [
  { day: "Mon", scheduled: 5, snoozed: 2, dismissed: 1 },
  { day: "Tue", scheduled: 4, snoozed: 1, dismissed: 1 },
  { day: "Wed", scheduled: 7, snoozed: 2, dismissed: 1 },
  { day: "Thu", scheduled: 5, snoozed: 1, dismissed: 1 },
  { day: "Fri", scheduled: 6, snoozed: 2, dismissed: 1 },
  { day: "Sat", scheduled: 3, snoozed: 1, dismissed: 1 },
];

export function useAnchorState() {
  const [items, setItems] = useState(initialItems);
  const [snoozedQueue, setSnoozedQueue] = useState(initialSnoozed);
  const [decisions, setDecisions] = useState([]);
  const [showSnooze, setShowSnooze] = useState(null);
  const [showSchedule, setShowSchedule] = useState(null);
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [showSenderMute, setShowSenderMute] = useState(null);
  const [view, setView] = useState("triage");
  const [animKey, setAnimKey] = useState(0);
  const [exitingId, setExitingId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const current = items[activeIndex] || items[0];

  function withCardExit(callback) {
    if (!current) { callback(); return; }
    setExitingId(current.id);
    setTimeout(() => {
      callback();
      setExitingId(null);
      setAnimKey(k => k + 1);
    }, 240);
  }

  function handleSchedule(slot) {
    setShowSchedule(null);
    setShowCustomTime(false);
    withCardExit(() => {
      setDecisions(d => [...d, { ...current, decision: "scheduled", slot }]);
      setItems(i => i.filter(x => x.id !== current.id));
      setActiveIndex(0);
    });
  }

  function handleSnooze(option) {
    setShowSnooze(null);
    withCardExit(() => {
      setDecisions(d => [...d, { ...current, decision: "snoozed", until: option.hint }]);
      setSnoozedQueue(q => [...q, {
        id: current.id + 1000,
        source: current.source,
        sourceFrom: current.sourceFrom,
        text: current.text,
        snoozedFrom: "Today",
        returnsOn: option.label,
        daysUntil: option.label.includes("Tomorrow") ? 1 : option.label.includes("weekend") ? 4 : 7,
        snoozeCount: current.snoozeCount + 1,
      }]);
      setItems(i => i.filter(x => x.id !== current.id));
      setActiveIndex(0);
    });
  }

  function handleDismiss() {
    const wasNewsletter = current.isLikelyDismiss;
    const senderName = current.sourceFrom;
    withCardExit(() => {
      setDecisions(d => [...d, { ...current, decision: "dismissed" }]);
      setItems(i => i.filter(x => x.id !== current.id));
      setActiveIndex(0);
      if (wasNewsletter) {
        setShowSenderMute(senderName);
        setTimeout(() => setShowSenderMute(null), 3200);
      }
    });
  }

  function bringBackSnoozed(snoozedItem) {
    setSnoozedQueue(q => q.filter(s => s.id !== snoozedItem.id));
    setItems(i => [...i, {
      id: snoozedItem.id + 2000,
      source: snoozedItem.source,
      sourceDetail: `${sourceConfig[snoozedItem.source] ? "Brought back" : "Email"} · just now`,
      sourceFrom: snoozedItem.sourceFrom,
      text: snoozedItem.text,
      suggestedSlots: ["Today, 8:00 PM", "Tomorrow, 9:00 AM"],
      snoozeCount: snoozedItem.snoozeCount,
    }]);
    setView("triage");
  }

  function reset() {
    setItems(initialItems);
    setSnoozedQueue(initialSnoozed);
    setDecisions([]);
    setView("triage");
    setActiveIndex(0);
    setAnimKey(k => k + 1);
  }

  function focusItem(id) {
    const idx = items.findIndex(x => x.id === id);
    if (idx >= 0) setActiveIndex(idx);
  }

  const scheduledCount = decisions.filter(d => d.decision === "scheduled").length;
  const dismissedCount = decisions.filter(d => d.decision === "dismissed").length;
  const snoozedCount = decisions.filter(d => d.decision === "snoozed").length;
  const terminalRate = decisions.length > 0
    ? Math.round(((scheduledCount + dismissedCount) / decisions.length) * 100)
    : 0;

  const weekHistory = [
    ...priorWeekHistory,
    { day: "Today", scheduled: scheduledCount, snoozed: snoozedCount, dismissed: dismissedCount, isToday: true },
  ];

  return {
    items, snoozedQueue, decisions, current,
    showSnooze, setShowSnooze,
    showSchedule, setShowSchedule,
    showCustomTime, setShowCustomTime,
    showSenderMute,
    view, setView,
    animKey, exitingId,
    activeIndex, setActiveIndex, focusItem,
    handleSchedule, handleSnooze, handleDismiss,
    bringBackSnoozed, reset,
    scheduledCount, dismissedCount, snoozedCount, terminalRate,
    weekHistory,
  };
}
