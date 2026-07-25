import {
  Box,
  Card,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Text,
} from "@masumdev/rn-ui";
import { ChevronsUpDown } from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function CollapsibleSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { colors } = ctx;

  return (
    <Section title="Collapsible">
      <Card outlined>
        <Box gap="md">
          <Text color="textMuted">
            A simple accordion-like container to show/hide expandable sections
            with smooth animated height scaling.
          </Text>

          <Collapsible style={{ width: "100%", marginTop: 8 }}>
            <CollapsibleTrigger>
              <Box
                row
                center
                style={{
                  justifyContent: "space-between",
                  paddingVertical: 4,
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: colors.text,
                  }}
                >
                  Order #4189
                </Text>
                <Box
                  center
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                  }}
                >
                  <ChevronsUpDown color={colors.textMuted} size={16} />
                </Box>
              </Box>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <Box gap="sm" style={{ marginTop: 12 }}>
                {/* Box 1: Status */}
                <Box
                  row
                  center
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 10,
                    backgroundColor: colors.surface,
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: colors.textMuted, fontSize: 14 }}>
                    Status
                  </Text>
                  <Text
                    style={{
                      fontWeight: "600",
                      color: colors.text,
                      fontSize: 14,
                    }}
                  >
                    Shipped
                  </Text>
                </Box>

                {/* Box 2: Shipping address */}
                <Box
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 10,
                    backgroundColor: colors.surface,
                    gap: 2,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      color: colors.text,
                      fontSize: 14,
                    }}
                  >
                    Shipping address
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                    100 Market St, San Francisco
                  </Text>
                </Box>

                {/* Box 3: Items */}
                <Box
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 10,
                    backgroundColor: colors.surface,
                    gap: 2,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      color: colors.text,
                      fontSize: 14,
                    }}
                  >
                    Items
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                    2x Studio Headphones
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
