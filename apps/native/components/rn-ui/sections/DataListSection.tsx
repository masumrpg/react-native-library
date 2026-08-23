import { DataList, DataListItem, DataListLabel, DataListValue, Card, Box } from "@masumdev/rn-ui";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function DataListSection({ ctx: _ctx }: { ctx: RnUiSectionContext }) {
  return (
    <Section title="DataList">
      <Card outlined>
        <Box gap="md">
          <DataList>
            <DataListItem>
              <DataListLabel>Framework</DataListLabel>
              <DataListValue>Expo React Native</DataListValue>
            </DataListItem>
            <DataListItem>
              <DataListLabel>Author</DataListLabel>
              <DataListValue>Ma'sum</DataListValue>
            </DataListItem>
            <DataListItem>
              <DataListLabel>License</DataListLabel>
              <DataListValue>MIT</DataListValue>
            </DataListItem>
            <DataListItem>
              <DataListLabel>Type Safety</DataListLabel>
              <DataListValue>Strict (Zero Any)</DataListValue>
            </DataListItem>
          </DataList>
        </Box>
      </Card>
    </Section>
  );
}
