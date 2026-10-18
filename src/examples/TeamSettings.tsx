import { Card } from "compositions";
import { useMediaQuery } from "hooks";
import { IconAlertCircle, IconCheckCircle } from "icons";
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
  TextStrong,
  TextSubtitle,
  TextTitlePage,
} from "primitives";
import { FormEvent, useState } from "react";

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

const INITIAL_SETTINGS: Settings = {
  name: "Avery Johnson",
  email: "avery@example.com",
  jobTitle: "Product designer",
  productUpdates: true,
  weeklyDigest: false,
  members: [
    { id: "1", name: "Avery Johnson", email: "avery@example.com", role: "Owner" },
    { id: "2", name: "Sam Lee", email: "sam@example.com", role: "Admin" },
    { id: "3", name: "Priya Patel", email: "priya@example.com", role: "Editor" },
    { id: "4", name: "Jordan Kim", email: "jordan@example.com", role: "Viewer" },
  ],
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const initials = (name: string) =>
  name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

export function TeamSettings() {
  const { isMobile } = useMediaQuery();
  const [saved, setSaved] = useState<Settings>(INITIAL_SETTINGS);
  const [values, setValues] = useState<Settings>(INITIAL_SETTINGS);
  const [justSaved, setJustSaved] = useState(false);

  const update = (patch: Partial<Settings>) => {
    setValues((current) => ({ ...current, ...patch }));
    setJustSaved(false);
  };
  const updateMembers = (fn: (members: Member[]) => Member[]) =>
    update({ members: fn(values.members) });

  const nameError = values.name.trim() ? undefined : "Enter your full name.";
  const emailError = EMAIL_PATTERN.test(values.email.trim())
    ? undefined
    : "Enter a valid email address, like name@example.com.";
  const isInvalid = Boolean(nameError || emailError);
  const isDirty = JSON.stringify(values) !== JSON.stringify(saved);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isInvalid || !isDirty) return;
    setSaved(values);
    setJustSaved(true);
  };
  const onCancel = () => {
    setValues(saved);
    setJustSaved(false);
  };

  return (
    <Section padding={isMobile ? "600" : "1600"} variant="subtle">
      <Form onSubmit={onSubmit} validationBehavior="aria" aria-labelledby="team-settings-title">
        <Flex container direction="column" alignSecondary="stretch" gap={isMobile ? "600" : "800"}>
          <Flex direction="column" gap="200">
            <TextTitlePage elementType="h1" id="team-settings-title">Team settings</TextTitlePage>
            <TextSubtitle>Manage your profile, notifications and who has access to your team.</TextSubtitle>
          </Flex>

          {isInvalid && (
            <Notification variant="alert" role="alert" icon={<IconAlertCircle size="20" />}>
              <TextStrong>Please fix the errors below</TextStrong>
              <Text>Your changes can’t be saved until every field is valid.</Text>
            </Notification>
          )}
          {justSaved && (
            <Notification role="status" icon={<IconCheckCircle size="20" />}>
              <TextStrong>Changes saved</TextStrong>
              <Text>Your team settings have been updated.</Text>
            </Notification>
          )}

          <Card variant="stroke" padding="600" aria-labelledby="profile-heading" role="region">
            <Flex direction="column" alignSecondary="stretch" gap="600">
              <TextHeading elementType="h2" id="profile-heading">Profile</TextHeading>
              <InputField
                label="Full name"
                isRequired
                value={values.name}
                onChange={(name) => update({ name })}
                isInvalid={Boolean(nameError)}
                errorMessage={nameError}
                autoComplete="name"
              />
              <InputField
                label="Email"
                type="email"
                isRequired
                value={values.email}
                onChange={(email) => update({ email })}
                isInvalid={Boolean(emailError)}
                errorMessage={emailError}
                autoComplete="email"
              />
              <InputField
                label="Job title"
                description="Shown to teammates next to your name."
                value={values.jobTitle}
                onChange={(jobTitle) => update({ jobTitle })}
                autoComplete="organization-title"
              />
            </Flex>
          </Card>

          <Card variant="stroke" padding="600" aria-labelledby="notifications-heading" role="region">
            <Flex direction="column" alignSecondary="stretch" gap="600">
              <TextHeading elementType="h2" id="notifications-heading">Notifications</TextHeading>
              <SwitchGroup>
                <SwitchField
                  label="Product updates"
                  description="News about new features and improvements."
                  isSelected={values.productUpdates}
                  onChange={(productUpdates) => update({ productUpdates })}
                />
                <SwitchField
                  label="Weekly digest"
                  description="A summary of your team’s activity every Monday."
                  isSelected={values.weeklyDigest}
                  onChange={(weeklyDigest) => update({ weeklyDigest })}
                />
                <SwitchField
                  label="Security alerts"
                  description="Always on. We’ll always tell you about sign-ins and security changes."
                  isSelected
                  isDisabled
                />
              </SwitchGroup>
            </Flex>
          </Card>

          <Card variant="stroke" padding="600" aria-labelledby="members-heading" role="region">
            <Flex direction="column" alignSecondary="stretch" gap="600">
              <TextHeading elementType="h2" id="members-heading">Team members</TextHeading>
              <Flex direction="column" alignSecondary="stretch" gap="600" role="list">
                {values.members.map((member) => {
                  const isOwner = member.role === "Owner";
                  return (
                    <Flex
                      key={member.id}
                      role="listitem"
                      direction={isMobile ? "column" : "row"}
                      alignPrimary={isMobile ? "start" : "space-between"}
                      alignSecondary={isMobile ? "stretch" : "center"}
                      gap="400"
                    >
                      <AvatarBlock title={member.name} description={member.email}>
                        <Avatar initials={initials(member.name)} />
                      </AvatarBlock>
                      <Flex direction="row" alignSecondary="end" gap="400">
                        <SelectField
                          label={`Role for ${member.name}`}
                          selectedKey={member.role}
                          isDisabled={isOwner}
                          disabledKeys={["Owner"]}
                          onSelectionChange={(key) =>
                            updateMembers((members) =>
                              members.map((m) => (m.id === member.id ? { ...m, role: key as Role } : m)),
                            )
                          }
                        >
                          {ROLES.map((role) => (
                            <SelectItem key={role} id={role}>{role}</SelectItem>
                          ))}
                        </SelectField>
                        <ButtonDanger
                          variant="danger-subtle"
                          isDisabled={isOwner}
                          aria-label={isOwner ? `${member.name} is the owner and can’t be removed` : `Remove ${member.name}`}
                          onPress={() => updateMembers((members) => members.filter((m) => m.id !== member.id))}
                        >
                          Remove
                        </ButtonDanger>
                      </Flex>
                    </Flex>
                  );
                })}
              </Flex>
            </Flex>
          </Card>

          <ButtonGroup align={isMobile ? "stack" : "end"}>
            <Button type="button" variant="neutral" onPress={onCancel} isDisabled={!isDirty}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isDisabled={!isDirty || isInvalid}>
              Save changes
            </Button>
          </ButtonGroup>
        </Flex>
      </Form>
    </Section>
  );
}
