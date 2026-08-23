import { Popover, PopoverTrigger, PopoverContent, Button, Card, Box, Text } from "@masumdev/rn-ui";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function PopoverSection({ ctx: _ctx }: { ctx: RnUiSectionContext }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Section title="Popover">
      <Card outlined>
        <Box gap="md">
          <Text color="textMuted">
            Anchored popover menu card attached to trigger position.
          </Text>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
              <Button variant="outline" tone="secondary">
                Toggle Popover
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Box p="sm" gap="xs">
                <Text variant="title">Popover Card</Text>
                <Text variant="bodySmall" color="textMuted">
                  This is an anchored popover content view.
                </Text>
              </Box>
            </PopoverContent>
          </Popover>
        </Box>
      </Card>
    </Section>
  );
}
