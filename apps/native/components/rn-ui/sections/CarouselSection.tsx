import {
  Badge,
  Box,
  Button,
  Card,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Text,
} from "@masumdev/rn-ui";
import { Sparkles, ShieldCheck, Zap, Rocket, ArrowRight } from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function CarouselSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { colors, isDark } = ctx;

  const deckFeatures = [
    {
      title: "AI Auto-Scaling",
      subtitle: "Dynamic layout adjustment for all devices",
      icon: Sparkles,
      tone: "primary" as const,
      badge: "FEATURED",
    },
    {
      title: "Enterprise Shield",
      subtitle: "Bank-grade encryption & security protocols",
      icon: ShieldCheck,
      tone: "success" as const,
      badge: "SECURE",
    },
    {
      title: "Instant Response",
      subtitle: "Zero latency state updates & haptic motion",
      icon: Zap,
      tone: "warning" as const,
      badge: "FAST",
    },
    {
      title: "Rocket Deploy",
      subtitle: "One-click deployment to Expo & React Native",
      icon: Rocket,
      tone: "accent" as const,
      badge: "PRO",
    },
  ];

  return (
    <Section title="Carousel">
      <Box gap="xl">
        {/* Variant 1: Interactive Feature Deck */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Interactive Deck Carousel
              </Text>
              <Badge tone="primary" variant="outline">
                Scaling Deck
              </Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Swipe or use side arrow controls with 3D scaling & opacity interpolation.
            </Text>

            <Box style={{ marginTop: 4 }}>
              <Carousel loop itemWidth={260}>
                <CarouselContent>
                  {deckFeatures.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <CarouselItem key={index}>
                        <Card
                          outlined
                          style={{
                            width: 250,
                            padding: 16,
                            borderRadius: 16,
                            backgroundColor: colors.surface,
                            gap: 12,
                          }}
                        >
                          <Box row center style={{ justifyContent: "space-between" }}>
                            <Box
                              center
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 12,
                                backgroundColor: colors.backgroundMuted,
                              }}
                            >
                              <IconComponent color={colors.primary} size={22} />
                            </Box>
                            <Badge tone={item.tone}>{item.badge}</Badge>
                          </Box>

                          <Box gap="xxs">
                            <Text weight="700" color="text">
                              {item.title}
                            </Text>
                            <Text color="textMuted" variant="bodySmall">
                              {item.subtitle}
                            </Text>
                          </Box>

                          <Button
                            size="xs"
                            variant="outline"
                            tone="primary"
                            rightIcon={({ color, size }) => (
                              <ArrowRight color={color} size={size} />
                            )}
                          >
                            Explore Feature
                          </Button>
                        </Card>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </Box>
          </Box>
        </Card>

        {/* Variant 2: Auto-Play Banner Slideshow */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Auto-Play Banner Carousel
              </Text>
              <Badge tone="success" variant="solid">
                AUTO PLAY (3s)
              </Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Auto-advancing infinite slideshow loop ideal for announcements.
            </Text>

            <Box style={{ marginTop: 4 }}>
              <Carousel autoPlay autoPlayInterval={3000} loop itemWidth={290}>
                <CarouselContent>
                  <CarouselItem>
                    <Box
                      style={{
                        width: 280,
                        padding: 18,
                        borderRadius: 16,
                        backgroundColor: isDark ? "#0A2540" : "#EBF5FF",
                        borderWidth: 1,
                        borderColor: colors.primary,
                        gap: 8,
                      }}
                    >
                      <Text weight="700" color="primary">
                        🎉 Version 2.4 Released
                      </Text>
                      <Text color="textMuted" variant="bodySmall">
                        Over 25+ new mobile UI components added to library.
                      </Text>
                    </Box>
                  </CarouselItem>

                  <CarouselItem>
                    <Box
                      style={{
                        width: 280,
                        padding: 18,
                        borderRadius: 16,
                        backgroundColor: isDark ? "#1E1B4B" : "#EEF2FF",
                        borderWidth: 1,
                        borderColor: colors.accent,
                        gap: 8,
                      }}
                    >
                      <Text weight="700" color="accent">
                        ⚡ Ultra Fast 120 FPS
                      </Text>

                      <Text color="textMuted" variant="bodySmall">
                        Reanimated UI thread animations with zero lag.
                      </Text>
                    </Box>
                  </CarouselItem>

                  <CarouselItem>
                    <Box
                      style={{
                        width: 280,
                        padding: 18,
                        borderRadius: 16,
                        backgroundColor: isDark ? "#064E3B" : "#ECFDF5",
                        borderWidth: 1,
                        borderColor: colors.success,
                        gap: 8,
                      }}
                    >
                      <Text weight="700" color="success">
                        🛡️ Safe Area Integrated
                      </Text>
                      <Text color="textMuted" variant="bodySmall">
                        Automatic safe inset detection for Android & iOS notch.
                      </Text>
                    </Box>
                  </CarouselItem>
                </CarouselContent>
              </Carousel>
            </Box>
          </Box>
        </Card>
      </Box>
    </Section>
  );
}
