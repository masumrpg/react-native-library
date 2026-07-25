import {
  Box,
  Card,
  DataList,
  DataListItem,
  DataListLabel,
  DataListValue,
  Table,
  TableCell,
  TableHead,
  TableRow,
} from "@masumdev/rn-ui";
import { Section, type RnUiSectionContext } from "../shared";

export function TableDataListSection({
  ctx: _ctx,
}: {
  ctx: RnUiSectionContext;
}) {
  return (
    <Section title="Table, Data List">
      <Card>
        <Box gap="md">
          <Table>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
            <TableRow>
              <TableCell>Expo React Native</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>by Ma'sum</TableCell>
              <TableCell>2026</TableCell>
            </TableRow>
          </Table>

          <DataList>
            <DataListItem>
              <DataListLabel>Framework</DataListLabel>
              <DataListValue>Expo React Native</DataListValue>
            </DataListItem>
            <DataListItem>
              <DataListLabel>Author</DataListLabel>
              <DataListValue>Ma'sum</DataListValue>
            </DataListItem>
          </DataList>
        </Box>
      </Card>
    </Section>
  );
}
