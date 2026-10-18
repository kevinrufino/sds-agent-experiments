import { useMediaQuery } from "hooks";
import { IconAlertCircle, IconCheckCircle, IconTrash2 } from "icons";
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

const ROLES = ["Owner", "Admin", "Editor", "Viewer"] as const;
type Role = (typeof ROLES)[number];
type Member = { id: string; name: string; email: string; role: Role };

type Settings = {
  name: string;
  email: string;
  jobTitle: string;
  productUpdates: boolean;
  weeklyDigest: boolean;
  members: Member[];
};

const INITIAL: Settings = {
  name: "Avery Johnson",
  email: "avery@example.com",
  jobTitle: "Product designer",
  productUpdates: true,
  weeklyDigest: false,
  members: [
    { id: "1", name: "Avery Johnson", email: "avery@example.com", role: "Owner" },
    { id: "2", name: "Sam Lee", email: "sam@example.com", role: "Admin" },
    { id: "3", name: "Priya Patel", email: "priya@example.com", role: "Editor" },
    { id: "4", name: "Diego Ruiz", email: "diego@example.com", role: "Viewer" },
  ],
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const initials = (name: string) =>
  name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

export function TeamSettings() {
  const { isMobile } = useMediaQuery();
  const [saved, setSaved] = useState<Settings>(INITIAL);
  const [form, setForm] = useState<Settings>(INITIAL);
  const [showSaved, setShowSaved] = useState(false);

  const update = (patch: Partial<Settings>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setShowSaved(false);
  };
  const updateMember = (id: string, role: Role) =>
    update({ members: form.members.map((m) => (m.id === id ? { ...m, role } : m)) });
  const removeMember = (id: string) =>
    update({ members: form.members.filter((m) => m.id !== id) });

  const nameError = form.name.trim() ? undefined : "Enter your full name.";
  const emailError = EMAIL_PATTERN.test(form.email.trim())
    ? undefined
    : "Enter a valid email address, like name@example.com.";
  const errorCount = [nameError, emailError].filter(Boolean).length;
  const isDirty = JSON.stringify(form) !== JSON.stringify(saved);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isDirty || errorCount > 0) return;
    setSaved(form);
    setShowSaved(true);
  };
  const handleCancel = () => {
    setForm(saved);
    setShowSaved(false);
  };

  return (
    <Section padding={isMobile ? "600" : "1200"} variant="neutral">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
        <Flex direction="column" gap="200">
          <TextTitlePage elementType="h1">Team settings</TextTitlePage>
          <Text>Manage your profile, notifications and who has access to your team.</Text>
        </Flex>

        <div aria-live="polite">
          {errorCount > 0 && (
            <Notification variant="alert" icon={<IconAlertCircle />}>
              <Text>
                Please fix {errorCount === 1 ? "1 error" : `${errorCount} errors`} before saving.
              </Text>
            </Notification>
          )}
          {showSaved && errorCount === 0 && (
            <Notification icon={<IconCheckCircle />}>
              <Text>Your changes have been saved.</Text>
            </Notification>
          )}
        </div>

        <Form validationBehavior="aria" onSubmit={handleSubmit} className="team-settings-form">
          <section aria-labelledby="ts-profile" className="team-settings-card">
            <TextHeading elementType="h2" id="ts-profile">Profile</TextHeading>
            <InputField
              label="Full name"
              value={form.name}
              onChange={(name) => update({ name })}
              isRequired
              isInvalid={!!nameError}
              errorMessage={nameError}
              autoComplete="name"
            />
            <InputField
              label="Email"
              type="email"
              value={form.email}
              onChange={(email) => update({ email })}
              isRequired
              isInvalid={!!emailError}
              errorMessage={emailError}
              autoComplete="email"
            />
            <InputField
              label="Job title"
              description="Shown to teammates next to your name."
              value={form.jobTitle}
              onChange={(jobTitle) => update({ jobTitle })}
              autoComplete="organization-title"
            />
          </section>

          <section aria-labelledby="ts-notifications" className="team-settings-card">
            <TextHeading elementType="h2" id="ts-notifications">Notifications</TextHeading>
            <SwitchGroup>
              <SwitchField
                label="Product updates"
                description="News about features and improvements."
                isSelected={form.productUpdates}
                onChange={(productUpdates) => update({ productUpdates })}
              />
              <SwitchField
                label="Weekly digest"
                description="A summary of your team's activity every Monday."
                isSelected={form.weeklyDigest}
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
            <TextHeading elementType="h2" id="ts-members">Team members</TextHeading>
            <ul className="team-settings-members">
              {form.members.map((member) => {
                const isOwner = member.role === "Owner";
                return (
                  <li key={member.id} className="team-settings-member">
                    <AvatarBlock title={member.name} description={member.email}>
                      <Avatar initials={initials(member.name)} />
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
                          <SelectItem key={role} id={role}>
                            {role}
                          </SelectItem>
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
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <ButtonGroup align={isMobile ? "stack" : "end"}>
            <Button variant="neutral" onPress={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" isDisabled={!isDirty || errorCount > 0}>
              Save changes
            </Button>
          </ButtonGroup>
        </Form>
      </Flex>
    </Section>
  );
}
