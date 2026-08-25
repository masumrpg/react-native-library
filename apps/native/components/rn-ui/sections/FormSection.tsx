import {
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  DatePickerInput,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  RadioGroup,
  RadioGroupItem,
  RangeSlider,
  Rating,
  Select,
  SignaturePad,
  type SignaturePadRef,
  Slider,
  Switch,
  Text,
  Textarea,
  TimePickerInput,
} from "@masumdev/rn-ui";
import { Check, ChevronsUpDown, Globe, RotateCcw, Sparkles, Trash2 } from "lucide-react-native";
import { useRef, useState } from "react";
import { z } from "zod";
import { Section, type RnUiSectionContext } from "../shared";

// Zod Validation Schema covering all Form & Selection primitives
const formSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  website: z.string().min(3, "Please enter your portfolio or handle"),
  email: z.email("Please enter a valid email address"),
  gender: z.string().min(1, "Please select your gender"),
  dob: z
    .date({ message: "Please select your date of birth" })
    .optional()
    .refine((val) => val !== undefined, "Please select your date of birth"),
  meetingTime: z
    .date({ message: "Please select preferred meeting time" })
    .optional()
    .refine((val) => val !== undefined, "Please select preferred meeting time"),
  skills: z.array(z.string()).min(1, "Please select at least one skill tag"),
  experienceYears: z.number().min(1, "Experience must be at least 1 year"),
  budgetRange: z.tuple([z.number(), z.number()]),
  framework: z.string().min(1, "Please select a framework"),
  category: z.string().min(1, "Please pick a category"),
  securityPin: z.string().length(4, "Security PIN must be exactly 4 digits"),
  bio: z.string().min(10, "Bio must be at least 10 characters long"),
  rating: z.number().min(1, "Please provide a rating (1-5 stars)"),
  fastTrack: z.boolean(),
  hasSignature: z.boolean().refine((val) => val === true, "Please provide your digital signature"),
  acceptTerms: z.boolean().refine((val) => val === true, "You must accept terms & conditions"),
});

type FormData = {
  fullName: string;
  website: string;
  email: string;
  gender: string;
  dob?: Date;
  meetingTime?: Date;
  skills: string[];
  experienceYears: number;
  budgetRange: [number, number];
  framework: string;
  category: string;
  securityPin: string;
  bio: string;
  rating: number;
  fastTrack: boolean;
  hasSignature: boolean;
  acceptTerms: boolean;
};

export function FormSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { icon } = ctx;
  const signatureRef = useRef<SignaturePadRef>(null);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    website: "",
    email: "",
    gender: "",
    dob: undefined,
    meetingTime: undefined,
    skills: [],
    experienceYears: 0,
    budgetRange: [200, 800],
    framework: "",
    category: "",
    securityPin: "",
    bio: "",
    rating: 0,
    fastTrack: false,
    hasSignature: false,
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleValidate = () => {
    const isSigEmpty = signatureRef.current?.isEmpty() ?? true;
    const currentData: FormData = {
      ...formData,
      hasSignature: !isSigEmpty,
    };

    const result = formSchema.safeParse(currentData);
    if (!result.success) {
      const fieldErrors: Record<string, string | undefined> = {};
      for (const issue of result.error.issues) {
        const pathKey = String(issue.path[0]);
        if (!fieldErrors[pathKey]) {
          fieldErrors[pathKey] = issue.message;
        }
      }
      setErrors(fieldErrors);
      setSuccessMessage("");
    } else {
      setErrors({});
      setSuccessMessage("Form successfully validated with Zod! All 15 input primitives passed.");
    }
  };

  const availableSkills = ["React Native", "TypeScript", "Expo", "Reanimated", "GraphQL", "Tailwind"];

  const frameworks = [
    { value: "react-native", label: "React Native CLI" },
    { value: "expo", label: "Expo SDK 57" },
    { value: "masum", label: "@masumdev/rn-ui" },
  ];

  const categories = [
    { value: "mobile", label: "Mobile Development" },
    { value: "web", label: "Web Development" },
    { value: "design", label: "UI/UX Design Systems" },
  ];

  return (
    <Section title="Form & Zod Validation (15 Primitives)">
      <Card outlined>
        <Box gap="lg">
          <Text color="textMuted">
            Comprehensive showcase uniting all 15 Form & Selection Input primitives with unified Zod schema validation and error handling.
          </Text>

          {/* 1. Input (Text) */}
          <FormField error={errors.fullName} required>
            <FormLabel>1. Full Name (Input)</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. Ma'sum"
                value={formData.fullName}
                onChangeText={(val) => {
                  setFormData((prev) => ({ ...prev, fullName: val }));
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormField>

          {/* 2. InputGroup (Prefix Addon) */}
          <FormField error={errors.website} required>
            <FormLabel>2. Portfolio URL (InputGroup)</FormLabel>
            <FormControl>
              <InputGroup>
                <InputGroupAddon>
                  <Globe size={16} color="#94A3B8" />
                  <InputGroupText>https://</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="github.com/masumrpg"
                  value={formData.website}
                  onChangeText={(val) => {
                    setFormData((prev) => ({ ...prev, website: val }));
                    if (errors.website) setErrors((prev) => ({ ...prev, website: undefined }));
                  }}
                />
              </InputGroup>
            </FormControl>
            <FormDescription>Composite input with prefix protocol addon.</FormDescription>
            <FormMessage />
          </FormField>

          {/* 3. Input (Email) */}
          <FormField error={errors.email} required>
            <FormLabel>3. Email Address (Input)</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="masum@example.com"
                value={formData.email}
                onChangeText={(val) => {
                  setFormData((prev) => ({ ...prev, email: val }));
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormField>

          {/* 4. RadioGroup (Plain Variant) */}
          <FormField error={errors.gender} required>
            <FormLabel>4. Gender (RadioGroup - Plain)</FormLabel>
            <FormControl>
              <RadioGroup
                orientation="horizontal"
                variant="plain"
                value={formData.gender}
                onValueChange={(val) => {
                  setFormData((prev) => ({ ...prev, gender: val }));
                  if (errors.gender) setErrors((prev) => ({ ...prev, gender: undefined }));
                }}
                style={{ gap: 16 }}
              >
                <RadioGroupItem value="male" label="Male" />
                <RadioGroupItem value="female" label="Female" />
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormField>

          {/* 5. DatePickerInput (Wheel DatePicker) */}
          <FormField error={errors.dob} required>
            <FormLabel>5. Date of Birth (DatePickerInput)</FormLabel>
            <FormControl>
              <DatePickerInput
                title="SET BIRTHDAY"
                placeholder="Select date of birth"
                value={formData.dob}
                onChange={(selected) => {
                  setFormData((prev) => ({ ...prev, dob: selected }));
                  if (errors.dob) setErrors((prev) => ({ ...prev, dob: undefined }));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormField>

          {/* 6. TimePickerInput (TimePicker) */}
          <FormField error={errors.meetingTime} required>
            <FormLabel>6. Consultation Time (TimePickerInput)</FormLabel>
            <FormControl>
              <TimePickerInput
                title="SET MEETING TIME"
                placeholder="Select consultation time"
                value={formData.meetingTime}
                onChange={(selected) => {
                  setFormData((prev) => ({ ...prev, meetingTime: selected }));
                  if (errors.meetingTime) setErrors((prev) => ({ ...prev, meetingTime: undefined }));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormField>

          {/* 7. Chip Tags (Interactive Chips) */}
          <FormField error={errors.skills} required>
            <FormLabel>7. Technical Competencies (Chip)</FormLabel>
            <FormControl>
              <Box row style={{ flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                {availableSkills.map((skill) => {
                  const isSelected = formData.skills.includes(skill);
                  return (
                    <Chip
                      key={skill}
                      label={skill}
                      selected={isSelected}
                      variant="soft"
                      tone="primary"
                      onSelect={() => {
                        setFormData((prev) => {
                          const next = isSelected
                            ? prev.skills.filter((s) => s !== skill)
                            : [...prev.skills, skill];
                          return { ...prev, skills: next };
                        });
                        if (errors.skills) setErrors((prev) => ({ ...prev, skills: undefined }));
                      }}
                    />
                  );
                })}
              </Box>
            </FormControl>
            <FormMessage />
          </FormField>

          {/* 8. Slider (Single Thumb Experience) */}
          <FormField error={errors.experienceYears} required>
            <Box row center style={{ justifyContent: "space-between", width: "100%" }}>
              <FormLabel style={{ flex: 1, marginRight: 8 }}>8. Experience Level (Slider)</FormLabel>
              <Badge tone="primary" size="sm" style={{ flexShrink: 0 }}>
                {`${formData.experienceYears} Years`}
              </Badge>
            </Box>
            <FormControl>
              <Slider
                min={0}
                max={15}
                step={1}
                value={formData.experienceYears}
                onValueChange={(val) => {
                  setFormData((prev) => ({ ...prev, experienceYears: val }));
                  if (errors.experienceYears) setErrors((prev) => ({ ...prev, experienceYears: undefined }));
                }}
                tone="primary"
              />
            </FormControl>
            <FormMessage />
          </FormField>

          {/* 9. RangeSlider (Dual Thumbs Budget) */}
          <FormField error={errors.budgetRange} required>
            <Box row center style={{ justifyContent: "space-between", width: "100%" }}>
              <FormLabel style={{ flex: 1, marginRight: 8 }}>9. Budget Range (RangeSlider)</FormLabel>
              <Badge tone="primary" size="sm" style={{ flexShrink: 0 }}>
                {`$${formData.budgetRange[0]} - $${formData.budgetRange[1]}`}
              </Badge>
            </Box>
            <FormControl>
              <RangeSlider
                min={100}
                max={1500}
                step={25}
                value={formData.budgetRange}
                onValueChange={(val) => {
                  setFormData((prev) => ({ ...prev, budgetRange: val }));
                  if (errors.budgetRange) setErrors((prev) => ({ ...prev, budgetRange: undefined }));
                }}
                tone="primary"
              />
            </FormControl>
            <FormMessage />
          </FormField>

          {/* 10. Select Dropdown */}
          <FormField error={errors.framework} required>
            <FormLabel>10. Primary Framework (Select)</FormLabel>
            <FormControl>
              <Select
                value={formData.framework}
                onValueChange={(val) => {
                  setFormData((prev) => ({ ...prev, framework: val }));
                  if (errors.framework) setErrors((prev) => ({ ...prev, framework: undefined }));
                }}
                placeholder="Select framework"
                options={frameworks}
                checkIcon={icon(Check)}
                chevronIcon={icon(ChevronsUpDown)}
              />
            </FormControl>
            <FormMessage />
          </FormField>

          {/* 11. Combobox Autocomplete */}
          <FormField error={errors.category} required>
            <FormLabel>11. Project Category (Combobox)</FormLabel>
            <FormControl>
              <Combobox
                value={formData.category}
                onValueChange={(val) => {
                  setFormData((prev) => ({ ...prev, category: val }));
                  if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
                }}
              >
                <ComboboxInput
                  placeholder="Type to search category..."
                  chevronIcon={icon(ChevronsUpDown)}
                />
                <ComboboxContent>
                  <ComboboxList>
                    {categories.map((item) => (
                      <ComboboxItem
                        key={item.value}
                        value={item.value}
                        label={item.label}
                        checkIcon={icon(Check)}
                      />
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </FormControl>
            <FormMessage />
          </FormField>

          {/* 12. InputOTP (PIN code) */}
          <FormField error={errors.securityPin} required>
            <FormLabel>12. 4-Digit Security PIN (InputOTP)</FormLabel>
            <FormControl>
              <Box center style={{ width: "100%", paddingVertical: 4 }}>
                <InputOTP
                  value={formData.securityPin}
                  onChangeText={(val) => {
                    setFormData((prev) => ({ ...prev, securityPin: val }));
                    if (errors.securityPin) setErrors((prev) => ({ ...prev, securityPin: undefined }));
                  }}
                  maxLength={4}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSeparator />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </Box>
            </FormControl>
            <FormMessage />
          </FormField>

          {/* 13. Textarea (Multiline Bio) */}
          <FormField error={errors.bio} required>
            <FormLabel>13. Experience Summary (Textarea)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your technical background..."
                value={formData.bio}
                onChangeText={(val) => {
                  setFormData((prev) => ({ ...prev, bio: val }));
                  if (errors.bio) setErrors((prev) => ({ ...prev, bio: undefined }));
                }}
                numberOfLines={3}
              />
            </FormControl>
            <FormMessage />
          </FormField>

          {/* 14. Rating (Star control) */}
          <FormField error={errors.rating} required>
            <FormLabel>14. Self-Assessment (Rating)</FormLabel>
            <FormControl>
              <Rating
                value={formData.rating}
                onValueChange={(val) => {
                  setFormData((prev) => ({ ...prev, rating: val }));
                  if (errors.rating) setErrors((prev) => ({ ...prev, rating: undefined }));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormField>

          {/* 15. Switch (Toggle) */}
          <FormField>
            <FormControl>
              <Box row center style={{ justifyContent: "space-between", width: "100%", paddingVertical: 4 }}>
                <Box gap="xs" style={{ flex: 1, paddingRight: 12 }}>
                  <FormLabel>15. Fast-Track Priority (Switch)</FormLabel>
                  <FormDescription>Enable express turnaround delivery.</FormDescription>
                </Box>
                <Switch
                  variant="oval"
                  value={formData.fastTrack}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, fastTrack: val }))}
                />
              </Box>
            </FormControl>
          </FormField>

          {/* 16. Digital Signature (SignaturePad) */}
          <FormField error={errors.hasSignature} required>
            <Box row center style={{ justifyContent: "space-between", width: "100%", marginBottom: 6 }}>
              <FormLabel style={{ flex: 1, marginRight: 8 }}>16. Digital Signature (SignaturePad)</FormLabel>
              <Box row style={{ gap: 6, flexShrink: 0 }}>
                <Button
                  size="xs"
                  variant="outline"
                  leftIcon={icon(RotateCcw)}
                  onPress={() => signatureRef.current?.undo()}
                >
                  Undo
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  tone="danger"
                  leftIcon={icon(Trash2)}
                  onPress={() => {
                    signatureRef.current?.clear();
                    setFormData((prev) => ({ ...prev, hasSignature: false }));
                  }}
                >
                  Clear
                </Button>
              </Box>
            </Box>
            <FormControl>
              <SignaturePad
                ref={signatureRef}
                height={230}
                strokeWidth={3}
                strokeColor="#6366F1"
                backgroundColor="rgba(99, 102, 241, 0.05)"
                onChange={() => {
                  if (errors.hasSignature) setErrors((prev) => ({ ...prev, hasSignature: undefined }));
                }}
              />
            </FormControl>
            <FormDescription>Sign your authorization on canvas above.</FormDescription>
            <FormMessage />
          </FormField>

          {/* 17. Checkbox (Terms agreement) */}
          <FormField error={errors.acceptTerms} required>
            <FormControl>
              <Box row style={{ alignItems: "center", gap: 10, width: "100%" }}>
                <Checkbox
                  checked={formData.acceptTerms}
                  onCheckedChange={(val) => {
                    setFormData((prev) => ({ ...prev, acceptTerms: val }));
                    if (errors.acceptTerms) setErrors((prev) => ({ ...prev, acceptTerms: undefined }));
                  }}
                />
                <Text variant="bodySmall" style={{ flex: 1 }}>
                  17. I accept terms, policies, and conditions (Checkbox)
                </Text>
              </Box>
            </FormControl>
            <FormMessage />
          </FormField>

          {successMessage ? (
            <Box
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.12)",
                padding: 12,
                borderRadius: 8,
              }}
            >
              <Text color="success" weight="600">
                {successMessage}
              </Text>
            </Box>
          ) : null}

          {/* Submit Button */}
          <Button
            variant="filled"
            tone="primary"
            leftIcon={icon(Sparkles)}
            onPress={handleValidate}
          >
            Submit & Validate All Primitives with Zod
          </Button>
        </Box>
      </Card>
    </Section>
  );
}
