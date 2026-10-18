import { useMediaQuery } from "hooks";
import { Flex, Section } from "layout";
import {
  Avatar,
  AvatarBlock,
  Button,
  ButtonDanger,
  ButtonGroup,
  Fieldset,
  InputField,
  Legend,
  Notification,
  SelectField,
  SelectItem,
  SwitchField,
  SwitchGroup,
  TextContentTitle,
  TextHeading,
} from "primitives";
import { useState } from "react";

type Role = "Owner" | "Admin" | "Editor" | "Viewer";
type Member = { id: string; name: string; email: string; role: Role };
type Settings = {
  name: string;
  email: string;
  jobTitle: string;
  productUpdates: boolean;
  weeklyDigest: boolean;
  members: Member[];
};

const ROLES: Role[] = ["Owner", "Admin", "Editor", "Viewer"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_SETTINGS: Settings = {
  name: "Avery Johnson",
  email: "avery@example.com",
  jobTitle: "Product Designer",
  productUpdates: true,
  weeklyDigest: false,
  members: [
    { id: "1", name: "Avery Johnson", email: "avery@example.com", role: "Owner" },
    { id: "2", name: "Jordan Lee", email: "jordan@example.com", role: "Admin" },
    { id: "3", name: "Sam Patel", email: "sam@example.com", role: "Editor" },
    { id: "4", name: "Riley Chen", email: "riley@example.com", role: "Viewer" },
  ],
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export function TeamSettings() {
  const { isMobile } = useMediaQuery();
  const [saved, setSaved] = useState<Settings>(INITIAL_SETTINGS);
  const [values, setValues] = useState<Settings>(INITIAL_SETTINGS);
  const [showSaved, setShowSaved] = useState(false);

  const emailError = EMAIL_PATTERN.test(values.email.trim())
    ? undefined
    : "Enter a valid email address, like name@example.com.";
  const nameError = values.name.trim() ? undefined : "Full name is required.";
  const isInvalid = Boolean(emailError || nameError);
  const isDirty = JSON.stringify(values) !== JSON.stringify(saved);

  const update = (patch: Partial<Settings>) => {
    setValues((current) => ({ ...current, ...patch }));
    setShowSaved(false);
  };
  const updateMember = (id: string, role: Role) =>
    update({
      members: values.members.map((m) => (m.id === id ? { ...m, role } : m)),
    });
  const removeMember = (id: string) =>
    update({ members: values.members.filter((m) => m.id !== id) });

  const onSave = () => {
    setSaved(values);
    setShowSaved(true);
  };
  const onCancel = () => {
    setValues(saved);
    setShowSaved(false);
  };

  const sectionGap = isMobile ? "600" : "800";

  return (
    <Section padding={isMobile ? "600" : "1600"} aria-labelledby="team-settings-title">
      <Flex container direction="column" alignSecondary="stretch" gap={sectionGap}>
        <TextContentTitle
          id="team-settings-title"
          title="Team settings"
          subtitle="Manage your profile, notifications and who has access to your team."
        />

        {isInvalid && (
          <Notification variant="alert" role="alert">
            Please fix the highlighted fields before saving.
          </Notification>
        )}
        {showSaved && (
          <Notification role="status">Your changes have been saved.</Notification>
        )}

        <Fieldset>
          <Legend>
            <TextHeading elementType="h2">Profile</TextHeading>
          </Legend>
          <InputField
            label="Full name"
            value={values.name}
            onChange={(name) => update({ name })}
            isRequired
            isInvalid={!!nameError}
            errorMessage={nameError}
            autoComplete="name"
          />
          <InputField
            label="Email"
            type="email"
            value={values.email}
            onChange={(email) => update({ email })}
            isRequired
            isInvalid={!!emailError}
            errorMessage={emailError}
            autoComplete="email"
          />
          <InputField
            label="Job title"
            description="Shown to teammates next to your name."
            value={values.jobTitle}
            onChange={(jobTitle) => update({ jobTitle })}
            autoComplete="organization-title"
          />
        </Fieldset>

        <Fieldset>
          <Legend>
            <TextHeading elementType="h2">Notifications</TextHeading>
          </Legend>
          <SwitchGroup>
            <SwitchField
              label="Product updates"
              description="News about new features and improvements."
              isSelected={values.productUpdates}
              onChange={(productUpdates) => update({ productUpdates })}
            />
            <SwitchField
              label="Weekly digest"
              description="A summary of your team's activity every Monday."
              isSelected={values.weeklyDigest}
              onChange={(weeklyDigest) => update({ weeklyDigest })}
            />
            <SwitchField
              label="Security alerts"
              description="Always on to keep your account safe."
              isSelected
              isDisabled
            />
          </SwitchGroup>
        </Fieldset>

        <Flex direction="column" alignSecondary="stretch" gap="400">
          <TextHeading elementType="h2">Team members</TextHeading>
          <Flex direction="column" alignSecondary="stretch" gap="600" role="list">
            {values.members.map((member) => {
              const isOwner = member.role === "Owner";
              return (
                <Flex
                  key={member.id}
                  role="listitem"
                  direction={isMobile ? "column" : "row"}
                  alignPrimary="space-between"
                  alignSecondary={isMobile ? "stretch" : "center"}
                  gap="400"
                >
                  <AvatarBlock title={member.name} description={member.email}>
                    <Avatar initials={initials(member.name)} />
                  </AvatarBlock>
                  <Flex direction="row" alignSecondary="center" gap="200">
                    <SelectField
                      aria-label={`Role for ${member.name}`}
                      selectedKey={member.role}
                      onSelectionChange={(key) => updateMember(member.id, key as Role)}
                      isDisabled={isOwner}
                    >
                      {ROLES.filter((role) => isOwner || role !== "Owner").map((role) => (
                        <SelectItem key={role} id={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectField>
                    <ButtonDanger
                      variant="danger-subtle"
                      size="small"
                      isDisabled={isOwner}
                      aria-label={`Remove ${member.name}`}
                      onPress={() => removeMember(member.id)}
                    >
                      Remove
                    </ButtonDanger>
                  </Flex>
                </Flex>
              );
            })}
          </Flex>
        </Flex>

        <ButtonGroup align={isMobile ? "stack" : "end"}>
          <Button variant="neutral" onPress={onCancel} isDisabled={!isDirty}>
            Cancel
          </Button>
          <Button variant="primary" onPress={onSave} isDisabled={!isDirty || isInvalid}>
            Save changes
          </Button>
        </ButtonGroup>
      </Flex>
    </Section>
  );
}
