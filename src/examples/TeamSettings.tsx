import { useMediaQuery } from "hooks";
import { IconAlertCircle, IconCheckCircle, IconTrash2 } from "icons";
import { Flex, Section } from "layout";
import {
  Avatar,
  Button,
  ButtonGroup,
  DestructiveIconButton,
  Fieldset,
  FieldGroup,
  Form,
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
  name: "Avery Chen",
  email: "avery@example.com",
  jobTitle: "Product designer",
  productUpdates: true,
  weeklyDigest: false,
  members: [
    { id: "1", name: "Avery Chen", email: "avery@example.com", role: "Owner" },
    { id: "2", name: "Jordan Lee", email: "jordan@example.com", role: "Admin" },
    { id: "3", name: "Sam Patel", email: "sam@example.com", role: "Editor" },
    { id: "4", name: "Riley Kim", email: "riley@example.com", role: "Viewer" },
  ],
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export function TeamSettings() {
  const { isMobile } = useMediaQuery();
  const [saved, setSaved] = useState<Settings>(INITIAL);
  const [values, setValues] = useState<Settings>(INITIAL);
  const [showSaved, setShowSaved] = useState(false);

  const update = (patch: Partial<Settings>) => {
    setValues((current) => ({ ...current, ...patch }));
    setShowSaved(false);
  };
  const updateMember = (id: string, role: Role) =>
    update({
      members: values.members.map((m) => (m.id === id ? { ...m, role } : m)),
    });
  const removeMember = (id: string) =>
    update({ members: values.members.filter((m) => m.id !== id) });

  const nameInvalid = values.name.trim() === "";
  const emailInvalid = !EMAIL_PATTERN.test(values.email.trim());
  const hasErrors = nameInvalid || emailInvalid;
  const isDirty = JSON.stringify(values) !== JSON.stringify(saved);

  const onSave = () => {
    if (hasErrors || !isDirty) return;
    setSaved(values);
    setShowSaved(true);
  };
  const onCancel = () => {
    setValues(saved);
    setShowSaved(false);
  };

  return (
    <Section padding={isMobile ? "600" : "1600"} aria-labelledby="team-settings-title">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
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
        {showSaved && !hasErrors && (
          <Notification role="status" icon={<IconCheckCircle />}>
            Your changes have been saved.
          </Notification>
        )}

        <Form
          onSubmit={(event) => {
            event.preventDefault();
            onSave();
          }}
        >
          <Flex direction="column" alignSecondary="stretch" gap="1200">
            <Fieldset aria-labelledby="profile-heading">
              <TextHeading id="profile-heading">Profile</TextHeading>
              <FieldGroup>
                <InputField
                  label="Full name"
                  value={values.name}
                  onChange={(name) => update({ name })}
                  isRequired
                  isInvalid={nameInvalid}
                  errorMessage="Enter your full name."
                />
                <InputField
                  label="Email"
                  type="email"
                  value={values.email}
                  onChange={(email) => update({ email })}
                  isRequired
                  isInvalid={emailInvalid}
                  errorMessage="Enter a valid email address, like name@example.com."
                />
                <InputField
                  label="Job title"
                  value={values.jobTitle}
                  onChange={(jobTitle) => update({ jobTitle })}
                  description="Shown to teammates next to your name."
                />
              </FieldGroup>
            </Fieldset>

            <Fieldset aria-labelledby="notifications-heading">
              <TextHeading id="notifications-heading">Notifications</TextHeading>
              <SwitchGroup>
                <SwitchField
                  label="Product updates"
                  description="News about features and improvements."
                  isSelected={values.productUpdates}
                  onChange={(productUpdates) => update({ productUpdates })}
                />
                <SwitchField
                  label="Weekly digest"
                  description="A summary of team activity every Monday."
                  isSelected={values.weeklyDigest}
                  onChange={(weeklyDigest) => update({ weeklyDigest })}
                />
                <SwitchField
                  label="Security alerts"
                  description="Always on to keep your account safe."
                  isSelected
                  isDisabled
                />
              </SwitchGroup>
            </Fieldset>

            <Fieldset aria-labelledby="members-heading">
              <TextHeading id="members-heading">Team members</TextHeading>
              <Flex
                direction="column"
                alignSecondary="stretch"
                gap="600"
                role="list"
              >
                {values.members.map((member) => {
                  const isOwner = member.role === "Owner";
                  return (
                    <Flex
                      key={member.id}
                      role="listitem"
                      direction={isMobile ? "column" : "row"}
                      alignPrimary="space-between"
                      alignSecondary={isMobile ? "stretch" : "center"}
                      gap="400"
                    >
                      <Flex alignSecondary="center" gap="300">
                        <Avatar initials={initials(member.name)} />
                        <Flex direction="column">
                          <TextStrong>{member.name}</TextStrong>
                          <Text>{member.email}</Text>
                        </Flex>
                      </Flex>
                      <Flex alignSecondary="end" gap="200">
                        <SelectField
                          aria-label={`Role for ${member.name}`}
                          selectedKey={member.role}
                          onSelectionChange={(key) =>
                            updateMember(member.id, key as Role)
                          }
                          isDisabled={isOwner}
                          disabledKeys={isOwner ? [] : ["Owner"]}
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
                      </Flex>
                    </Flex>
                  );
                })}
              </Flex>
            </Fieldset>

            <ButtonGroup align={isMobile ? "stack" : "end"}>
              <Button variant="neutral" onPress={onCancel}>
                Cancel
              </Button>
              <Button type="submit" isDisabled={!isDirty || hasErrors}>
                Save changes
              </Button>
            </ButtonGroup>
          </Flex>
        </Form>
      </Flex>
    </Section>
  );
}
