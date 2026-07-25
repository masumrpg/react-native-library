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
      <Card>
        <Box gap="md">
          <Box gap="xs">
            <Text variant="label">Expo React Native OTP</Text>
            <Text variant="bodySmall" color="textMuted">
              One-time code input by Ma'sum, 2026.
            </Text>
          </Box>

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

          <InputOTP maxLength={4} invalid>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        </Box>
      </Card>
    </Section>
  );
}
