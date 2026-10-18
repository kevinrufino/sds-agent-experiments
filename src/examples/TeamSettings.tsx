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

type Role = "owner" | "admin" | "editor" | "viewer";
type Member = { id: string; name: string; email: string; role: Role };
type FormState = {
  fullName: string;
  email: string;
  jobTitle: string;
  productUpdates: boolean;
  weeklyDigest: boolean;
  members: Member[];
};

const ROLES: { id: Role; label: string }[] = [
  { id: "owner", label: "Owner" },
  { id: "admin", label: "Admin" },
  { id: "editor", label: "Editor" },
  { id: "viewer", label: "Viewer" },
];

const INITIAL_STATE: FormState = {
  fullName: "Ada Lovelace",
  email: "ada@example.com",
  jobTitle: "",
  productUpdates: true,
  weeklyDigest: false,
  members: [
    { id: "1", name: "Ada Lovelace", email: "ada@example.com", role: "owner" },
    { id: "2", name: "Grace Hopper", email: "grace@example.com", role: "admin" },
    { id: "3", name: "Alan Turing", email: "alan@example.com", role: "viewer" },
  ],
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function TeamSettings() {
  const { isMobile } = useMediaQuery();
  const [saved, setSaved] = useState<FormState>(INITIAL_STATE);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [showSaved, setShowSaved] = useState(false);

  const update = (patch: Partial<FormState>) => {
    setForm((current) => ({ ...current, ...patch }));
    setShowSaved(false);
  };
  const updateMembers = (fn: (members: Member[]) => Member[]) =>
    update({ members: fn(form.members) });

  const nameError = form.fullName.trim() ? undefined : "Enter your full name.";
  const emailError = EMAIL_PATTERN.test(form.email.trim())
    ? undefined
    : "Enter a valid email address.";
  const errorCount = [nameError, emailError].filter(Boolean).length;
  const isDirty = JSON.stringify(form) !== JSON.stringify(saved);

  const handleSave = () => {
    setSaved(form);
    setShowSaved(true);
  };
  const handleCancel = () => {
    setForm(saved);
    setShowSaved(false);
  };

  return (
    <Section padding={isMobile ? "600" : "1600"}>
      <Flex direction="column" gap={isMobile ? "800" : "1200"} container>
        <TextContentTitle
          title="Team settings"
          subtitle="Manage your profile, notifications, and team members."
        />

        {errorCount > 0 && (
          <Notification variant="alert" role="alert" icon={<IconInfo size="20" />}>
            <TextStrong>
              {errorCount === 1 ? "1 field needs attention" : `${errorCount} fields need attention`}
            </TextStrong>
            <Text>Fix the highlighted fields before saving.</Text>
          </Notification>
        )}
        {showSaved && errorCount === 0 && (
          <Notification variant="message" role="status" icon={<IconCheckCircle size="20" />}>
            <TextStrong>Changes saved</TextStrong>
            <Text>Your team settings have been updated.</Text>
          </Notification>
        )}

        <Flex direction="column" gap="600" className="team-settings-section">
          <TextHeading elementType="h2">Profile</TextHeading>
          <InputField
            label="Full name"
            value={form.fullName}
            onChange={(fullName) => update({ fullName })}
            isInvalid={!!nameError}
            errorMessage={nameError}
            isRequired
          />
          <InputField
            label="Email"
            type="email"
            value={form.email}
            onChange={(email) => update({ email })}
            isInvalid={!!emailError}
            errorMessage={emailError}
            isRequired
          />
          <InputField
            label="Job title"
            description="Shown to teammates on your profile."
            placeholder="e.g. Engineering manager"
            value={form.jobTitle}
            onChange={(jobTitle) => update({ jobTitle })}
          />
        </Flex>

        <Flex direction="column" gap="600" className="team-settings-section">
          <TextHeading elementType="h2">Notifications</TextHeading>
          <SwitchGroup>
            <SwitchField
              label="Product updates"
              description="News about features and improvements."
              isSelected={form.productUpdates}
              onChange={(productUpdates) => update({ productUpdates })}
            />
            <SwitchField
              label="Weekly digest"
              description="A summary of team activity every Monday."
              isSelected={form.weeklyDigest}
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

        <Flex direction="column" gap="600" className="team-settings-section">
          <TextHeading elementType="h2">Team members</TextHeading>
          <ul className="team-settings-members">
            {form.members.map((member) => {
              const isOwner = member.role === "owner";
              return (
                <li key={member.id} className="team-settings-member">
                  <AvatarBlock title={member.name} description={member.email}>
                    <Avatar initials={member.name.charAt(0)} size="large" />
                  </AvatarBlock>
                  <SelectField
                    aria-label={`Role for ${member.name}`}
                    className="team-settings-role"
                    selectedKey={member.role}
                    disabledKeys={isOwner ? [] : ["owner"]}
                    isDisabled={isOwner}
                    onSelectionChange={(key) =>
                      updateMembers((members) =>
                        members.map((m) => (m.id === member.id ? { ...m, role: key as Role } : m)),
                      )
                    }
                  >
                    {ROLES.map((role) => (
                      <SelectItem key={role.id} id={role.id}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectField>
                  <ButtonDanger
                    variant="danger-subtle"
                    size="small"
                    isDisabled={isOwner}
                    aria-label={`Remove ${member.name}`}
                    onPress={() =>
                      updateMembers((members) => members.filter((m) => m.id !== member.id))
                    }
                  >
                    Remove
                  </ButtonDanger>
                </li>
              );
            })}
          </ul>
        </Flex>

        <ButtonGroup align={isMobile ? "stack" : "end"}>
          <Button variant="neutral" onPress={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" isDisabled={!isDirty || errorCount > 0} onPress={handleSave}>
            Save changes
          </Button>
        </ButtonGroup>
      </Flex>
    </Section>
  );
}
