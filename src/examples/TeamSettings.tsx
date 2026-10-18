import { useMediaQuery } from "hooks";
import { IconAlertCircle, IconCheckCircle, IconTrash2 } from "icons";
import { Flex, Section } from "layout";
import {
  Avatar,
  AvatarBlock,
  Button,
  DestructiveIconButton,
  FieldGroup,
  Form,
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
import { FormEvent, useState } from "react";
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
  jobTitle: "Product Designer",
  productUpdates: true,
  weeklyDigest: false,
  members: [
    { id: "1", name: "Avery Chen", email: "avery@example.com", role: "Owner" },
    { id: "2", name: "Jordan Lee", email: "jordan@example.com", role: "Admin" },
    { id: "3", name: "Sam Patel", email: "sam@example.com", role: "Editor" },
    { id: "4", name: "Riley Brooks", email: "riley@example.com", role: "Viewer" },
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
  const [draft, setDraft] = useState<Settings>(INITIAL_SETTINGS);
  const [showSaved, setShowSaved] = useState(false);

  const emailInvalid = !EMAIL_PATTERN.test(draft.email.trim());
  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const canSave = isDirty && !emailInvalid;

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

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSave) return;
    setSaved(draft);
    setShowSaved(true);
  };
  const onCancel = () => {
    setDraft(saved);
    setShowSaved(false);
  };

  return (
    <Section padding={isMobile ? "600" : "1600"} aria-labelledby="team-settings-title">
      <Form onSubmit={onSubmit} className="team-settings" validationBehavior="aria">
        <Flex direction="column" gap="200">
          <TextTitlePage elementType="h1" id="team-settings-title">
            Team settings
          </TextTitlePage>
          <TextSubtitle>
            Manage your profile, notifications and who has access to your team.
          </TextSubtitle>
        </Flex>

        {emailInvalid && (
          <Notification variant="alert" role="alert" icon={<IconAlertCircle />}>
            Please fix the errors below before saving.
          </Notification>
        )}
        {showSaved && (
          <Notification role="status" icon={<IconCheckCircle />}>
            Your changes have been saved.
          </Notification>
        )}

        <section aria-labelledby="profile-heading" className="team-settings-card">
          <TextHeading elementType="h2" id="profile-heading">Profile</TextHeading>
          <FieldGroup>
            <InputField
              label="Full name"
              autoComplete="name"
              value={draft.name}
              onChange={(name) => update({ name })}
            />
            <InputField
              label="Email"
              type="email"
              autoComplete="email"
              value={draft.email}
              onChange={(email) => update({ email })}
              isInvalid={emailInvalid}
              errorMessage="Enter a valid email address, like name@example.com."
            />
            <InputField
              label="Job title"
              autoComplete="organization-title"
              value={draft.jobTitle}
              onChange={(jobTitle) => update({ jobTitle })}
              description="Shown to teammates next to your name."
            />
          </FieldGroup>
        </section>

        <section aria-labelledby="notifications-heading" className="team-settings-card">
          <TextHeading elementType="h2" id="notifications-heading">Notifications</TextHeading>
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
        </section>

        <section aria-labelledby="members-heading" className="team-settings-card">
          <TextHeading elementType="h2" id="members-heading">Team members</TextHeading>
          <ul className="team-settings-members">
            {draft.members.map((member) => {
              const isOwner = member.role === "Owner";
              return (
                <li key={member.id}>
                  <Flex
                    direction={isMobile ? "column" : "row"}
                    alignPrimary="space-between"
                    alignSecondary={isMobile ? "stretch" : "center"}
                    gap="400"
                  >
                    <AvatarBlock title={member.name} description={member.email}>
                      <Avatar initials={initialsOf(member.name)} />
                    </AvatarBlock>
                    <Flex alignSecondary="center" gap="200">
                      <SelectField
                        aria-label={`Role for ${member.name}`}
                        className="team-settings-role"
                        selectedKey={member.role}
                        onSelectionChange={(key) => updateMember(member.id, key as Role)}
                        isDisabled={isOwner}
                        disabledKeys={isOwner ? [] : ["Owner"]}
                      >
                        {ROLES.map((role) => (
                          <SelectItem key={role} id={role}>{role}</SelectItem>
                        ))}
                      </SelectField>
                      <DestructiveIconButton
                        variant="danger-subtle"
                        aria-label={isOwner ? `${member.name} is the owner and cannot be removed` : `Remove ${member.name}`}
                        isDisabled={isOwner}
                        onPress={() => removeMember(member.id)}
                      >
                        <IconTrash2 />
                      </DestructiveIconButton>
                    </Flex>
                  </Flex>
                </li>
              );
            })}
          </ul>
        </section>

        <Flex direction={isMobile ? "column-reverse" : "row"} alignPrimary="end" gap="400">
          <Button type="button" variant="neutral" onPress={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isDisabled={!canSave}>
            Save changes
          </Button>
        </Flex>
      </Form>
    </Section>
  );
}
