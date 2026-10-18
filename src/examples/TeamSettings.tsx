import { useMediaQuery } from "hooks";
import { IconAlertCircle, IconCheckCircle, IconTrash2 } from "icons";
import { Flex, FlexItem, Section } from "layout";
import {
  Avatar,
  AvatarBlock,
  Button,
  ButtonGroup,
  Form,
  IconButton,
  InputField,
  Notification,
  SelectField,
  SelectItem,
  SwitchField,
  SwitchGroup,
  Text,
  TextHeading,
  TextStrong,
  TextSubtitle,
  TextTitlePage,
} from "primitives";
import { useState } from "react";
import "./teamSettings.css";

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
  name: "Avery Chen",
  email: "avery@example.com",
  jobTitle: "Product designer",
  productUpdates: true,
  weeklyDigest: false,
  members: [
    { id: "1", name: "Avery Chen", email: "avery@example.com", role: "Owner" },
    { id: "2", name: "Jordan Lee", email: "jordan@example.com", role: "Admin" },
    { id: "3", name: "Sam Patel", email: "sam@example.com", role: "Editor" },
    { id: "4", name: "Riley Kim", email: "riley@example.com", role: "Viewer" },
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
  const [draft, setDraft] = useState<Settings>(INITIAL_SETTINGS);
  const [showSaved, setShowSaved] = useState(false);

  const update = (patch: Partial<Settings>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setShowSaved(false);
  };
  const updateMember = (id: string, role: Role) =>
    update({
      members: draft.members.map((m) => (m.id === id ? { ...m, role } : m)),
    });
  const removeMember = (id: string) =>
    update({ members: draft.members.filter((m) => m.id !== id) });

  const nameError = draft.name.trim() ? undefined : "Enter your full name.";
  const emailError = EMAIL_PATTERN.test(draft.email.trim())
    ? undefined
    : "Enter a valid email address, like name@example.com.";
  const isInvalid = Boolean(nameError || emailError);
  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const handleSave = () => {
    if (isInvalid || !isDirty) return;
    setSaved(draft);
    setShowSaved(true);
  };
  const handleCancel = () => {
    setDraft(saved);
    setShowSaved(false);
  };

  return (
    <Section padding={isMobile ? "600" : "1600"} variant="neutral">
      <Flex container direction="column" alignSecondary="stretch">
        <Form
          aria-labelledby="team-settings-title"
          validationBehavior="aria"
          onSubmit={(event) => {
            event.preventDefault();
            handleSave();
          }}
        >
          <Flex direction="column" alignSecondary="stretch" gap="1200">
            <Flex direction="column" gap="200">
              <TextTitlePage elementType="h1" id="team-settings-title">
                Team settings
              </TextTitlePage>
              <TextSubtitle>
                Manage your profile, notifications and who has access to your
                team.
              </TextSubtitle>
            </Flex>

            {isInvalid && (
              <Notification
                variant="alert"
                role="alert"
                icon={<IconAlertCircle size="20" />}
              >
                <TextStrong>Please fix the errors below</TextStrong>
                <Text>Your changes can't be saved until every field is valid.</Text>
              </Notification>
            )}
            {showSaved && (
              <Notification role="status" icon={<IconCheckCircle size="20" />}>
                <TextStrong>Changes saved</TextStrong>
                <Text>Your team settings have been updated.</Text>
              </Notification>
            )}

            <Flex direction="column" alignSecondary="stretch" gap="600">
              <TextHeading elementType="h2">Profile</TextHeading>
              <InputField
                label="Full name"
                autoComplete="name"
                isRequired
                value={draft.name}
                onChange={(name) => update({ name })}
                isInvalid={Boolean(nameError)}
                errorMessage={nameError}
              />
              <InputField
                label="Email"
                type="email"
                autoComplete="email"
                isRequired
                value={draft.email}
                onChange={(email) => update({ email })}
                isInvalid={Boolean(emailError)}
                errorMessage={emailError}
              />
              <InputField
                label="Job title"
                autoComplete="organization-title"
                description="Shown to teammates next to your name."
                value={draft.jobTitle}
                onChange={(jobTitle) => update({ jobTitle })}
              />
            </Flex>

            <Flex direction="column" alignSecondary="stretch" gap="600">
              <TextHeading elementType="h2">Notifications</TextHeading>
              <SwitchGroup>
                <SwitchField
                  label="Product updates"
                  description="News about new features and improvements."
                  isSelected={draft.productUpdates}
                  onChange={(productUpdates) => update({ productUpdates })}
                />
                <SwitchField
                  label="Weekly digest"
                  description="A summary of your team's activity every Monday."
                  isSelected={draft.weeklyDigest}
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

            <Flex direction="column" alignSecondary="stretch" gap="600">
              <TextHeading elementType="h2">Team members</TextHeading>
              <Flex direction="column" alignSecondary="stretch" gap="400" role="list">
                {draft.members.map((member) => {
                  const isOwner = member.role === "Owner";
                  return (
                    <Flex
                      key={member.id}
                      role="listitem"
                      className="team-settings-member"
                      direction={isMobile ? "column" : "row"}
                      alignPrimary="space-between"
                      alignSecondary={isMobile ? "stretch" : "center"}
                      gap="400"
                    >
                      <FlexItem size="fill">
                        <AvatarBlock title={member.name} description={member.email}>
                          <Avatar initials={initials(member.name)} />
                        </AvatarBlock>
                      </FlexItem>
                      <Flex alignSecondary="end" gap="200">
                        <SelectField
                          className="team-settings-role"
                          aria-label={`Role for ${member.name}`}
                          selectedKey={member.role}
                          isDisabled={isOwner}
                          onSelectionChange={(key) =>
                            updateMember(member.id, key as Role)
                          }
                        >
                          {ROLES.filter((r) => isOwner || r !== "Owner").map(
                            (role) => (
                              <SelectItem key={role} id={role}>
                                {role}
                              </SelectItem>
                            ),
                          )}
                        </SelectField>
                        <IconButton
                          variant="subtle"
                          aria-label={`Remove ${member.name}`}
                          isDisabled={isOwner}
                          onPress={() => removeMember(member.id)}
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
              <Button type="button" variant="neutral" onPress={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" isDisabled={!isDirty || isInvalid}>
                Save changes
              </Button>
            </ButtonGroup>
          </Flex>
        </Form>
      </Flex>
    </Section>
  );
}
