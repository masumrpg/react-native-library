import { Tabs, TabsContent, TabsList, TabsTrigger, Card, Box, Text } from "@masumdev/rn-ui";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function TabsSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { activeTab, setActiveTab } = ctx;

  return (
    <Section title="Tabs">
      <Card outlined>
        <Box gap="md">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="tab1">Account</TabsTrigger>
              <TabsTrigger value="tab2">Preferences</TabsTrigger>
              <TabsTrigger value="tab3">Billing</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">
              <Box p="md" gap="xs">
                <Text variant="title">Account Settings</Text>
                <Text variant="bodySmall" color="textMuted">Manage your profile, email, and security settings.</Text>
              </Box>
            </TabsContent>
            <TabsContent value="tab2">
              <Box p="md" gap="xs">
                <Text variant="title">Preferences</Text>
                <Text variant="bodySmall" color="textMuted">Customize theme colors, language, and notifications.</Text>
              </Box>
            </TabsContent>
            <TabsContent value="tab3">
              <Box p="md" gap="xs">
                <Text variant="title">Billing</Text>
                <Text variant="bodySmall" color="textMuted">View invoices and active subscription plan details.</Text>
              </Box>
            </TabsContent>
          </Tabs>
        </Box>
      </Card>
    </Section>
  );
}
