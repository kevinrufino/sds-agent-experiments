import { useMediaQuery } from "hooks";
import { IconCheckCircle, IconInfo } from "icons";
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
  Text,
  TextContentTitle,
  TextHeading,
  TextStrong,
} from "primitives";
import { useState } from "react";
import "./team-settings.css";

type Role = "Owner" | "Admin" | "Editor" | "Viewer";
type Member = { id: string; name: string; email: string; role: Role };
type Settings = {
  fullName: string;
  email: string;
  jobTitle: string;
  productUpdates: boolean;
  weeklyDigest: boolean;
  members: Member[];
};

const ROLES: Role[] = ["Owner", "Admin", "Editor", "Viewer"];

const INITIAL_SETTINGS: Settings = {
  fullName: "Ada Lovelace",
  email: "ada@example.com",
  jobTitle: "",
  productUpdates: true,
  weeklyDigest: false,
  members: [
    { id: "ada", name: "Ada Lovelace", email: "ada@example.com", role: "Owner" },
    { id: "grace", name: "Grace Hopper", email: "grace@example.com", role: "Admin" },
    { id: "alan", name: "Alan Turing", email: "alan@example.com", role: "Viewer" },
  ],
};

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export function TeamSettings() {
  const { isMobile } = useMediaQuery();
  const [saved, setSaved] = useState<Settings>(INITIAL_SETTINGS);
  const [draft, setDraft] = useState<Settings>(INITIAL_SETTINGS);
  const [showSaved, setShowSaved] = useState(false);

  const emailInvalid = !isValidEmail(draft.email);
  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const update = (patch: Partial<Settings>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setShowSaved(false);
  };
  const setRole = (id: string, role: Role) =>
    update({
      members: draft.members.map((m) => (m.id === id ? { ...m, role } : m)),
    });
  const removeMember = (id: string) =>
    update({ members: draft.members.filter((m) => m.id !== id) });

  const handleSave = () => {
    setSaved(draft);
    setShowSaved(true);
  };
  const handleCancel = () => {
    setDraft(saved);
    setShowSaved(false);
  };

  return (
    <Section padding={isMobile ? "600" : "1600"} variant="subtle">
      <form
        className="team-settings"
        aria-labelledby="team-settings-title"
        onSubmit={(e) => {
          e.preventDefault();
          if (isDirty && !emailInvalid) handleSave();
        }}
      >
        <Flex container direction="column" alignSecondary="stretch" gap={isMobile ? "600" : "1200"}>
          <TextContentTitle
            id="team-settings-title"
            title="Team settings"
            subtitle="Manage your profile, notifications, and team members."
          />

          {emailInvalid && (
            <Notification variant="alert" icon={<IconInfo size="20" />} role="alert">
              <TextStrong>1 field needs attention</TextStrong>
              <Text>Fix the highlighted email address before saving.</Text>
            </Notification>
          )}
          {showSaved && (
            <Notification icon={<IconCheckCircle size="20" />} role="status">
              <TextStrong>Changes saved</TextStrong>
              <Text>Your team settings have been updated.</Text>
            </Notification>
          )}

          <Flex direction="column" alignSecondary="stretch" gap="600" role="region" aria-labelledby="ts-profile">
            <TextHeading elementType="h2" id="ts-profile">Profile</TextHeading>
            <InputField
              label="Full name"
              value={draft.fullName}
              onChange={(fullName) => update({ fullName })}
            />
            <InputField
              label="Email"
              type="email"
              value={draft.email}
              onChange={(email) => update({ email })}
              isInvalid={emailInvalid}
              errorMessage="Enter a valid email address."
            />
            <InputField
              label="Job title"
              placeholder="e.g. Engineering manager"
              description="Shown to teammates on your profile."
              value={draft.jobTitle}
              onChange={(jobTitle) => update({ jobTitle })}
            />
          </Flex>

          <Flex direction="column" alignSecondary="stretch" gap="600" role="region" aria-labelledby="ts-notifications">
            <TextHeading elementType="h2" id="ts-notifications">Notifications</TextHeading>
            <SwitchGroup>
              <SwitchField
                label="Product updates"
                description="News about features and improvements."
                isSelected={draft.productUpdates}
                onChange={(productUpdates) => update({ productUpdates })}
              />
              <SwitchField
                label="Weekly digest"
                description="A summary of team activity every Monday."
                isSelected={draft.weeklyDigest}
                onChange={(weeklyDigest) => update({ weeklyDigest })}
              />
              <SwitchField
                label="Security alerts"
                description="Always on for workspace admins."
                isSelected
                isDisabled
              />
            </SwitchGroup>
          </Flex>

          <Flex direction="column" alignSecondary="stretch" gap="600" role="region" aria-labelledby="ts-members">
            <TextHeading elementType="h2" id="ts-members">Team members</TextHeading>
            <ul className="team-settings-members">
              {draft.members.map((member) => {
                const isOwner = member.role === "Owner";
                return (
                  <li key={member.id} className="team-settings-member">
                    <AvatarBlock title={member.name} description={member.email}>
                      <Avatar size="large" initials={member.name[0]} />
                    </AvatarBlock>
                    <SelectField
                      className="team-settings-role"
                      aria-label={`Role for ${member.name}`}
                      selectedKey={member.role}
                      onSelectionChange={(key) => setRole(member.id, key as Role)}
                      isDisabled={isOwner}
                    >
                      {ROLES.map((role) => (
                        <SelectItem key={role} id={role} isDisabled={role === "Owner" && !isOwner}>
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
                  </li>
                );
              })}
            </ul>
          </Flex>

          <ButtonGroup align="end">
            <Button variant="neutral" onPress={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isDisabled={!isDirty || emailInvalid}>
              Save changes
            </Button>
          </ButtonGroup>
        </Flex>
      </form>
    </Section>
  );
}
