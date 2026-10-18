import { useMediaQuery } from "hooks";
import { IconAlertCircle, IconCheckCircle } from "icons";
import { Flex, Section } from "layout";
import {
  Avatar,
  AvatarBlock,
  Button,
  ButtonDanger,
  ButtonGroup,
  Fieldset,
  Form,
  InputField,
  Legend,
  Notification,
  SelectField,
  SelectItem,
  SwitchField,
  SwitchGroup,
  Text,
  TextContentTitle,
  TextHeading,
} from "primitives";
import { useState, type FormEvent } from "react";

type Role = "owner" | "admin" | "editor" | "viewer";
type Member = { id: string; name: string; email: string; role: Role };
type Settings = {
  name: string;
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

const INITIAL_SETTINGS: Settings = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  jobTitle: "Engineering lead",
  productUpdates: true,
  weeklyDigest: false,
  members: [
    { id: "1", name: "Ada Lovelace", email: "ada@example.com", role: "owner" },
    { id: "2", name: "Grace Hopper", email: "grace@example.com", role: "admin" },
    { id: "3", name: "Alan Turing", email: "alan@example.com", role: "editor" },
    { id: "4", name: "Katherine Johnson", email: "katherine@example.com", role: "viewer" },
  ],
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function TeamSettings() {
  const { isMobile } = useMediaQuery();
  const [saved, setSaved] = useState<Settings>(INITIAL_SETTINGS);
  const [values, setValues] = useState<Settings>(INITIAL_SETTINGS);
  const [showSaved, setShowSaved] = useState(false);

  const nameInvalid = values.name.trim() === "";
  const emailInvalid = !EMAIL_PATTERN.test(values.email.trim());
  const hasErrors = nameInvalid || emailInvalid;
  const isDirty = JSON.stringify(values) !== JSON.stringify(saved);

  function update(patch: Partial<Settings>) {
    setValues((current) => ({ ...current, ...patch }));
    setShowSaved(false);
  }

  function updateMembers(fn: (members: Member[]) => Member[]) {
    update({ members: fn(values.members) });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isDirty || hasErrors) return;
    setSaved(values);
    setShowSaved(true);
  }

  function handleCancel() {
    setValues(saved);
    setShowSaved(false);
  }

  return (
    <Section padding={isMobile ? "600" : "1600"} aria-labelledby="team-settings-title">
      <Flex container direction="column" alignSecondary="stretch" gap={isMobile ? "600" : "800"}>
        <TextContentTitle
          id="team-settings-title"
          title="Team settings"
          subtitle="Manage your profile, notifications and who has access to your team."
        />

        {hasErrors && (
          <Notification variant="alert" role="alert" icon={<IconAlertCircle />}>
            Please fix the highlighted fields before saving.
          </Notification>
        )}
        {showSaved && (
          <Notification variant="message" role="status" icon={<IconCheckCircle />}>
            Your changes have been saved.
          </Notification>
        )}

        <Form validationBehavior="aria" onSubmit={handleSubmit}>
          <Flex direction="column" alignSecondary="stretch" gap="1200">
            <Fieldset>
              <Legend>
                <TextHeading elementType="h2">Profile</TextHeading>
              </Legend>
              <Text>How you appear to your team.</Text>
              <Flex direction="column" alignSecondary="stretch" gap="600">
                <InputField
                  label="Full name"
                  name="name"
                  autoComplete="name"
                  value={values.name}
                  onChange={(name) => update({ name })}
                  isRequired
                  isInvalid={nameInvalid}
                  errorMessage="Enter your full name."
                />
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(email) => update({ email })}
                  isRequired
                  isInvalid={emailInvalid}
                  errorMessage="Enter a valid email address, like name@example.com."
                />
                <InputField
                  label="Job title"
                  name="jobTitle"
                  autoComplete="organization-title"
                  value={values.jobTitle}
                  onChange={(jobTitle) => update({ jobTitle })}
                  description="Shown next to your name in comments and mentions."
                />
              </Flex>
            </Fieldset>

            <Fieldset>
              <Legend>
                <TextHeading elementType="h2">Notifications</TextHeading>
              </Legend>
              <Text>Choose which emails you receive.</Text>
              <SwitchGroup>
                <SwitchField
                  label="Product updates"
                  description="News about new features and improvements."
                  isSelected={values.productUpdates}
                  onChange={(productUpdates) => update({ productUpdates })}
                />
                <SwitchField
                  label="Weekly digest"
                  description="A summary of your team's activity every Monday."
                  isSelected={values.weeklyDigest}
                  onChange={(weeklyDigest) => update({ weeklyDigest })}
                />
                <SwitchField
                  label="Security alerts"
                  description="Always on. We'll tell you about sign-ins and account changes."
                  isSelected
                  isDisabled
                />
              </SwitchGroup>
            </Fieldset>

            <Fieldset>
              <Legend>
                <TextHeading elementType="h2">Team members</TextHeading>
              </Legend>
              <Text>Change roles or remove people from the team.</Text>
              <Flex direction="column" alignSecondary="stretch" gap="600" role="list">
                {values.members.map((member) => {
                  const isOwner = member.role === "owner";
                  return (
                    <Flex
                      key={member.id}
                      role="listitem"
                      direction={isMobile ? "column" : "row"}
                      alignPrimary="space-between"
                      alignSecondary={isMobile ? "stretch" : "center"}
                      gap="400"
                      wrap
                    >
                      <AvatarBlock title={member.name} description={member.email}>
                        <Avatar initials={member.name.charAt(0)} />
                      </AvatarBlock>
                      <Flex direction="row" alignSecondary="end" gap="400" wrap>
                        <SelectField
                          label={`Role for ${member.name}`}
                          selectedKey={member.role}
                          disabledKeys={isOwner ? [] : ["owner"]}
                          isDisabled={isOwner}
                          description={isOwner ? "The owner's role can't be changed." : undefined}
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
                          onPress={() => updateMembers((members) => members.filter((m) => m.id !== member.id))}
                        >
                          Remove
                        </ButtonDanger>
                      </Flex>
                    </Flex>
                  );
                })}
              </Flex>
            </Fieldset>

            <ButtonGroup align={isMobile ? "stack" : "end"}>
              <Button variant="neutral" type="button" onPress={handleCancel} isDisabled={!isDirty}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" isDisabled={!isDirty || hasErrors}>
                Save changes
              </Button>
            </ButtonGroup>
          </Flex>
        </Form>
      </Flex>
    </Section>
  );
}
