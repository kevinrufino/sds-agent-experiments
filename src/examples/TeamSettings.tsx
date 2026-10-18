import { IconCheckCircle } from "icons";
import { Flex, Section } from "layout";
import {
  Avatar,
  AvatarBlock,
  Button,
  ButtonDanger,
  ButtonGroup,
  Form,
  InputField,
  Notification,
  SelectField,
  SelectItem,
  SwitchField,
  SwitchGroup,
  TextContentTitle,
  TextHeading,
} from "primitives";
import { FormEvent, useState } from "react";
import "./teamSettings.css";

type Role = "owner" | "admin" | "editor" | "viewer";
type Member = { id: string; name: string; email: string; role: Role };
type Settings = {
  profile: { name: string; email: string; jobTitle: string };
  notifications: { productUpdates: boolean; weeklyDigest: boolean };
  members: Member[];
};

const ROLES: { id: Role; label: string }[] = [
  { id: "owner", label: "Owner" },
  { id: "admin", label: "Admin" },
  { id: "editor", label: "Editor" },
  { id: "viewer", label: "Viewer" },
];

const INITIAL_SETTINGS: Settings = {
  profile: {
    name: "Ada Lovelace",
    email: "ada@example.com",
    jobTitle: "Engineering Manager",
  },
  notifications: { productUpdates: true, weeklyDigest: false },
  members: [
    { id: "1", name: "Ada Lovelace", email: "ada@example.com", role: "owner" },
    { id: "2", name: "Grace Hopper", email: "grace@example.com", role: "admin" },
    { id: "3", name: "Alan Turing", email: "alan@example.com", role: "editor" },
    { id: "4", name: "Katherine Johnson", email: "katherine@example.com", role: "viewer" },
  ],
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export function TeamSettings() {
  const [saved, setSaved] = useState<Settings>(INITIAL_SETTINGS);
  const [draft, setDraft] = useState<Settings>(INITIAL_SETTINGS);
  const [showSaved, setShowSaved] = useState(false);

  const emailInvalid = !EMAIL_PATTERN.test(draft.profile.email.trim());
  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const update = (next: Partial<Settings>) => {
    setDraft((current) => ({ ...current, ...next }));
    setShowSaved(false);
  };
  const updateProfile = (field: keyof Settings["profile"], value: string) =>
    update({ profile: { ...draft.profile, [field]: value } });
  const updateNotification = (
    field: keyof Settings["notifications"],
    value: boolean,
  ) => update({ notifications: { ...draft.notifications, [field]: value } });
  const updateRole = (id: string, role: Role) =>
    update({
      members: draft.members.map((m) => (m.id === id ? { ...m, role } : m)),
    });
  const removeMember = (id: string) =>
    update({ members: draft.members.filter((m) => m.id !== id) });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isDirty || emailInvalid) return;
    setSaved(draft);
    setShowSaved(true);
  };
  const onCancel = () => {
    setDraft(saved);
    setShowSaved(false);
  };

  return (
    <Section padding="1200" variant="subtle">
      <Flex container direction="column" gap="1200">
        <TextContentTitle
          title="Team settings"
          subtitle="Manage your profile, notifications and who has access to your team."
        />
        <Form onSubmit={onSubmit} className="team-settings-form">
          <section aria-labelledby="ts-profile" className="team-settings-card">
            <TextHeading elementType="h2" id="ts-profile">
              Profile
            </TextHeading>
            <InputField
              label="Full name"
              autoComplete="name"
              value={draft.profile.name}
              onChange={(value) => updateProfile("name", value)}
            />
            <InputField
              label="Email"
              type="email"
              autoComplete="email"
              value={draft.profile.email}
              onChange={(value) => updateProfile("email", value)}
              isInvalid={emailInvalid}
              errorMessage="Enter a valid email address, like name@example.com."
            />
            <InputField
              label="Job title"
              autoComplete="organization-title"
              description="Shown to teammates next to your name."
              value={draft.profile.jobTitle}
              onChange={(value) => updateProfile("jobTitle", value)}
            />
          </section>

          <section aria-labelledby="ts-notifications" className="team-settings-card">
            <TextHeading elementType="h2" id="ts-notifications">
              Notifications
            </TextHeading>
            <SwitchGroup>
              <SwitchField
                label="Product updates"
                description="News about features and improvements."
                isSelected={draft.notifications.productUpdates}
                onChange={(value) => updateNotification("productUpdates", value)}
              />
              <SwitchField
                label="Weekly digest"
                description="A summary of your team's activity every Monday."
                isSelected={draft.notifications.weeklyDigest}
                onChange={(value) => updateNotification("weeklyDigest", value)}
              />
              <SwitchField
                label="Security alerts"
                description="Always on to keep your account safe."
                isSelected
                isDisabled
              />
            </SwitchGroup>
          </section>

          <section aria-labelledby="ts-members" className="team-settings-card">
            <TextHeading elementType="h2" id="ts-members">
              Team members
            </TextHeading>
            <ul className="team-settings-members">
              {draft.members.map((member) => {
                const isOwner = member.role === "owner";
                return (
                  <li key={member.id} className="team-settings-member">
                    <AvatarBlock title={member.name} description={member.email}>
                      <Avatar initials={initialsOf(member.name)} />
                    </AvatarBlock>
                    <Flex gap="300" alignSecondary="center">
                      <SelectField
                        aria-label={`Role for ${member.name}`}
                        className="team-settings-role"
                        selectedKey={member.role}
                        onSelectionChange={(key) => updateRole(member.id, key as Role)}
                        isDisabled={isOwner}
                        disabledKeys={isOwner ? [] : ["owner"]}
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
                        aria-label={`Remove ${member.name}`}
                        isDisabled={isOwner}
                        onPress={() => removeMember(member.id)}
                      >
                        Remove
                      </ButtonDanger>
                    </Flex>
                  </li>
                );
              })}
            </ul>
          </section>

          <div role="status" aria-live="polite">
            {showSaved && (
              <Notification icon={<IconCheckCircle />}>
                Your changes have been saved.
              </Notification>
            )}
          </div>

          <ButtonGroup align="end">
            <Button variant="neutral" onPress={onCancel} isDisabled={!isDirty}>
              Cancel
            </Button>
            <Button type="submit" isDisabled={!isDirty || emailInvalid}>
              Save changes
            </Button>
          </ButtonGroup>
        </Form>
      </Flex>
    </Section>
  );
}
