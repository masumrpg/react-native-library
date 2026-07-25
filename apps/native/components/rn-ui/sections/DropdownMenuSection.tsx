import {
  Box,
  Card,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Text,
} from "@masumdev/rn-ui";
import { ChevronsUpDown } from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function DropdownMenuSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { colors, styles, setAlertDialogVisible, compactMenu, setCompactMenu } =
    ctx;

  return (
    <Section title="Dropdown Menu">
      <Card>
        <Box gap="md">
          <Text color="textMuted">
            Tap-triggered menu with flat bordered surface, alignment control,
            checkbox item, shortcuts, and modal escape hatches.
          </Text>

          <DropdownMenu>
            <DropdownMenuTrigger style={styles.dropdownTrigger}>
              <Text variant="label" color="secondary">
                Open Menu
              </Text>
              <ChevronsUpDown color={colors.secondary} size={18} />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuLabel>View Options</DropdownMenuLabel>
              <DropdownMenuItem onPress={() => undefined}>
                <Text style={{ fontSize: 14, color: colors.text }}>
                  Refresh
                </Text>
                <DropdownMenuShortcut>R</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onPress={() => undefined}>
                <Text style={{ fontSize: 14, color: colors.text }}>
                  Duplicate
                </Text>
                <DropdownMenuShortcut>D</DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuCheckboxItem
                checked={compactMenu}
                onCheckedChange={setCompactMenu}
              >
                Compact mode
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                onPress={() => setAlertDialogVisible(true)}
              >
                <Text style={{ fontSize: 14, color: colors.danger }}>
                  Delete sample
                </Text>
                <DropdownMenuShortcut>Del</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Box>
      </Card>
    </Section>
  );
}
