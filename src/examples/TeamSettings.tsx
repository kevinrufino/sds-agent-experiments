import { useMediaQuery } from "hooks";
import { IconAlertCircle, IconCheckCircle, IconTrash2 } from "icons";
import { Flex, Section } from "layout";
import {
  Avatar,
  AvatarBlock,
  Button,
  ButtonGroup,
  IconButton,
  InputField,
  Notification,
  SelectField,
  SelectItem,
  SwitchField,
  SwitchGroup,
  Text,
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
  name: "Avery Johnson",
  email: "avery@example.com",
  jobTitle: "Product Manager",
  productUpdates: true,
  weeklyDigest: false,
  members: [
    { id: "1", name: "Avery Johnson", email: "avery@example.com", role: "Owner" },
    { id: "2", name: "Jordan Lee", email: "jordan@example.com", role: "Admin" },
    { id: "3", name: "Sam Rivera", email: "sam@example.com", role: "Editor" },
    { id: "4", name: "Taylor Kim", email: "taylor@example.com", role: "Viewer" },
  ],
};

const initialsOf = (name: string) =>
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
    setSaved(values);
    setShowSaved(true);
  };
  const handleCancel = () => {
    setValues(saved);
    setShowSaved(false);
  };

  return (
    <Section padding={isMobile ? "600" : "1600"} aria-labelledby="team-settings-title">
      <Flex container direction="column" alignSecondary="stretch" gap={isMobile ? "600" : "800"}>
        <Flex direction="column" gap="200">
          <TextTitlePage elementType="h1" id="team-settings-title">
            Team settings
          </TextTitlePage>
          <TextSubtitle>Manage your profile, notifications and who has access to your team.</TextSubtitle>
        </Flex>

        <div aria-live="polite">
          {isInvalid && (
            <Notification variant="alert" icon={<IconAlertCircle />}>
              <Text>Please fix the highlighted fields before saving.</Text>
            </Notification>
          )}
          {showSaved && !isDirty && (
            <Notification icon={<IconCheckCircle />}>
              <Text>Your changes have been saved.</Text>
            </Notification>
          )}
        </div>

        <Flex direction="column" gap="400" alignSecondary="stretch">
          <TextHeading elementType="h2">Profile</TextHeading>
          <InputField
            label="Full name"
            autoComplete="name"
            isRequired
            value={values.name}
            onChange={(name) => update({ name })}
            isInvalid={Boolean(nameError)}
            errorMessage={nameError}
          />
          <InputField
            label="Email"
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
            autoComplete="organization-title"
            description="Shown to teammates next to your name."
            value={values.jobTitle}
            onChange={(jobTitle) => update({ jobTitle })}
          />
        </Flex>

        <Flex direction="column" gap="400" alignSecondary="stretch">
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
              isDisabled
            />
          </SwitchGroup>
        </Flex>

        <Flex direction="column" gap="400" alignSecondary="stretch">
          <TextHeading elementType="h2">Team members</TextHeading>
          <Flex role="list" aria-label="Team members" direction="column" gap="400" alignSecondary="stretch">
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
                        <Avatar initials={initialsOf(member.name)} />
                      </AvatarBlock>
                      <Flex direction="row" gap="200" alignSecondary="end">
                        <SelectField
                          aria-label={`Role for ${member.name}`}
                          selectedKey={member.role}
                          isDisabled={isOwner}
                          disabledKeys={isOwner ? [] : ["Owner"]}
                          onSelectionChange={(key) =>
                            key &&
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
                        <IconButton
                          variant="subtle"
                          aria-label={isOwner ? `${member.name} is the owner and cannot be removed` : `Remove ${member.name}`}
                          isDisabled={isOwner}
                          onPress={() => updateMembers((members) => members.filter((m) => m.id !== member.id))}
                        >
                          <IconTrash2 />
                        </IconButton>
                      </Flex>
                    </Flex>
                );
              })}
          </Flex>
        </Flex>

        <ButtonGroup align={isMobile ? "stack" : "end"}>
          <Button variant="neutral" onPress={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onPress={handleSave} isDisabled={!isDirty || isInvalid}>
            Save changes
          </Button>
        </ButtonGroup>
      </Flex>
    </Section>
  );
}
