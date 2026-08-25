import {
  Badge,
  Box,
  Button,
  Card,
  SwipeableItem,
  Text,
} from "@masumdev/rn-ui";
import { Archive, Trash2, Pin, Mail, Share2, CheckCircle2, RotateCcw } from "lucide-react-native";
import { useState } from "react";
import { Section, type RnUiSectionContext } from "../shared";

interface EmailItem {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
}

interface SimpleTask {
  id: string;
  title: string;
  done: boolean;
}

const INITIAL_EMAILS: EmailItem[] = [
  {
    id: "1",
    sender: "Apple Design Awards",
    subject: "Your nomination is confirmed",
    preview: "Congratulations! We have received your submission for the 2026 awards.",
    time: "10:42 AM",
    unread: true,
  },
  {
    id: "2",
    sender: "GitHub Team",
    subject: "Security alert: 1 dependency updated",
    preview: "We noticed new security updates available for react-native-library repository.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "3",
    sender: "Stripe Notification",
    subject: "Payment received: $450.00 USD",
    preview: "A payout of $450.00 USD has been initiated to your bank account ending in 4242.",
    time: "Aug 22",
    unread: false,
  },
];

const INITIAL_TASKS: SimpleTask[] = [
  { id: "t1", title: "Review pull request #14 for DatePicker", done: false },
  { id: "t2", title: "Prepare npm release v1.4.0 notes", done: false },
  { id: "t3", title: "Update design tokens for dark theme", done: false },
  { id: "t4", title: "Run end-to-end Expo tests on Android", done: true },
];

export function SwipeableItemSection(_props?: { ctx?: RnUiSectionContext }) {
  const [emails, setEmails] = useState<EmailItem[]>(INITIAL_EMAILS);
  const [tasks, setTasks] = useState<SimpleTask[]>(INITIAL_TASKS);
  const [message, setMessage] = useState<string>("");

  const deleteEmail = (id: string) => {
    setEmails((prev) => prev.filter((item) => item.id !== id));
    setMessage(`Deleted mail #${id}`);
  };

  const archiveEmail = (id: string) => {
    setEmails((prev) => prev.filter((item) => item.id !== id));
    setMessage(`Archived mail #${id}`);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setMessage(`Removed task #${id}`);
  };

  const completeTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
    setMessage(`Updated task #${id}`);
  };

  return (
    <Section title="Swipeable Item & Row">
      <Box gap="lg">
        {/* 1. Multi-line Rich Mail Card */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Rich Mail List (Full Swipe Delete)
              </Text>
              <Badge tone="primary">Swipe Left & Right</Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Full swipe to the left triggers a smooth collapse delete animation.
            </Text>

            {message ? (
              <Box
                style={{
                  padding: 8,
                  borderRadius: 6,
                  backgroundColor: "rgba(59, 130, 246, 0.12)",
                }}
              >
                <Text style={{ fontSize: 12, color: "#3b82f6", fontWeight: "600" }}>
                  {message}
                </Text>
              </Box>
            ) : null}

            {/* Swipeable Items List */}
            <Box gap="sm" style={{ marginTop: 4 }}>
              {emails.map((item) => (
                <SwipeableItem
                  key={item.id}
                  containerStyle={{ borderRadius: 10 }}
                  style={{
                    padding: 14,
                    borderWidth: 1,
                    borderColor: "rgba(148, 163, 184, 0.2)",
                    borderRadius: 10,
                  }}
                  leftActions={[
                    {
                      label: "Pin",
                      icon: ({ color, size }) => <Pin color={color} size={size} />,
                      tone: "primary",
                      onPress: () => setMessage(`Pinned ${item.sender}`),
                    },
                    {
                      label: "Share",
                      icon: ({ color, size }) => <Share2 color={color} size={size} />,
                      tone: "accent",
                      onPress: () => setMessage(`Shared ${item.sender}`),
                    },
                  ]}
                  rightActions={[
                    {
                      label: "Archive",
                      icon: ({ color, size }) => <Archive color={color} size={size} />,
                      tone: "secondary",
                      backgroundColor: "#475569",
                      isDestructive: true,
                      onPress: () => archiveEmail(item.id),
                    },
                    {
                      label: "Delete",
                      icon: ({ color, size }) => <Trash2 color={color} size={size} />,
                      tone: "danger",
                      isDestructive: true,
                      onPress: () => deleteEmail(item.id),
                    },
                  ]}
                  onFullSwipeLeft={() => deleteEmail(item.id)}
                >
                  <Box gap="xs">
                    <Box row center style={{ justifyContent: "space-between" }}>
                      <Box row center gap="xs">
                        {item.unread && (
                          <Box
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: "#3b82f6",
                            }}
                          />
                        )}
                        <Text weight="700" color="text" numberOfLines={1}>
                          {item.sender}
                        </Text>
                      </Box>
                      <Text variant="caption" color="textMuted">
                        {item.time}
                      </Text>
                    </Box>
                    <Text weight="600" color="text" style={{ fontSize: 13 }} numberOfLines={1}>
                      {item.subject}
                    </Text>
                    <Text variant="bodySmall" color="textMuted" numberOfLines={2}>
                      {item.preview}
                    </Text>
                  </Box>
                </SwipeableItem>
              ))}

              {emails.length === 0 && (
                <Box center style={{ padding: 18, gap: 8 }}>
                  <Mail size={28} color="#94a3b8" />
                  <Text color="textMuted" variant="bodySmall">
                    All mailbox messages deleted!
                  </Text>
                  <Button
                    size="sm"
                    variant="outline"
                    tone="primary"
                    onPress={() => setEmails(INITIAL_EMAILS)}
                  >
                    <RotateCcw size={14} color="#3b82f6" />
                    <Text style={{ marginLeft: 6 }}>Reset Messages</Text>
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Card>

        {/* 2. Single-Line Task List (1 Baris Teks) */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Single-Line Task Items (1-Line Text)
              </Text>
              <Badge tone="accent">Compact Row</Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Swipe right to mark complete, swipe left to delete simple 1-line tasks.
            </Text>

            <Box gap="xs" style={{ marginTop: 4 }}>
              {tasks.map((task) => (
                <SwipeableItem
                  key={task.id}
                  actionWidth={68}
                  containerStyle={{ borderRadius: 8 }}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                    borderWidth: 1,
                    borderColor: "rgba(148, 163, 184, 0.2)",
                    borderRadius: 8,
                  }}
                  leftActions={[
                    {
                      label: task.done ? "Undo" : "Done",
                      icon: ({ color, size }) => <CheckCircle2 color={color} size={size} />,
                      tone: "success",
                      onPress: () => completeTask(task.id),
                    },
                  ]}
                  rightActions={[
                    {
                      label: "Delete",
                      icon: ({ color, size }) => <Trash2 color={color} size={size} />,
                      tone: "danger",
                      onPress: () => deleteTask(task.id),
                    },
                  ]}
                  onFullSwipeLeft={() => deleteTask(task.id)}
                >
                  <Box row center style={{ justifyContent: "space-between" }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "500",
                        textDecorationLine: task.done ? "line-through" : "none",
                        opacity: task.done ? 0.5 : 1,
                      }}
                      color="text"
                      numberOfLines={1}
                    >
                      {task.title}
                    </Text>
                    {task.done && (
                      <Badge size="sm" tone="success">
                        Done
                      </Badge>
                    )}
                  </Box>
                </SwipeableItem>
              ))}

              {tasks.length === 0 && (
                <Box center style={{ padding: 18, gap: 8 }}>
                  <Text color="textMuted" variant="bodySmall">
                    All tasks completed and cleared!
                  </Text>
                  <Button
                    size="sm"
                    variant="outline"
                    tone="primary"
                    onPress={() => setTasks(INITIAL_TASKS)}
                  >
                    <RotateCcw size={14} color="#3b82f6" />
                    <Text style={{ marginLeft: 6 }}>Reset Tasks</Text>
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Card>
      </Box>
    </Section>
  );
}
