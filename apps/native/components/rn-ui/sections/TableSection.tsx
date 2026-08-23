import { Table, TableCell, TableHead, TableRow, Card, Box } from "@masumdev/rn-ui";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function TableSection({ ctx: _ctx }: { ctx: RnUiSectionContext }) {
  return (
    <Section title="Table">
      <Card outlined>
        <Box gap="md">
          <Table>
            <TableRow>
              <TableHead>Package</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
            <TableRow>
              <TableCell>@masumdev/rn-ui</TableCell>
              <TableCell>0.1.7</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>@masumdev/rn-tajweed-verse</TableCell>
              <TableCell>0.1.1</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>@masumdev/react-native-qr-code-gen</TableCell>
              <TableCell>0.1.3</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
          </Table>
        </Box>
      </Card>
    </Section>
  );
}
