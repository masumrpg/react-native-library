import {
  Box,
  Card,
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
  Text,
} from "@masumdev/rn-ui";
import { Section, type RnUiSectionContext } from "../shared";

export function ContextMenuSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { colors, setAlertDialogVisible, showBookmark, setShowBookmark } = ctx;

  return (
    <Section title="ContextMenu">
      <Card outlined>
        <Box gap="lg">
          <Text color="textMuted">
            Long-press the card below on mobile to reveal a floating, styled
            context menu with separators, labels, shortcuts, and checkbox items.
          </Text>

          <ContextMenu>
            <ContextMenuTrigger>
              <Box
                center
                style={{
                  paddingVertical: 40,
                  borderWidth: 1,
                  borderStyle: "dashed",
                  borderColor: colors.border,
                  borderRadius: 8,
                  backgroundColor: colors.surfaceMuted,
                }}
              >
                <Text style={{ fontWeight: "500", color: colors.textMuted }}>
                  Long press here
                </Text>
              </Box>
            </ContextMenuTrigger>

            <ContextMenuContent>
              <ContextMenuLabel>Page Actions</ContextMenuLabel>
              <ContextMenuItem onPress={() => console.log("Back")}>
                <Text style={{ fontSize: 14 }}>Back</Text>
                <ContextMenuShortcut>⌘[</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem onPress={() => console.log("Reload")}>
                <Text style={{ fontSize: 14 }}>Reload</Text>
                <ContextMenuShortcut>⌘R</ContextMenuShortcut>
              </ContextMenuItem>

              <ContextMenuSeparator />

              <ContextMenuCheckboxItem
                checked={showBookmark}
                onCheckedChange={setShowBookmark}
              >
                Show Bookmark Bar
              </ContextMenuCheckboxItem>

              <ContextMenuSeparator />

              <ContextMenuItem
                variant="destructive"
                onPress={() => setAlertDialogVisible(true)}
              >
                <Text style={{ fontSize: 14, color: colors.danger }}>
                  Delete Card
                </Text>
                <ContextMenuShortcut>⌫</ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </Box>
      </Card>
    </Section>
  );
}
