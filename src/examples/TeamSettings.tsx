import { useMediaQuery } from "hooks";
import { IconCheckCircle, IconTrash2 } from "icons";
import { Flex, Section } from "layout";
import {
  Avatar,
  AvatarBlock,
  Button,
  ButtonGroup,
  DestructiveIconButton,
  Form,
  InputField,
  Notification,
  SelectField,
  SelectItem,
  SwitchField,
  SwitchGroup,
  Text,
  TextHeading,
  TextTitlePage,
} from "primitives";
import { useState, type FormEvent } from "react";
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
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  jobTitle: "Product Designer",
  productUpdates: true,
  weeklyDigest: false,
  members: [
    { id: "1", name: "Alex Morgan", email: "alex.morgan@example.com", role: "Owner" },
    { id: "2", name: "Priya Shah", email: "priya.shah@example.com", role: "Admin" },
    { id: "3", name: "Jordan Lee", email: "jordan.lee@example.com", role: "Editor" },
    { id: "4", name: "Sam Rivera", email: "sam.rivera@example.com", role: "Viewer" },
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

  const update = (changes: Partial<Settings>) => {
    setDraft((current) => ({ ...current, ...changes }));
    setShowSaved(false);
  };
  const setRole = (id: string, role: Role) =>
    update({
      members: draft.members.map((m) => (m.id === id ? { ...m, role } : m)),
    });
  const removeMember = (id: string) =>
    update({ members: draft.members.filter((m) => m.id !== id) });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSave) return;
    setSaved(draft);
    setShowSaved(true);
  };
  const handleCancel = () => {
    setDraft(saved);
    setShowSaved(false);
  };

  return (
    <Section padding={isMobile ? "600" : "1200"} variant="subtle">
      <Form onSubmit={handleSubmit} validationBehavior="aria">
        <Flex direction="column" gap="800" container>
          <Flex direction="column" gap="200">
            <TextTitlePage elementType="h1">Team settings</TextTitlePage>
            <Text>Manage your profile, notifications and who has access to your team.</Text>
          </Flex>

          <section className="team-settings-card" aria-labelledby="ts-profile">
            <TextHeading elementType="h2" id="ts-profile">Profile</TextHeading>
            <InputField
              label="Full name"
              name="name"
              autoComplete="name"
              value={draft.name}
              onChange={(name) => update({ name })}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={draft.email}
              onChange={(email) => update({ email })}
              isInvalid={emailInvalid}
              errorMessage="Enter a valid email address, like name@example.com."
            />
            <InputField
              label="Job title"
              name="jobTitle"
              autoComplete="organization-title"
              description="Shown to teammates next to your name."
              value={draft.jobTitle}
              onChange={(jobTitle) => update({ jobTitle })}
            />
          </section>

          <section className="team-settings-card" aria-labelledby="ts-notifications">
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

          <section className="team-settings-card" aria-labelledby="ts-members">
            <TextHeading elementType="h2" id="ts-members">Team members</TextHeading>
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
                      <Flex alignSecondary="end" gap="200">
                        <SelectField
                          className="team-settings-role"
                          aria-label={`Role for ${member.name}`}
                          selectedKey={member.role}
                          onSelectionChange={(key) => setRole(member.id, key as Role)}
                          isDisabled={isOwner}
                          disabledKeys={isOwner ? [] : ["Owner"]}
                        >
                          {ROLES.map((role) => (
                            <SelectItem key={role} id={role}>{role}</SelectItem>
                          ))}
                        </SelectField>
                        <DestructiveIconButton
                          variant="danger-subtle"
                          aria-label={`Remove ${member.name}`}
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

          <div role="status" aria-live="polite">
            {showSaved && (
              <Notification icon={<IconCheckCircle />}>
                <Text>Your changes have been saved.</Text>
              </Notification>
            )}
          </div>

          <ButtonGroup align="end">
            <Button type="button" variant="neutral" onPress={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isDisabled={!canSave}>
              Save changes
            </Button>
          </ButtonGroup>
        </Flex>
      </Form>
    </Section>
  );
}
