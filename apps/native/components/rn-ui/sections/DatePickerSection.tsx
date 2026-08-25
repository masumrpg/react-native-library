import {
  Badge,
  Box,
  Button,
  Card,
  DatePicker,
  DatePickerCard,
  DatePickerDialog,
  DatePickerInput,
  Divider,
  formatTime,
  Text,
} from "@masumdev/rn-ui";
import { useState } from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function DatePickerSection(_props?: { ctx?: RnUiSectionContext }) {

  const [birthday, setBirthday] = useState<Date>(new Date(1998, 5, 24)); // 24 June 1998
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [localizedDate, setLocalizedDate] = useState<Date>(new Date());
  const [selectedLocale, setSelectedLocale] = useState<string>("en");
  const [is24HourTime, setIs24HourTime] = useState<boolean>(false); // 12H AM/PM default for demo
  const [appointmentTime, setAppointmentTime] = useState<Date>(() => {
    const d = new Date();
    d.setHours(14, 30, 0, 0);
    return d;
  });
  const [scheduleDateTime, setScheduleDateTime] = useState<Date>(new Date());
  const [monthYear, setMonthYear] = useState<Date>(new Date());

  // Modal demo states
  const [wheelModalOpen, setWheelModalOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);

  return (
    <Section title="DatePicker & Wheel Picker">
      <Box gap="lg">
        {/* 1. Variant 1: Cupertino Birthday Wheel Card (Matches Reference UI) */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Variant 1: Wheel Roller (Birthday Card)
              </Text>
              <Badge tone="primary">variant="wheel"</Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Cupertino-style wheel card with Year-Month-Day rollers, smooth momentum snap, and center row highlight.
            </Text>

            <DatePickerCard
              title="SET BIRTHDAY"
              variant="wheel"
              value={birthday}
              onChange={setBirthday}
              onConfirm={(d) => {
                setBirthday(d);
              }}
              confirmText="SUBMIT"
            />

            <Box
              row
              center
              gap="xs"
              style={{
                backgroundColor: "rgba(128, 128, 128, 0.08)",
                padding: 10,
                borderRadius: 8,
                justifyContent: "center",
              }}
            >
              <Text variant="caption" color="textMuted">
                Selected Date:
              </Text>
              <Text variant="caption" weight="700" color="text">
                {birthday.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </Box>
          </Box>
        </Card>

        {/* 2. Variant 2: Grid Calendar Picker */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Variant 2: Grid Calendar Card
              </Text>
              <Badge tone="secondary">variant="calendar"</Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Full monthly calendar grid picker integrated with theme colors.
            </Text>

            <DatePickerCard
              title="SELECT DATE"
              variant="calendar"
              value={calendarDate}
              onChange={setCalendarDate}
              onConfirm={(d) => {
                setCalendarDate(d);
              }}
              confirmText="CONFIRM DATE"
            />

            <Box
              row
              center
              gap="xs"
              style={{
                backgroundColor: "rgba(128, 128, 128, 0.08)",
                padding: 10,
                borderRadius: 8,
                justifyContent: "center",
              }}
            >
              <Text variant="caption" color="textMuted">
                Calendar Selection:
              </Text>
              <Text variant="caption" weight="700" color="text">
                {calendarDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </Box>
          </Box>
        </Card>

        {/* 3. Form Input Trigger Fields (Both Variants) */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Form Trigger Inputs (Dialogs)
              </Text>
              <Badge tone="success">DatePickerInput</Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Pressable input fields that open clean modal dialogs in either Wheel or Calendar mode.
            </Text>

            {/* Birthday Wheel Trigger */}
            <Box gap="sm">
              <Text variant="caption" weight="600" color="text">
                Date of Birth (Wheel Dialog)
              </Text>
              <DatePickerInput
                variant="wheel"
                title="SET BIRTHDAY"
                value={birthday}
                onChange={setBirthday}
                placeholder="Select date of birth"
                mode="date"
              />
            </Box>

            {/* Calendar Grid Trigger */}
            <Box gap="sm">
              <Text variant="caption" weight="600" color="text">
                Reservation Date (Calendar Dialog)
              </Text>
              <DatePickerInput
                variant="calendar"
                title="SELECT RESERVATION"
                value={calendarDate}
                onChange={setCalendarDate}
                placeholder="Select reservation date"
                mode="date"
              />
            </Box>

            {/* Time Trigger */}
            <Box gap="sm">
              <Text variant="caption" weight="600" color="text">
                Appointment Time (Time Wheel)
              </Text>
              <DatePickerInput
                variant="wheel"
                title="SET TIME"
                value={appointmentTime}
                onChange={setAppointmentTime}
                placeholder="Select time"
                mode="time"
              />
            </Box>

            {/* DateTime Trigger */}
            <Box gap="sm">
              <Text variant="caption" weight="600" color="text">
                Event Schedule (Calendar + Time Dialog)
              </Text>
              <DatePickerInput
                variant="calendar"
                title="SET EVENT SCHEDULE"
                value={scheduleDateTime}
                onChange={setScheduleDateTime}
                placeholder="Select date & time"
                mode="datetime"
              />
            </Box>
          </Box>
        </Card>

        {/* 4. Multi-Language & LocaleConfig */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Multi-Language & LocaleConfig
              </Text>
              <Badge tone="accent">locale="id" | "fr" | "es" | "en"</Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Customizable localization with day names, month names, and LocaleConfig compatibility.
            </Text>

            {/* Language Switcher Buttons */}
            <Box row gap="xs">
              {(["en", "id", "fr", "es"] as const).map((loc) => {
                const isSelected = selectedLocale === loc;
                return (
                  <Button
                    key={loc}
                    size="sm"
                    variant={isSelected ? "filled" : "outline"}
                    tone={isSelected ? "primary" : "secondary"}
                    onPress={() => setSelectedLocale(loc)}
                  >
                    {loc.toUpperCase()}
                  </Button>
                );
              })}
            </Box>

            {/* Localized DatePicker Input Field */}
            <DatePickerInput
              locale={selectedLocale}
              title="SELECT DATE"
              placeholder="Select date"
              value={localizedDate}
              onChange={setLocalizedDate}
              monthFormat="full"
              showDayOfWeek
            />
          </Box>
        </Card>

        {/* 5. TimePicker (24-Hour & 12-Hour AM/PM) */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Time Picker (24H & 12H AM/PM)
              </Text>
              <Badge tone="primary">
                {is24HourTime ? "24-Hour" : "12-Hour AM/PM"}
              </Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Smooth wheel time picker supporting both 24-hour military format and standard 12-hour AM/PM selector.
            </Text>

            {/* Toggle 24h vs 12h AM/PM */}
            <Box row gap="xs">
              <Button
                size="sm"
                variant={is24HourTime ? "filled" : "outline"}
                tone={is24HourTime ? "primary" : "secondary"}
                onPress={() => setIs24HourTime(true)}
              >
                24-Hour (00-23)
              </Button>
              <Button
                size="sm"
                variant={!is24HourTime ? "filled" : "outline"}
                tone={!is24HourTime ? "primary" : "secondary"}
                onPress={() => setIs24HourTime(false)}
              >
                12-Hour (AM/PM)
              </Button>
            </Box>

            {/* Dedicated TimePickerInput Trigger Field */}
            <Box gap="xs">
              <Text variant="caption" color="textMuted">
                Time Picker Input Field
              </Text>
              <DatePickerInput
                mode="time"
                is24Hour={is24HourTime}
                title="SELECT TIME"
                placeholder="Select time"
                value={appointmentTime}
                onChange={setAppointmentTime}
              />
            </Box>

            <Divider style={{ marginVertical: 4 }} />

            {/* Inline Wheel Time Picker */}
            <Box gap="xs">
              <Text variant="caption" color="textMuted">
                Inline Roller: {formatTime(appointmentTime, is24HourTime)}
              </Text>
              <DatePicker
                mode="time"
                is24Hour={is24HourTime}
                value={appointmentTime}
                onChange={setAppointmentTime}
                minuteInterval={5}
              />
            </Box>
          </Box>
        </Card>

        {/* 6. Month-Year Inline Expiration Picker */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Month - Year Expiration Picker
              </Text>
              <Badge tone="accent">mode="month-year"</Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Embeddable inline wheels for credit card and document expiration dates.
            </Text>

            <DatePicker
              mode="month-year"
              value={monthYear}
              onChange={setMonthYear}
              monthFormat="full"
            />
          </Box>
        </Card>

        {/* 7. Custom Dialog Triggers */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Custom Dialog Triggers
              </Text>
              <Badge tone="warning">DatePickerDialog</Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Open the picker modal dialog from custom buttons.
            </Text>

            <Box row gap="md">
              <Button
                variant="filled"
                tone="primary"
                style={{ flex: 1 }}
                onPress={() => setWheelModalOpen(true)}
              >
                Open Wheel Dialog
              </Button>
              <Button
                variant="outline"
                tone="secondary"
                style={{ flex: 1 }}
                onPress={() => setCalendarModalOpen(true)}
              >
                Open Calendar Dialog
              </Button>
            </Box>

            {/* Wheel Dialog */}
            <DatePickerDialog
              visible={wheelModalOpen}
              variant="wheel"
              title="SET BIRTHDAY"
              value={birthday}
              onClose={() => setWheelModalOpen(false)}
              onConfirm={(d) => {
                setBirthday(d);
                setWheelModalOpen(false);
              }}
            />

            {/* Calendar Dialog */}
            <DatePickerDialog
              visible={calendarModalOpen}
              variant="calendar"
              title="SELECT DATE"
              value={calendarDate}
              onClose={() => setCalendarModalOpen(false)}
              onConfirm={(d) => {
                setCalendarDate(d);
                setCalendarModalOpen(false);
              }}
            />
          </Box>
        </Card>
      </Box>
    </Section>
  );
}
