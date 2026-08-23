import {
  Box,
  Card,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from "@masumdev/rn-ui";
import { CreditCard, Settings, User } from "lucide-react-native";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function TabsSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { icon, activeTab, setActiveTab } = ctx;

  return (
    <Section title="Tabs">
      <Card outlined>
        <Box gap="lg">
          <Text color="textMuted">
            Tabbed view navigator with smooth sliding active indicator, optional non-animated instant mode, glassmorphism, haptics, sizes, and icons.
          </Text>

          {/* 1. Animated Smooth Sliding Tabs (Default) */}
          <Box gap="xs">
            <Text variant="labelSmall" color="textSubtle">
              Smooth Sliding Indicator (animated=true)
            </Text>
            <Tabs animated value={activeTab} onValueChange={setActiveTab} variant="segmented">
              <TabsList>
                <TabsTrigger value="tab1" icon={icon(User)}>
                  Account
                </TabsTrigger>
                <TabsTrigger value="tab2" icon={icon(Settings)}>
                  Preferences
                </TabsTrigger>
                <TabsTrigger value="tab3" icon={icon(CreditCard)}>
                  Billing
                </TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <Box p="md" gap="xs">
                  <Text variant="title">Account Settings</Text>
                  <Text variant="bodySmall" color="textMuted">
                    Manage your profile, email address, and security settings.
                  </Text>
                </Box>
              </TabsContent>
              <TabsContent value="tab2">
                <Box p="md" gap="xs">
                  <Text variant="title">Preferences</Text>
                  <Text variant="bodySmall" color="textMuted">
                    Customize theme colors, language, and notification alerts.
                  </Text>
                </Box>
              </TabsContent>
              <TabsContent value="tab3">
                <Box p="md" gap="xs">
                  <Text variant="title">Billing & Subscription</Text>
                  <Text variant="bodySmall" color="textMuted">
                    View invoices, payment methods, and active subscription plan.
                  </Text>
                </Box>
              </TabsContent>
            </Tabs>
          </Box>

          {/* 2. Instant Switch Non-Animated Tabs */}
          <Box gap="xs">
            <Text variant="labelSmall" color="textSubtle">
              Instant Switch Non-Animated (animated=false)
            </Text>
            <Tabs animated={false} value={activeTab} onValueChange={setActiveTab} variant="soft">
              <TabsList>
                <TabsTrigger value="tab1">Account</TabsTrigger>
                <TabsTrigger value="tab2">Preferences</TabsTrigger>
                <TabsTrigger value="tab3">Billing</TabsTrigger>
              </TabsList>
            </Tabs>
          </Box>

          {/* 3. Underline Variant with Sliding Indicator */}
          <Box gap="xs">
            <Text variant="labelSmall" color="textSubtle">
              Sliding Underline Variant
            </Text>
            <Tabs animated value={activeTab} onValueChange={setActiveTab} variant="underline">
              <TabsList>
                <TabsTrigger value="tab1">Account</TabsTrigger>
                <TabsTrigger value="tab2">Preferences</TabsTrigger>
                <TabsTrigger value="tab3">Billing</TabsTrigger>
              </TabsList>
            </Tabs>
          </Box>

          {/* 4. Glassmorphism & Small Size */}
          <Box gap="xs">
            <Text variant="labelSmall" color="textSubtle">
              Glassmorphism & Small Size (sm)
            </Text>
            <Tabs size="sm" glass value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="tab1">Account</TabsTrigger>
                <TabsTrigger value="tab2">Preferences</TabsTrigger>
                <TabsTrigger value="tab3">Billing</TabsTrigger>
              </TabsList>
            </Tabs>
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
