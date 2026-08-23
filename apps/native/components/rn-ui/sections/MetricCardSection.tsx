import { MetricCard, Card, Box } from "@masumdev/rn-ui";
import { BarChart3, TrendingUp, Users } from "lucide-react-native";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function MetricCardSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { icon } = ctx;

  return (
    <Section title="MetricCard">
      <Box gap="md">
        <Card outlined>
          <MetricCard
            label="Total Components"
            value="55+"
            delta="+12 new primitives added"
            icon={icon(BarChart3)}
          />
        </Card>

        <Card outlined>
          <MetricCard
            label="Monthly Downloads"
            value="14,250"
            delta="+28.4% growth this month"
            icon={icon(TrendingUp)}
          />
        </Card>

        <Card outlined>
          <MetricCard
            label="Active Developers"
            value="1,840"
            delta="React Native & Expo"
            icon={icon(Users)}
          />
        </Card>
      </Box>
    </Section>
  );
}
