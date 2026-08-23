import { AlertDialog, Box, Button, Card, Text } from "@masumdev/rn-ui";
import { LogOut, Trash } from "lucide-react-native";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function AlertDialogSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { icon, alertDialogVisible, setAlertDialogVisible } = ctx;
  const [logoutVisible, setLogoutVisible] = React.useState(false);

  return (
    <Section title="Alert Dialog">
      <Card outlined>
        <Box gap="md">
          <Text color="textMuted">
            Modal confirmation dialog with circular tone badge, glowing border tints, glassmorphism, animated scale entry, backdrop dismiss, and haptics.
          </Text>

          <Box row gap="sm" style={{ flexWrap: "wrap" }}>
            <Button
              variant="filled"
              tone="danger"
              leftIcon={icon(Trash)}
              onPress={() => setAlertDialogVisible(true)}
            >
              Open Delete Dialog
            </Button>

            <Button
              variant="outline"
              tone="warning"
              leftIcon={icon(LogOut)}
              onPress={() => setLogoutVisible(true)}
            >
              Open Logout Dialog
            </Button>
          </Box>

          {/* 1. Centered Delete Confirmation Dialog */}
          <AlertDialog
            visible={alertDialogVisible}
            tone="danger"
            align="center"
            glass
            title="Delete Workspace?"
            description="Are you sure you want to permanently delete this project workspace? This action cannot be undone and all data will be removed."
            icon={icon(Trash)}
            confirmText="Delete Workspace"
            cancelText="Cancel"
            onConfirm={() => setAlertDialogVisible(false)}
            onCancel={() => setAlertDialogVisible(false)}
            onClose={() => setAlertDialogVisible(false)}
          />

          {/* 2. Logout Confirmation Dialog */}
          <AlertDialog
            visible={logoutVisible}
            tone="warning"
            align="center"
            title="Sign Out of Account?"
            description="You will need to sign in again to access your saved projects and synchronized cloud data."
            icon={icon(LogOut)}
            confirmText="Sign Out"
            cancelText="Stay Signed In"
            onConfirm={() => setLogoutVisible(false)}
            onCancel={() => setLogoutVisible(false)}
            onClose={() => setLogoutVisible(false)}
          />
        </Box>
      </Card>
    </Section>
  );
}
