import { FormBox } from "compositions";
import { useMediaQuery } from "hooks";
import { IconAlertCircle, IconCheckCircle } from "icons";
import { Flex, Section } from "layout";
import {
  Avatar,
  AvatarBlock,
  Button,
  ButtonDanger,
  ButtonGroup,
  InputField,
  Notification,
  SelectField,
  SelectItem,
  SwitchField,
  SwitchGroup,
  TextHeading,
  TextSubtitle,
  TextTitlePage,
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
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  jobTitle: "Product Designer",
  productUpdates: true,
  weeklyDigest: false,
  members: [
    { id: "1", name: "Alex Morgan", email: "alex.morgan@example.com", role: "Owner" },
    { id: "2", name: "Jordan Lee", email: "jordan.lee@example.com", role: "Admin" },
    { id: "3", name: "Priya Shah", email: "priya.shah@example.com", role: "Editor" },
    { id: "4", name: "Sam Rivera", email: "sam.rivera@example.com", role: "Viewer" },
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

  const update = (patch: Partial<Settings>) => {
    setValues((current) => ({ ...current, ...patch }));
    setShowSaved(false);
  };
  const updateMembers = (fn: (members: Member[]) => Member[]) =>
    update({ members: fn(values.members) });

  const nameError = values.name.trim() ? undefined : "Enter your full name.";
  const emailError = EMAIL_PATTERN.test(values.email.trim())
    ? undefined
    : "Enter a valid email address, like name@example.com.";
  const isInvalid = Boolean(nameError || emailError);
  const isDirty = JSON.stringify(values) !== JSON.stringify(saved);

  const handleSave = () => {
    if (isInvalid || !isDirty) return;
    setSaved(values);
    setShowSaved(true);
  };
  const handleCancel = () => {
    setValues(saved);
    setShowSaved(false);
  };

  return (
    <Section padding={isMobile ? "600" : "1600"} variant="subtle">
      <Flex container direction="column" alignSecondary="stretch" gap={isMobile ? "600" : "800"}>
        <Flex direction="column" gap="200">
          <TextTitlePage elementType="h1">Team settings</TextTitlePage>
          <TextSubtitle>Manage your profile, notifications and who has access to your team.</TextSubtitle>
        </Flex>

        {isInvalid && (
          <Notification variant="alert" role="alert" icon={<IconAlertCircle />}>
            Please fix the highlighted fields before saving.
          </Notification>
        )}
        {showSaved && !isDirty && (
          <Notification role="status" icon={<IconCheckCircle />}>
            Your changes have been saved.
          </Notification>
        )}

        <FormBox
          aria-label="Team settings"
          validationBehavior="aria"
          onSubmit={(event) => {
            event.preventDefault();
            handleSave();
          }}
        >
          <Flex direction="column" alignSecondary="stretch" gap="400">
            <TextHeading elementType="h2">Profile</TextHeading>
            <InputField
              label="Full name"
              name="name"
              autoComplete="name"
              isRequired
              value={values.name}
              onChange={(name) => update({ name })}
              isInvalid={Boolean(nameError)}
              errorMessage={nameError}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              isRequired
              value={values.email}
              onChange={(email) => update({ email })}
              isInvalid={Boolean(emailError)}
              errorMessage={emailError}
            />
            <InputField
              label="Job title"
              name="jobTitle"
              autoComplete="organization-title"
              description="Shown to teammates next to your name."
              value={values.jobTitle}
              onChange={(jobTitle) => update({ jobTitle })}
            />
          </Flex>

          <Flex direction="column" alignSecondary="stretch" gap="400">
            <TextHeading elementType="h2">Notifications</TextHeading>
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
                isReadOnly
                isDisabled
              />
            </SwitchGroup>
          </Flex>

          <Flex direction="column" alignSecondary="stretch" gap="400">
            <TextHeading elementType="h2">Team members</TextHeading>
            {values.members.map((member) => {
              const isOwner = member.role === "Owner";
              return (
                <Flex
                  key={member.id}
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
                      isDisabled={isOwner}
                      disabledKeys={isOwner ? [] : ["Owner"]}
                      onSelectionChange={(key) =>
                        updateMembers((members) =>
                          members.map((m) => (m.id === member.id ? { ...m, role: key as Role } : m)),
                        )
                      }
                    >
                      {ROLES.map((role) => (
                        <SelectItem key={role} id={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectField>
                    <ButtonDanger
                      variant="danger-subtle"
                      size="small"
                      aria-label={`Remove ${member.name}`}
                      isDisabled={isOwner}
                      onPress={() => updateMembers((members) => members.filter((m) => m.id !== member.id))}
                    >
                      Remove
                    </ButtonDanger>
                  </Flex>
                </Flex>
              );
            })}
          </Flex>

          <ButtonGroup align={isMobile ? "stack" : "end"}>
            <Button variant="neutral" onPress={handleCancel} isDisabled={!isDirty}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isDisabled={!isDirty || isInvalid}>
              Save changes
            </Button>
          </ButtonGroup>
        </FormBox>
      </Flex>
    </Section>
  );
}
