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
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_SETTINGS: Settings = {
  fullName: "Avery Chen",
  email: "avery@example.com",
  jobTitle: "Product Designer",
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
  name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

export function TeamSettings() {
  const [saved, setSaved] = useState<Settings>(INITIAL_SETTINGS);
  const [draft, setDraft] = useState<Settings>(INITIAL_SETTINGS);
  const [showSaved, setShowSaved] = useState(false);

  const update = (patch: Partial<Settings>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setShowSaved(false);
  };
  const updateMembers = (fn: (members: Member[]) => Member[]) =>
    update({ members: fn(draft.members) });

  const nameError = draft.fullName.trim() ? undefined : "Enter your full name.";
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
    <Section padding="1200" variant="subtle" className="team-settings">
      <Form
        className="team-settings-form"
        aria-labelledby="team-settings-title"
        onSubmit={(event) => {
          event.preventDefault();
          handleSave();
        }}
      >
        <div>
          <TextTitlePage elementType="h1" id="team-settings-title">
            Team settings
          </TextTitlePage>
          <TextSubtitle>
            Manage your profile, notifications and who has access to your team.
          </TextSubtitle>
        </div>

        {isInvalid && (
          <Notification variant="alert" role="alert" icon={<IconAlertCircle />}>
            Please fix the highlighted fields before saving.
          </Notification>
        )}
        {showSaved && (
          <Notification role="status" icon={<IconCheckCircle />}>
            Your changes have been saved.
          </Notification>
        )}

        <section aria-labelledby="ts-profile" className="team-settings-card">
          <TextHeading elementType="h2" id="ts-profile">
            Profile
          </TextHeading>
          <FieldGroup>
            <InputField
              label="Full name"
              autoComplete="name"
              isRequired
              value={draft.fullName}
              onChange={(fullName) => update({ fullName })}
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
          </FieldGroup>
        </section>

        <section aria-labelledby="ts-notifications" className="team-settings-card">
          <TextHeading elementType="h2" id="ts-notifications">
            Notifications
          </TextHeading>
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

        <section aria-labelledby="ts-members" className="team-settings-card">
          <TextHeading elementType="h2" id="ts-members">
            Team members
          </TextHeading>
          <ul className="team-settings-members">
            {draft.members.map((member) => {
              const isOwner = member.role === "Owner";
              return (
                <li key={member.id} className="team-settings-member">
                  <AvatarBlock title={member.name} description={member.email}>
                    <Avatar initials={initials(member.name)} />
                  </AvatarBlock>
                  <Flex gap="200" alignSecondary="end">
                    <SelectField
                      aria-label={`Role for ${member.name}`}
                      className="team-settings-role"
                      selectedKey={member.role}
                      isDisabled={isOwner}
                      onSelectionChange={(key) =>
                        updateMembers((members) =>
                          members.map((m) =>
                            m.id === member.id ? { ...m, role: key as Role } : m,
                          ),
                        )
                      }
                    >
                      {ROLES.filter((r) => isOwner || r !== "Owner").map((r) => (
                        <SelectItem key={r} id={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectField>
                    <DestructiveIconButton
                      variant="danger-subtle"
                      aria-label={`Remove ${member.name}`}
                      isDisabled={isOwner}
                      onPress={() =>
                        updateMembers((members) =>
                          members.filter((m) => m.id !== member.id),
                        )
                      }
                    >
                      <IconTrash2 />
                    </DestructiveIconButton>
                  </Flex>
                </li>
              );
            })}
          </ul>
        </section>

        <Flex gap="300" alignPrimary="end" wrap>
          <Button variant="neutral" onPress={handleCancel} isDisabled={!isDirty}>
            Cancel
          </Button>
          <Button type="submit" isDisabled={!isDirty || isInvalid}>
            Save changes
          </Button>
        </Flex>
      </Form>
    </Section>
  );
}
