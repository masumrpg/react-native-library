import { Pagination, Card, Box, Text } from "@masumdev/rn-ui";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function PaginationSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { page, setPage } = ctx;

  return (
    <Section title="Pagination">
      <Card outlined>
        <Box gap="md">
          <Text variant="label">Active Page: {page}</Text>
          <Pagination
            page={page}
            pageCount={8}
            onPageChange={setPage}
          />
        </Box>
      </Card>
    </Section>
  );
}
