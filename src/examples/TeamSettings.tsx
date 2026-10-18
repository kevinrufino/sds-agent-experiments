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
import "./teamSettings.css";

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
    { id: "1", name: "Ada Lovelace", email: "ada@example.com", role: "Owner" },
    { id: "2", name: "Grace Hopper", email: "grace@example.com", role: "Admin" },
    { id: "3", name: "Alan Turing", email: "alan@example.com", role: "Viewer" },
  ],
};

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export function TeamSettings() {
  const [saved, setSaved] = useState<Settings>(INITIAL_SETTINGS);
  const [values, setValues] = useState<Settings>(INITIAL_SETTINGS);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const emailInvalid = !isValidEmail(values.email);
  const isDirty = JSON.stringify(values) !== JSON.stringify(saved);

  const update = (patch: Partial<Settings>) => {
    setValues((current) => ({ ...current, ...patch }));
    setShowConfirmation(false);
  };
  const setRole = (id: string, role: Role) =>
    update({
      members: values.members.map((m) => (m.id === id ? { ...m, role } : m)),
    });
  const removeMember = (id: string) =>
    update({ members: values.members.filter((m) => m.id !== id) });

  const handleSave = () => {
    if (emailInvalid || !isDirty) return;
    setSaved(values);
    setShowConfirmation(true);
  };
  const handleCancel = () => {
    setValues(saved);
    setShowConfirmation(false);
  };

  return (
    <Section padding="1600" variant="subtle">
      <Flex container direction="column" alignSecondary="stretch" gap="1200">
        <TextContentTitle
          title="Team settings"
          subtitle="Manage your profile, notifications, and team members."
        />

        {emailInvalid && (
          <Notification
            role="alert"
            variant="alert"
            icon={<IconInfo size="20" />}
          >
            <TextStrong>1 field needs attention</TextStrong>
            <Text>Fix the highlighted email address before saving.</Text>
          </Notification>
        )}
        {showConfirmation && (
          <Notification role="status" icon={<IconCheckCircle size="20" />}>
            <TextStrong>Changes saved</TextStrong>
            <Text>Your team settings have been updated.</Text>
          </Notification>
        )}

        <Flex direction="column" alignSecondary="stretch" gap="600">
          <TextHeading elementType="h2">Profile</TextHeading>
          <InputField
            label="Full name"
            value={values.fullName}
            onChange={(fullName) => update({ fullName })}
          />
          <InputField
            label="Email"
            type="email"
            value={values.email}
            onChange={(email) => update({ email })}
            isInvalid={emailInvalid}
            errorMessage="Enter a valid email address."
          />
          <InputField
            label="Job title"
            placeholder="e.g. Engineering manager"
            description="Shown to teammates on your profile."
            value={values.jobTitle}
            onChange={(jobTitle) => update({ jobTitle })}
          />
        </Flex>

        <Flex direction="column" alignSecondary="stretch" gap="600">
          <TextHeading elementType="h2">Notifications</TextHeading>
          <SwitchGroup>
            <SwitchField
              label="Product updates"
              description="News about features and improvements."
              isSelected={values.productUpdates}
              onChange={(productUpdates) => update({ productUpdates })}
            />
            <SwitchField
              label="Weekly digest"
              description="A summary of team activity every Monday."
              isSelected={values.weeklyDigest}
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

        <Flex direction="column" alignSecondary="stretch" gap="600">
          <TextHeading elementType="h2">Team members</TextHeading>
          <ul className="team-settings-members">
            {values.members.map((member) => {
              const isOwner = member.role === "Owner";
              return (
                <li key={member.id}>
                  <Flex alignSecondary="center" gap="600">
                    <AvatarBlock
                      className="team-settings-member"
                      title={member.name}
                      description={member.email}
                    >
                      <Avatar size="large" initials={member.name[0]} />
                    </AvatarBlock>
                    <SelectField
                      className="team-settings-role"
                      aria-label={`Role for ${member.name}`}
                      selectedKey={member.role}
                      onSelectionChange={(key) =>
                        setRole(member.id, key as Role)
                      }
                      isDisabled={isOwner}
                      disabledKeys={["Owner"]}
                    >
                      {ROLES.map((role) => (
                        <SelectItem key={role} id={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectField>
                    <ButtonDanger
                      size="small"
                      variant="danger-subtle"
                      isDisabled={isOwner}
                      aria-label={`Remove ${member.name}`}
                      onPress={() => removeMember(member.id)}
                    >
                      Remove
                    </ButtonDanger>
                  </Flex>
                </li>
              );
            })}
          </ul>
        </Flex>

        <ButtonGroup align="end">
          <Button variant="neutral" onPress={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onPress={handleSave}
            isDisabled={!isDirty || emailInvalid}
          >
            Save changes
          </Button>
        </ButtonGroup>
      </Flex>
    </Section>
  );
}
