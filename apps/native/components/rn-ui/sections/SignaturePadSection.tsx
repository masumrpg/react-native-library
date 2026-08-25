import {
  Badge,
  Box,
  Button,
  Card,
  SignaturePad,
  type SignaturePadRef,
  Text,
} from "@masumdev/rn-ui";
import { RotateCcw, Trash2, CheckCircle2 } from "lucide-react-native";
import { useRef, useState } from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function SignaturePadSection(_props?: { ctx?: RnUiSectionContext }) {
  const padRef = useRef<SignaturePadRef>(null);
  const [strokeCount, setStrokeCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const handleClear = () => {
    padRef.current?.clear();
    setStrokeCount(0);
    setIsSaved(false);
  };

  const handleUndo = () => {
    padRef.current?.undo();
    setIsSaved(false);
  };

  const handleSave = () => {
    if (padRef.current?.isEmpty()) return;
    setIsSaved(true);
  };

  return (
    <Section title="SignaturePad">
      <Box gap="lg">
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Digital Signature Canvas
              </Text>
              <Badge tone="primary">Bezier Curves</Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Smooth responsive touch drawing with undo, clear, stroke width adjustments, and SVG export.
            </Text>

            {/* Signature Canvas Pad */}
            <SignaturePad
              ref={padRef}
              height={220}
              strokeWidth={3.5}
              guideLineText="Sign Above This Line"
              onChange={(paths) => {
                setStrokeCount(paths.length);
                setIsSaved(false);
              }}
            />

            {/* Actions: Undo, Clear, Save */}
            <Box row gap="sm" style={{ marginTop: 4 }}>
              <Button
                variant="outline"
                tone="secondary"
                size="sm"
                onPress={handleUndo}
                style={{ flex: 1 }}
              >
                <RotateCcw size={15} color="#94a3b8" />
                <Text style={{ marginLeft: 6 }}>Undo</Text>
              </Button>

              <Button
                variant="outline"
                tone="danger"
                size="sm"
                onPress={handleClear}
                style={{ flex: 1 }}
              >
                <Trash2 size={15} color="#ef4444" />
                <Text style={{ marginLeft: 6 }}>Clear</Text>
              </Button>

              <Button
                variant="filled"
                tone="primary"
                size="sm"
                onPress={handleSave}
                style={{ flex: 1 }}
              >
                Save
              </Button>
            </Box>

            {/* Saved Confirmation */}
            {isSaved && (
              <Box
                row
                center
                gap="xs"
                style={{
                  padding: 10,
                  borderRadius: 8,
                  backgroundColor: "rgba(16, 185, 129, 0.12)",
                }}
              >
                <CheckCircle2 size={16} color="#10b981" />
                <Text style={{ fontSize: 13, color: "#10b981", fontWeight: "600" }}>
                  Signature captured ({strokeCount} strokes)!
                </Text>
              </Box>
            )}
          </Box>
        </Card>
      </Box>
    </Section>
  );
}
