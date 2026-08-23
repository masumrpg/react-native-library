import {
  Box,
  Button,
  Card,
  Checkbox,
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  Input,
  Rating,
  Select,
  Text,
  Textarea,
} from "@masumdev/rn-ui";
import { Check, ChevronsUpDown, Sparkles } from "lucide-react-native";
import React from "react";
import { z } from "zod";
import { Section, type RnUiSectionContext } from "../shared";

// Zod Validation Schema
const formSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  framework: z.string().min(1, "Please select a framework"),
  category: z.string().min(1, "Please pick a category"),
  bio: z.string().min(10, "Bio must be at least 10 characters long"),
  rating: z.number().min(1, "Please provide a rating (1-5 stars)"),
  acceptTerms: z.boolean().refine((val) => val === true, "You must accept terms & conditions"),
});

type FormErrors = Partial<Record<keyof z.infer<typeof formSchema>, string>>;

export function FormSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { icon } = ctx;

  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    framework: "",
    category: "",
    bio: "",
    rating: 0,
    acceptTerms: false,
  });

  const [errors, setErrors] = React.useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = React.useState("");

  const handleValidate = () => {
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const formatted = result.error.format();
      setErrors({
        fullName: formatted.fullName?._errors[0],
        email: formatted.email?._errors[0],
        framework: formatted.framework?._errors[0],
        category: formatted.category?._errors[0],
        bio: formatted.bio?._errors[0],
        rating: formatted.rating?._errors[0],
        acceptTerms: formatted.acceptTerms?._errors[0],
      });
      setSuccessMessage("");
    } else {
      setErrors({});
      setSuccessMessage("Form successfully validated with Zod! 🎉");
    }
  };

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
    <Section title="Form & Zod Validation">
      <Card outlined>
        <Box gap="lg">
          <Text color="textMuted">
            Ultra-convenient FormField error handling with Zod validation. Pass error string directly to FormField and self-resolving FormMessage handles the rest.
          </Text>

          {/* 1. Full Name (Text Input) */}
          <FormField error={errors.fullName} required>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your full name"
                value={formData.fullName}
                onChangeText={(val) => {
                  setFormData((prev) => ({ ...prev, fullName: val }));
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormField>

          {/* 2. Email Address (Email Input) */}
          <FormField error={errors.email} required>
            <FormLabel>Email Address</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChangeText={(val) => {
                  setFormData((prev) => ({ ...prev, email: val }));
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
              />
            </FormControl>
            <FormDescription>Used for account authentication.</FormDescription>
            <FormMessage />
          </FormField>

          {/* 3. Framework (Select Dropdown) */}
          <FormField error={errors.framework} required>
            <FormLabel>Preferred Framework</FormLabel>
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

          {/* 4. Category (Combobox Autocomplete) */}
          <FormField error={errors.category} required>
            <FormLabel>Project Category</FormLabel>
            <FormControl>
              <Combobox
                value={formData.category}
                onValueChange={(val) => {
                  setFormData((prev) => ({ ...prev, category: val }));
                  if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
                }}
              >
                <ComboboxInput
                  placeholder="Type to filter categories..."
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

          {/* 5. Bio (Textarea) */}
          <FormField error={errors.bio} required>
            <FormLabel>Short Bio</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell us a little about your experience..."
                value={formData.bio}
                onChangeText={(val) => {
                  setFormData((prev) => ({ ...prev, bio: val }));
                  if (errors.bio) setErrors((prev) => ({ ...prev, bio: undefined }));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormField>

          {/* 6. Rating */}
          <FormField error={errors.rating} required>
            <FormLabel>Experience Rating</FormLabel>
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

          {/* 7. Terms & Conditions (Checkbox) */}
          <FormField error={errors.acceptTerms} required>
            <FormControl>
              <Box row style={{ alignItems: "center", gap: 10 }}>
                <Checkbox
                  checked={formData.acceptTerms}
                  onCheckedChange={(val) => {
                    setFormData((prev) => ({ ...prev, acceptTerms: val }));
                    if (errors.acceptTerms) setErrors((prev) => ({ ...prev, acceptTerms: undefined }));
                  }}
                />
                <Text variant="bodySmall">I accept terms and conditions</Text>
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
            Submit & Validate with Zod
          </Button>
        </Box>
      </Card>
    </Section>
  );
}
