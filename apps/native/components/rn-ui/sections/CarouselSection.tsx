import {
  Box,
  Card,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Text,
} from "@masumdev/rn-ui";
import { Section, type RnUiSectionContext } from "../shared";

export function CarouselSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { colors } = ctx;

  return (
    <Section title="Carousel">
      <Card outlined>
        <Box gap="lg">
          <Text color="textMuted">
            A horizontal deck-style slideshow with dramatic card scaling,
            opacity transitions, active dot pagination, and optional side arrow
            triggers.
          </Text>

          <Box
            style={{
              height: 180,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Carousel>
              <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem key={index}>
                    <Card
                      outlined
                      style={{
                        width: 240,
                        height: 130,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: colors.surface,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 28,
                          fontWeight: "700",
                          color: colors.primary,
                        }}
                      >
                        Slide {index + 1}
                      </Text>
                      <Text
                        variant="bodySmall"
                        color="textSubtle"
                        style={{ marginTop: 4 }}
                      >
                        Swipe or press arrows to navigate
                      </Text>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
