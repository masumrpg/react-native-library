import {
  Box,
  Card,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Text,
} from "@masumdev/rn-ui";
import { Section, type RnUiSectionContext } from "../shared";

export function InputOTPSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { otpValue, setOtpValue } = ctx;

  return (
    <Section title="Input OTP">
      <Card outlined>
        <Box gap="lg">
          <Text color="textMuted">
            Verification PIN entry slots with animated caret, automatic number-pad keyboard, and centered layout.
          </Text>

          {/* 6-Digit PIN Verification */}
          <Box gap="xs" style={{ alignItems: "center" }}>
            <Text variant="labelSmall" color="textSubtle">
              6-Digit Verification PIN (Centered)
            </Text>
            <InputOTP value={otpValue} onChangeText={setOtpValue} maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSeparator />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </Box>

          {/* 4-Digit Invalid State */}
          <Box gap="xs" style={{ alignItems: "center", marginTop: 8 }}>
            <Text variant="labelSmall" color="danger">
              4-Digit Invalid Code State
            </Text>
            <InputOTP maxLength={4} invalid>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
