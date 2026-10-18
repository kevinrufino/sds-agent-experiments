import { useMediaQuery } from "hooks";
import { IconCheckCircle, IconInfo } from "icons";
import { placeholder } from "images";
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
  Text,
  TextContentTitle,
  TextHeading,
  TextStrong,
} from "primitives";
import { useState } from "react";
import "./team-settings.css";

type Role = "Owner" | "Admin" | "Editor" | "Viewer";
type Member = { id: string; name: string; email: string; role: Role };
type FormState = {
  name: string;
  email: string;
  jobTitle: string;
  productUpdates: boolean;
  weeklyDigest: boolean;
  members: Member[];
};

const ROLES: Role[] = ["Owner", "Admin", "Editor", "Viewer"];
const OWNER_ID = "ada";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_STATE: FormState = {
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

export function TeamSettings() {
  const { isMobile } = useMediaQuery();
  const [saved, setSaved] = useState<FormState>(INITIAL_STATE);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [showSaved, setShowSaved] = useState(false);

  const update = (patch: Partial<FormState>) => {
    setForm((current) => ({ ...current, ...patch }));
    setShowSaved(false);
  };
  const updateMember = (id: string, role: Role) =>
    update({
      members: form.members.map((m) => (m.id === id ? { ...m, role } : m)),
    });
  const removeMember = (id: string) =>
    update({ members: form.members.filter((m) => m.id !== id) });

  const emailInvalid = !EMAIL_PATTERN.test(form.email.trim());
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
    <Section padding={isMobile ? "600" : "1600"} variant="subtle">
      <form
        className="team-settings"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (isDirty && !emailInvalid) handleSave();
        }}
      >
        <Flex container direction="column" alignSecondary="stretch" gap="1200">
          <TextContentTitle
            title="Team settings"
            subtitle="Manage your profile, notifications, and team members."
          />

          <div aria-live="polite">
            {emailInvalid ? (
              <Notification variant="alert" icon={<IconInfo />} role="alert">
                <TextStrong>1 field needs attention</TextStrong>
                <Text>Fix the highlighted email address before saving.</Text>
              </Notification>
            ) : showSaved ? (
              <Notification icon={<IconCheckCircle />} role="status">
                <TextStrong>Changes saved</TextStrong>
                <Text>Your team settings have been updated.</Text>
              </Notification>
            ) : null}
          </div>

          <section aria-labelledby="ts-profile">
            <Flex direction="column" alignSecondary="stretch" gap="600">
              <TextHeading elementType="h2" id="ts-profile">
                Profile
              </TextHeading>
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
                placeholder="e.g. Engineering manager"
                description="Shown to teammates on your profile."
                value={form.jobTitle}
                onChange={(jobTitle) => update({ jobTitle })}
              />
            </Flex>
          </section>

          <section aria-labelledby="ts-notifications">
            <Flex direction="column" alignSecondary="stretch" gap="600">
              <TextHeading elementType="h2" id="ts-notifications">
                Notifications
              </TextHeading>
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
            </Flex>
          </section>

          <section aria-labelledby="ts-members">
            <Flex direction="column" alignSecondary="stretch" gap="600">
              <TextHeading elementType="h2" id="ts-members">
                Team members
              </TextHeading>
              <ul className="team-settings-members">
                {form.members.map((member) => {
                  const isOwner = member.id === OWNER_ID;
                  return (
                    <li key={member.id} className="team-settings-member">
                      <AvatarBlock title={member.name} description={member.email}>
                        <Avatar src={placeholder} size="large" />
                      </AvatarBlock>
                      <SelectField
                        className="team-settings-role"
                        aria-label={`Role for ${member.name}`}
                        selectedKey={member.role}
                        onSelectionChange={(key) => updateMember(member.id, key as Role)}
                        isDisabled={isOwner}
                      >
                        {ROLES.map((role) => (
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
                        onPress={() => removeMember(member.id)}
                      >
                        Remove
                      </ButtonDanger>
                    </li>
                  );
                })}
              </ul>
            </Flex>
          </section>

          <ButtonGroup align={isMobile ? "stack" : "end"}>
            <Button variant="neutral" type="button" onPress={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isDisabled={!isDirty || emailInvalid}>
              Save changes
            </Button>
          </ButtonGroup>
        </Flex>
      </form>
    </Section>
  );
}
