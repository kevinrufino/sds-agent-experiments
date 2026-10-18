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
import "./TeamSettings.css";

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
const INITIAL: Settings = {
  name: "Ada Lovelace",
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
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function TeamSettings() {
  const { isMobile } = useMediaQuery();
  const [saved, setSaved] = useState<Settings>(INITIAL);
  const [form, setForm] = useState<Settings>(INITIAL);
  const [justSaved, setJustSaved] = useState(false);

  const emailInvalid = !EMAIL_PATTERN.test(form.email.trim());
  const isDirty = JSON.stringify(form) !== JSON.stringify(saved);

  const update = (patch: Partial<Settings>) => {
    setForm((current) => ({ ...current, ...patch }));
    setJustSaved(false);
  };
  const updateMember = (id: string, role: Role) =>
    update({ members: form.members.map((m) => (m.id === id ? { ...m, role } : m)) });
  const removeMember = (id: string) =>
    update({ members: form.members.filter((m) => m.id !== id) });

  const save = () => {
    setSaved(form);
    setJustSaved(true);
  };
  const cancel = () => {
    setForm(saved);
    setJustSaved(false);
  };

  return (
    <Section padding={isMobile ? "600" : "1600"} variant="stroke">
      <form
        className="team-settings"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (isDirty && !emailInvalid) save();
        }}
      >
        <Flex container direction="column" alignSecondary="stretch" gap={isMobile ? "600" : "1200"}>
          <TextContentTitle
            title="Team settings"
            subtitle="Manage your profile, notifications, and team members."
          />

          {emailInvalid && (
            <Notification variant="alert" icon={<IconInfo />} role="alert">
              <TextStrong>1 field needs attention</TextStrong>
              <Text>Fix the highlighted email address before saving.</Text>
            </Notification>
          )}
          {justSaved && (
            <Notification variant="message" icon={<IconCheckCircle />} role="status">
              <TextStrong>Changes saved</TextStrong>
              <Text>Your team settings have been updated.</Text>
            </Notification>
          )}

          <Flex direction="column" alignSecondary="stretch" gap="600">
            <TextHeading elementType="h2">Profile</TextHeading>
            <InputField
              label="Full name"
              value={form.name}
              onChange={(name) => update({ name })}
            />
            <InputField
              label="Email"
              type="email"
              value={form.email}
              onChange={(email) => update({ email })}
              isInvalid={emailInvalid}
              errorMessage="Enter a valid email address."
            />
            <InputField
              label="Job title"
              description="Shown to teammates on your profile."
              placeholder="e.g. Engineering manager"
              value={form.jobTitle}
              onChange={(jobTitle) => update({ jobTitle })}
            />
          </Flex>

          <Flex direction="column" alignSecondary="stretch" gap="600">
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

          <Flex direction="column" alignSecondary="stretch" gap="600">
            <TextHeading elementType="h2">Team members</TextHeading>
            <ul className="team-settings-members">
              {form.members.map((member) => {
                const isOwner = member.role === "Owner";
                return (
                  <li key={member.id} className="team-settings-member">
                    <AvatarBlock title={member.name} description={member.email}>
                      <Avatar initials={member.name.charAt(0)} size="large" />
                    </AvatarBlock>
                    <div className="team-settings-member-actions">
                      <SelectField
                        aria-label={`Role for ${member.name}`}
                        selectedKey={member.role}
                        onSelectionChange={(key) => updateMember(member.id, key as Role)}
                        isDisabled={isOwner}
                        disabledKeys={["Owner"]}
                      >
                        {ROLES.map((role) => (
                          <SelectItem key={role} id={role}>{role}</SelectItem>
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
                    </div>
                  </li>
                );
              })}
            </ul>
          </Flex>

          <ButtonGroup align="end">
            <Button variant="neutral" onPress={cancel}>
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
