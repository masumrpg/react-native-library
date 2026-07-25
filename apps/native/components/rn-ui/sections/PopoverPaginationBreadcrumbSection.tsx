import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Card,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@masumdev/rn-ui";
import { Section, type RnUiSectionContext } from "../shared";

export function PopoverPaginationBreadcrumbSection({
  ctx,
}: {
  ctx: RnUiSectionContext;
}) {
  const { styles, page, setPage } = ctx;

  return (
    <Section title="Popover, Pagination, Breadcrumb">
      <Card>
        <Box gap="md">
          <Popover>
            <PopoverTrigger style={styles.popoverTrigger}>
              <Text variant="label" color="primary">
                Open Popover
              </Text>
            </PopoverTrigger>
            <PopoverContent>
              <Box gap="xs">
                <Text variant="label">Expo React Native</Text>
                <Text variant="bodySmall" color="textMuted">
                  Popover content by Ma'sum, 2026.
                </Text>
              </Box>
            </PopoverContent>
          </Popover>

          <Pagination page={page} pageCount={5} onPageChange={setPage} />

          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink>Expo</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>React Native</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Ma'sum</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
      </Card>
    </Section>
  );
}
