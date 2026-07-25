import {
  Box,
  Card,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
  Text,
} from "@masumdev/rn-ui";
import { Copy, EyeOff, FileCode, Search } from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function InputGroupSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { colors, styles, searchQuery, setSearchQuery } = ctx;

  return (
    <Section title="Input Group">
      <Card>
        <Box gap="md">
          <InputGroup>
            <InputGroupAddon>
              <Search color={colors.textMuted} size={16} />
            </InputGroupAddon>
            <InputGroupInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search..."
              returnKeyType="search"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>12 results</InputGroupText>
            </InputGroupAddon>
          </InputGroup>

          <Text variant="bodySmall" color="textMuted">
            Expo React Native by Ma'sum, 2026.
          </Text>

          <Box gap="xs">
            <Text variant="label">Input</Text>
            <InputGroup>
              <InputGroupInput placeholder="Enter password" secureTextEntry />
              <InputGroupAddon align="inline-end">
                <EyeOff color={colors.textMuted} size={16} />
              </InputGroupAddon>
            </InputGroup>
            <Text variant="bodySmall" color="textMuted">
              Icon positioned at the end.
            </Text>
          </Box>

          <Box gap="xs">
            <Text variant="label">Input</Text>
            <InputGroup orientation="block">
              <InputGroupAddon align="block-start">
                <InputGroupText>Full Name</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput placeholder="Enter your name" />
            </InputGroup>
            <Text variant="bodySmall" color="textMuted">
              Header positioned above the input.
            </Text>
          </Box>

          <Box gap="xs">
            <Text variant="label">Textarea</Text>
            <InputGroup orientation="block">
              <InputGroupAddon
                align="block-start"
                style={styles.inputGroupRowAddon}
              >
                <Box row center gap="sm" flex={1}>
                  <FileCode color={colors.textMuted} size={16} />
                  <InputGroupText>script.js</InputGroupText>
                </Box>
                <Copy color={colors.textMuted} size={16} />
              </InputGroupAddon>
              <InputGroupTextarea
                value={"console.log('Hello, world!');"}
                onChangeText={() => undefined}
              />
            </InputGroup>
            <Text variant="bodySmall" color="textMuted">
              Header positioned above the textarea.
            </Text>
          </Box>

          <Box gap="xs">
            <Text variant="label">Input</Text>
            <InputGroup orientation="block">
              <InputGroupInput placeholder="Enter amount" />
              <InputGroupAddon align="block-end">
                <InputGroupText>USD</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <Text variant="bodySmall" color="textMuted">
              Footer positioned below the input.
            </Text>
          </Box>

          <Box gap="xs">
            <Text variant="label">Textarea</Text>
            <InputGroup orientation="block">
              <InputGroupTextarea placeholder="Write a comment..." />
              <InputGroupAddon
                align="block-end"
                style={styles.inputGroupRowAddon}
              >
                <InputGroupText>0/280</InputGroupText>
                <InputGroupButton size="sm" variant="filled">
                  Post
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <Text variant="bodySmall" color="textMuted">
              Footer positioned below the textarea.
            </Text>
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
