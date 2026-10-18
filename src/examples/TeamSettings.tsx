import { useMediaQuery } from "hooks";
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
  name: "Ada Lovelace",
  email: "ada@example.com",
  jobTitle: "Engineering lead",
  productUpdates: true,
  weeklyDigest: false,
  members: [
    { id: "1", name: "Ada Lovelace", email: "ada@example.com", role: "Owner" },
    { id: "2", name: "Grace Hopper", email: "grace@example.com", role: "Admin" },
    { id: "3", name: "Alan Turing", email: "alan@example.com", role: "Editor" },
    { id: "4", name: "Katherine Johnson", email: "katherine@example.com", role: "Viewer" },
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
  const [justSaved, setJustSaved] = useState(false);

  const update = (patch: Partial<Settings>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setJustSaved(false);
  };
  const updateMember = (id: string, patch: Partial<Member> | null) =>
    update({
      members: draft.members.flatMap((m) =>
        m.id !== id ? [m] : patch ? [{ ...m, ...patch }] : [],
      ),
    });

  const nameError = draft.name.trim() ? undefined : "Enter your full name.";
  const emailError = EMAIL_PATTERN.test(draft.email.trim())
    ? undefined
    : "Enter a valid email address, like name@example.com.";
  const isValid = !nameError && !emailError;
  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || !isDirty) return;
    setSaved(draft);
    setJustSaved(true);
  };
  const onCancel = () => {
    setDraft(saved);
    setJustSaved(false);
  };

  return (
    <Section padding={isMobile ? "600" : "1600"} variant="subtle">
      <form className="team-settings" onSubmit={onSubmit} noValidate>
        <Flex direction="column" alignSecondary="stretch" gap={isMobile ? "600" : "800"}>
          <Flex direction="column" gap="200">
            <TextTitlePage elementType="h1">Team settings</TextTitlePage>
            <TextSubtitle>Manage your profile, notifications and who has access to your team.</TextSubtitle>
          </Flex>

          <div aria-live="polite">
            {!isValid && (
              <Notification variant="alert" role="alert">
                Please fix the highlighted fields before saving.
              </Notification>
            )}
            {isValid && justSaved && (
              <Notification role="status">Your changes have been saved.</Notification>
            )}
          </div>

          <section className="team-settings-card" aria-labelledby="ts-profile">
            <TextHeading id="ts-profile" elementType="h2">Profile</TextHeading>
            <Flex direction="column" alignSecondary="stretch" gap="600">
              <InputField
                label="Full name"
                autoComplete="name"
                value={draft.name}
                onChange={(name) => update({ name })}
                isRequired
                isInvalid={!!nameError}
                errorMessage={nameError}
              />
              <InputField
                label="Email"
                type="email"
                autoComplete="email"
                value={draft.email}
                onChange={(email) => update({ email })}
                isRequired
                isInvalid={!!emailError}
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
          </section>

          <section className="team-settings-card" aria-labelledby="ts-notifications">
            <TextHeading id="ts-notifications" elementType="h2">Notifications</TextHeading>
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

          <section className="team-settings-card" aria-labelledby="ts-members">
            <TextHeading id="ts-members" elementType="h2">Team members</TextHeading>
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
                        <Avatar initials={initials(member.name)} />
                      </AvatarBlock>
                      <Flex direction="row" alignSecondary="center" gap="300">
                        <SelectField
                          aria-label={`Role for ${member.name}`}
                          selectedKey={member.role}
                          onSelectionChange={(key) => updateMember(member.id, { role: key as Role })}
                          isDisabled={isOwner}
                        >
                          {ROLES.filter((role) => isOwner || role !== "Owner").map((role) => (
                            <SelectItem key={role} id={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectField>
                        <ButtonDanger
                          variant="danger-subtle"
                          size="small"
                          isDisabled={isOwner}
                          aria-label={`Remove ${member.name}`}
                          onPress={() => updateMember(member.id, null)}
                        >
                          Remove
                        </ButtonDanger>
                      </Flex>
                    </Flex>
                  </li>
                );
              })}
            </ul>
          </section>

          <ButtonGroup align={isMobile ? "stack" : "end"}>
            <Button type="button" variant="neutral" onPress={onCancel} isDisabled={!isDirty}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isDisabled={!isDirty || !isValid}>
              Save changes
            </Button>
          </ButtonGroup>
        </Flex>
      </form>
    </Section>
  );
}
