import {
  Badge,
  Button,
  Card,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  Text,
} from "@masumdev/rn-ui";
import { Inbox } from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function ItemSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { colors } = ctx;

  return (
    <Section title="Item">
      <Card>
        <ItemGroup>
          <Item variant="outline">
            <ItemMedia variant="icon">
              <Inbox color={colors.primary} size={20} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Expo React Native</ItemTitle>
              <ItemDescription>
                Reusable item row by Ma'sum for consistent 2026 mobile lists.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge tone="success" variant="soft">
                Active
              </Badge>
            </ItemActions>
          </Item>

          <ItemSeparator />

          <Item variant="muted" size="sm">
            <ItemHeader>
              <ItemTitle>Theme tokens</ItemTitle>
              <Badge tone="info" variant="outline">
                2026
              </Badge>
            </ItemHeader>
            <ItemContent>
              <ItemDescription>
                Header and footer areas stay full width while content remains
                composable.
              </ItemDescription>
            </ItemContent>
            <ItemFooter>
              <Text variant="caption" color="textMuted">
                by Ma'sum
              </Text>
              <Button size="xs" variant="ghost" tone="secondary">
                View
              </Button>
            </ItemFooter>
          </Item>
        </ItemGroup>
      </Card>
    </Section>
  );
}
