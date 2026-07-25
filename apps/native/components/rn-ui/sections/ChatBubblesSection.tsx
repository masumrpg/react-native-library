import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Box,
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
  Card,
  Text,
} from "@masumdev/rn-ui";
import { Section, type RnUiSectionContext } from "../shared";

export function ChatBubblesSection({ ctx: _ctx }: { ctx: RnUiSectionContext }) {
  return (
    <Section title="Chat Bubbles">
      <Card outlined>
        <Box gap="lg">
          <Text color="textMuted">
            Message layout components supporting start/end alignment, multiple
            tone variants, and reaction overlay tags.
          </Text>

          <BubbleGroup>
            {/* Incoming message */}
            <Box
              row
              gap="sm"
              style={{ alignSelf: "flex-start", alignItems: "flex-end" }}
            >
              <Avatar size="sm">
                <AvatarImage
                  source={{
                    uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80",
                  }}
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Bubble align="start" variant="secondary">
                <BubbleContent>
                  Hai! Apakah kamu bisa bantu saya memahami cara kustomisasi
                  tema warna di pustaka ini?
                </BubbleContent>
              </Bubble>
            </Box>

            {/* Outgoing message */}
            <Bubble align="end" variant="default">
              <BubbleContent>
                Tentu! Kamu cukup buat objek tema baru dan oper ke
                ThemeProvider. Contoh lengkapnya ada di dokumentasi README.
              </BubbleContent>
              <BubbleReactions side="bottom" align="end">
                <Text style={{ fontSize: 11 }}>👍 2</Text>
              </BubbleReactions>
            </Bubble>

            {/* Outgoing follow-up */}
            <Bubble align="end" variant="tinted">
              <BubbleContent>
                Apakah penjelasan ini cukup membantu? 😊
              </BubbleContent>
              <BubbleReactions side="bottom" align="end">
                <Text style={{ fontSize: 11 }}>❤️ 1</Text>
              </BubbleReactions>
            </Bubble>

            {/* Incoming message with warning/destructive alert */}
            <Box
              row
              gap="sm"
              style={{
                alignSelf: "flex-start",
                alignItems: "flex-end",
                marginTop: 8,
              }}
            >
              <Avatar size="sm">
                <AvatarImage
                  source={{
                    uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80",
                  }}
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Bubble align="start" variant="destructive">
                <BubbleContent>
                  Wah, kelihatannya ada yang salah di setup saya. Warnanya tidak
                  mau ganti.
                </BubbleContent>
                <BubbleReactions side="bottom" align="start">
                  <Text style={{ fontSize: 11 }}>😢 1</Text>
                </BubbleReactions>
              </Bubble>
            </Box>

            {/* Outgoing message with outline variant */}
            <Bubble align="end" variant="outline">
              <BubbleContent>
                Coba pastikan berkas konfigurasi tsconfig sudah benar dan build
                ulang projectnya.
              </BubbleContent>
            </Bubble>
          </BubbleGroup>
        </Box>
      </Card>
    </Section>
  );
}
