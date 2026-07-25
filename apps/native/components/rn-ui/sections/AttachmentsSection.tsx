import { Attachment, Box, Card, Divider, Text } from "@masumdev/rn-ui";
import { FileCode, X } from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function AttachmentsSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { styles, icon } = ctx;

  return (
    <Section title="Attachments">
      <Card outlined>
        <Box gap="lg">
          <Text color="textMuted">
            File attachments preview supporting grid-like Card views and
            full-width list Row views.
          </Text>

          {/* Grid-like layout matching the reference image */}
          <Box gap="sm">
            <Text variant="labelSmall" color="textSubtle">
              Image Previews (Card Layout)
            </Text>
            <Box row gap="sm" style={styles.wrap}>
              <Attachment
                layout="card"
                name="workspace.png"
                description="PNG • 820 KB"
                thumbnail="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200&q=80"
              />
              <Attachment
                layout="card"
                name="desk-reference.jpg"
                description="JPG • 1.1 MB"
                thumbnail="https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=200&q=80"
              />
              <Attachment
                layout="card"
                name="office-reference.jpg"
                description="JPG • 940 KB"
                thumbnail="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=200&q=80"
              />
            </Box>
          </Box>

          <Divider />

          {/* List layout matching reference image */}
          <Box gap="sm">
            <Text variant="labelSmall" color="textSubtle">
              Document Previews (Row Layout)
            </Text>
            <Box gap="sm">
              <Attachment
                layout="row"
                name="sales-dashboard.pdf"
                description="Uploading • 64%"
                loading={true}
                onRemove={() => undefined}
                closeIcon={icon(X)}
              />
              <Attachment
                layout="row"
                name="message-renderer.tsx"
                description="TypeScript • 12 KB"
                thumbnail={icon(FileCode)}
                onRemove={() => undefined}
                closeIcon={icon(X)}
              />
            </Box>
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
