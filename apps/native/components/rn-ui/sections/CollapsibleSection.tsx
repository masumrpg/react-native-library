import {
  Box,
  Card,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Text,
} from "@masumdev/rn-ui";
import { ChevronsUpDown, Package, Truck, CreditCard } from "lucide-react-native";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function CollapsibleSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { colors } = ctx;

  return (
    <Section title="Collapsible">
      <Card outlined>
        <Box gap="lg">
          <Text color="textMuted">
            A lightweight expandable container component to show/hide detailed section content with smooth height scaling.
          </Text>

          {/* Order Details Demo */}
          <Collapsible defaultOpen={false} style={{ width: "100%" }}>
            <CollapsibleTrigger>
              <Box
                row
                center
                style={{
                  justifyContent: "space-between",
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  width: "100%",
                }}
              >
                <Box row center gap="sm">
                  <Package color={colors.primary} size={20} />
                  <Text weight="700" color="text">
                    Order #4189 Details
                  </Text>
                </Box>
                <Box
                  center
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    backgroundColor: colors.backgroundMuted,
                  }}
                >
                  <ChevronsUpDown color={colors.textMuted} size={16} />
                </Box>
              </Box>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <Box gap="sm" style={{ marginTop: 10 }}>
                {/* Status Card */}
                <Box
                  row
                  center
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 10,
                    backgroundColor: colors.surfaceMuted,
                    justifyContent: "space-between",
                  }}
                >
                  <Text color="textMuted" variant="bodySmall">
                    Status
                  </Text>
                  <Text weight="600" color="success" variant="bodySmall">
                    Shipped (On the way)
                  </Text>
                </Box>

                {/* Shipping address */}
                <Box
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 10,
                    backgroundColor: colors.surfaceMuted,
                    gap: 2,
                  }}
                >
                  <Box row center gap="xs">
                    <Truck color={colors.primary} size={16} />
                    <Text weight="600" color="text" variant="bodySmall">
                      Shipping Address
                    </Text>
                  </Box>
                  <Text color="textMuted" variant="bodySmall">
                    100 Market St, San Francisco, CA 94105
                  </Text>
                </Box>

                {/* Items & Payment */}
                <Box
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 10,
                    backgroundColor: colors.surfaceMuted,
                    gap: 2,
                  }}
                >
                  <Box row center gap="xs">
                    <CreditCard color={colors.primary} size={16} />
                    <Text weight="600" color="text" variant="bodySmall">
                      Items Purchased
                    </Text>
                  </Box>
                  <Text color="textMuted" variant="bodySmall">
                    2x Studio Pro Wireless Headphones ($299.00)
                  </Text>
                </Box>
              </Box>
            </CollapsibleContent>
          </Collapsible>
        </Box>
      </Card>
    </Section>
  );
}
