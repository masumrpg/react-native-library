import {
  Box,
  Button,
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
  Badge,
} from "@masumdev/rn-ui";
import {
  ChevronDown,
  RefreshCw,
  Copy,
  SlidersHorizontal,
  Trash2,
  User,
  Settings,
  Grid,
  Eye,
} from "lucide-react-native";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function DropdownMenuSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { icon, setAlertDialogVisible } = ctx;

  const [compactMenu, setCompactMenu] = React.useState(false);
  const [showGrid, setShowGrid] = React.useState(true);
  const [showHidden, setShowHidden] = React.useState(false);

  return (
    <Section title="Dropdown Menu">
      <Card outlined>
        <Box gap="lg">
          <Text color="textMuted">
            Tap-triggered contextual menu cards with alignment options, icons, shortcut keys, toggle checkboxes, and destructive actions.
          </Text>

          {/* Trigger 1: Action Menu Button */}
          <Box gap="xs">
            <Text variant="labelSmall" color="textMuted">
              Standard Action Menu
            </Text>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="filled"
                  tone="primary"
                  rightIcon={icon(ChevronDown)}
                >
                  Options Menu
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent width={220} align="start">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem leftIcon={icon(RefreshCw)}>
                  <Text variant="bodySmall">Refresh Feed</Text>
                  <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem leftIcon={icon(Copy)}>
                  <Text variant="bodySmall">Duplicate Page</Text>
                  <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuItem leftIcon={icon(User)}>
                  <Text variant="bodySmall">Profile Info</Text>
                </DropdownMenuItem>
                <DropdownMenuItem leftIcon={icon(Settings)}>
                  <Text variant="bodySmall">Settings</Text>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  leftIcon={icon(Trash2)}
                  onPress={() => setAlertDialogVisible(true)}
                >
                  <Text variant="bodySmall">Delete Item</Text>
                  <DropdownMenuShortcut>Del</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Box>

          {/* Trigger 2: View Preferences Filter Menu */}
          <Box gap="xs">
            <Text variant="labelSmall" color="textMuted">
              View Preferences (Checkboxes)
            </Text>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="outline"
                  tone="accent"
                  leftIcon={icon(SlidersHorizontal)}
                  rightIcon={icon(ChevronDown)}
                >
                  View Controls
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent width={240} align="start">
                <DropdownMenuLabel>Toggle Views</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  leftIcon={icon(Grid)}
                  checked={showGrid}
                  onCheckedChange={setShowGrid}
                >
                  Show Grid Lines
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem
                  leftIcon={icon(Eye)}
                  checked={showHidden}
                  onCheckedChange={setShowHidden}
                >
                  Show Hidden Files
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem
                  leftIcon={icon(SlidersHorizontal)}
                  checked={compactMenu}
                  onCheckedChange={setCompactMenu}
                >
                  Compact Spacing
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Box>

          {/* Status Indicators */}
          <Box row style={{ flexWrap: "wrap", gap: 8 }}>
            <Badge tone={showGrid ? "primary" : "secondary"}>
              {`Grid: ${showGrid ? "ON" : "OFF"}`}
            </Badge>
            <Badge tone={showHidden ? "warning" : "secondary"}>
              {`Hidden: ${showHidden ? "ON" : "OFF"}`}
            </Badge>
            <Badge tone={compactMenu ? "accent" : "secondary"}>
              {`Compact: ${compactMenu ? "ON" : "OFF"}`}
            </Badge>
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
