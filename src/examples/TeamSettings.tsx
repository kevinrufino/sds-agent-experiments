import { useMediaQuery } from "hooks";
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
  Text,
  TextHeading,
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
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  jobTitle: "Product Lead",
  productUpdates: true,
  weeklyDigest: false,
  members: [
    { id: "1", name: "Alex Morgan", email: "alex.morgan@example.com", role: "Owner" },
    { id: "2", name: "Priya Shah", email: "priya.shah@example.com", role: "Admin" },
    { id: "3", name: "Diego Ramos", email: "diego.ramos@example.com", role: "Editor" },
    { id: "4", name: "Mei Chen", email: "mei.chen@example.com", role: "Viewer" },
  ],
};

const initialsOf = (name: string) =>
  name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

export function TeamSettings() {
  const { isMobile } = useMediaQuery();
  const [saved, setSaved] = useState<Settings>(INITIAL_SETTINGS);
  const [draft, setDraft] = useState<Settings>(INITIAL_SETTINGS);
  const [showSaved, setShowSaved] = useState(false);

  const update = (changes: Partial<Settings>) => {
    setDraft((current) => ({ ...current, ...changes }));
    setShowSaved(false);
  };
  const updateMember = (id: string, role: Role) =>
    update({ members: draft.members.map((m) => (m.id === id ? { ...m, role } : m)) });
  const removeMember = (id: string) =>
    update({ members: draft.members.filter((m) => m.id !== id) });

  const nameError = draft.name.trim() ? undefined : "Full name is required.";
  const emailError = EMAIL_PATTERN.test(draft.email.trim())
    ? undefined
    : "Enter a valid email address, like name@example.com.";
  const isValid = !nameError && !emailError;
  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const canSave = isDirty && isValid;

  const handleSave = () => {
    if (!canSave) return;
    setSaved(draft);
    setShowSaved(true);
  };
  const handleCancel = () => {
    setDraft(saved);
    setShowSaved(false);
  };

  return (
    <Section padding={isMobile ? "600" : "1600"}>
      <Flex container direction="column" alignSecondary="stretch" gap={isMobile ? "600" : "800"}>
        <Flex direction="column" gap="200">
          <TextTitlePage elementType="h1">Team settings</TextTitlePage>
          <TextSubtitle>Manage your profile, notifications and who has access to your team.</TextSubtitle>
        </Flex>

        <div role="alert">
          {!isValid && (
            <Notification variant="alert">
              Please fix the highlighted fields before saving.
            </Notification>
          )}
        </div>
        <div role="status">
          {showSaved && <Notification>Your changes have been saved.</Notification>}
        </div>

        <Form
          onSubmit={(event) => {
            event.preventDefault();
            handleSave();
          }}
        >
          <Flex direction="column" alignSecondary="stretch" gap={isMobile ? "600" : "800"}>
            <section aria-labelledby="ts-profile" className="team-settings-panel">
              <Flex direction="column" alignSecondary="stretch" gap="400">
                <TextHeading elementType="h2" id="ts-profile">Profile</TextHeading>
                <InputField
                  label="Full name"
                  value={draft.name}
                  onChange={(name) => update({ name })}
                  isRequired
                  validationBehavior="aria"
                  isInvalid={!!nameError}
                  errorMessage={nameError}
                />
                <InputField
                  label="Email"
                  type="email"
                  value={draft.email}
                  onChange={(email) => update({ email })}
                  isRequired
                  validationBehavior="aria"
                  isInvalid={!!emailError}
                  errorMessage={emailError}
                />
                <InputField
                  label="Job title"
                  value={draft.jobTitle}
                  onChange={(jobTitle) => update({ jobTitle })}
                  description="Shown to teammates next to your name."
                />
              </Flex>
            </section>

            <section aria-labelledby="ts-notifications" className="team-settings-panel">
              <Flex direction="column" alignSecondary="stretch" gap="400">
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
                    description="Always on to keep your account safe."
                    isSelected
                    isDisabled
                  />
                </SwitchGroup>
              </Flex>
            </section>

            <section aria-labelledby="ts-members" className="team-settings-panel">
              <Flex direction="column" alignSecondary="stretch" gap="400">
                <TextHeading elementType="h2" id="ts-members">Team members</TextHeading>
                <ul className="team-settings-members">
                  {draft.members.map((member) => {
                    const isOwner = member.role === "Owner";
                    return (
                      <li key={member.id} className="team-settings-member">
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
                        </Flex>
                        {isOwner && <Text className="team-settings-note">The owner's role can't be changed or removed.</Text>}
                      </li>
                    );
                  })}
                </ul>
              </Flex>
            </section>

            <ButtonGroup align={isMobile ? "stack" : "end"}>
              <Button type="button" variant="neutral" onPress={handleCancel} isDisabled={!isDirty}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isDisabled={!canSave}>
                Save changes
              </Button>
            </ButtonGroup>
          </Flex>
        </Form>
      </Flex>
    </Section>
  );
}
