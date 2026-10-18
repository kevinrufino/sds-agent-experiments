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
  TextHeading,
  TextStrong,
  TextSubtitle,
  TextTitleHero,
  TextTitlePage,
} from "primitives";
import { FormEvent, useState } from "react";
import "./team-settings.css";

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
  fullName: "Ada Lovelace",
  email: "ada@example.com",
  jobTitle: "",
  productUpdates: true,
  weeklyDigest: false,
  members: [
    { id: "1", name: "Ada Lovelace", email: "ada@example.com", role: "Owner" },
    { id: "2", name: "Grace Hopper", email: "grace@example.com", role: "Admin" },
    { id: "3", name: "Alan Turing", email: "alan@example.com", role: "Viewer" },
  ],
};

export function TeamSettings() {
  const { isMobile } = useMediaQuery();
  const [saved, setSaved] = useState<Settings>(INITIAL_SETTINGS);
  const [values, setValues] = useState<Settings>(INITIAL_SETTINGS);
  const [showSaved, setShowSaved] = useState(false);

  const emailInvalid = !EMAIL_PATTERN.test(values.email.trim());
  const isDirty = JSON.stringify(values) !== JSON.stringify(saved);

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

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isDirty || emailInvalid) return;
    setSaved(values);
    setShowSaved(true);
  };
  const onCancel = () => {
    setValues(saved);
    setShowSaved(false);
  };

  const Title = isMobile ? TextTitlePage : TextTitleHero;

  return (
    <Section padding={isMobile ? "600" : "1600"} variant="subtle">
      <form onSubmit={onSubmit} noValidate aria-labelledby="team-settings-title">
        <Flex container direction="column" alignSecondary="stretch" gap={isMobile ? "800" : "1200"}>
          <Flex direction="column" gap="200">
            <Title elementType="h1" id="team-settings-title">
              Team settings
            </Title>
            <TextSubtitle>
              Manage your profile, notifications, and team members.
            </TextSubtitle>
          </Flex>

          {emailInvalid && (
            <Notification variant="alert" icon={<IconInfo />} role="alert">
              <TextStrong>1 field needs attention</TextStrong>
              <Text>Fix the highlighted email address before saving.</Text>
            </Notification>
          )}
          {showSaved && !isDirty && (
            <Notification icon={<IconCheckCircle />} role="status">
              <TextStrong>Changes saved</TextStrong>
              <Text>Your team settings have been updated.</Text>
            </Notification>
          )}

          <Flex direction="column" alignSecondary="stretch" gap="600">
            <TextHeading elementType="h2">Profile</TextHeading>
            <InputField
              label="Full name"
              value={values.fullName}
              onChange={(fullName) => update({ fullName })}
            />
            <InputField
              label="Email"
              type="email"
              isRequired
              validationBehavior="aria"
              value={values.email}
              onChange={(email) => update({ email })}
              isInvalid={emailInvalid}
              errorMessage="Enter a valid email address."
            />
            <InputField
              label="Job title"
              description="Shown to teammates on your profile."
              placeholder="e.g. Engineering manager"
              value={values.jobTitle}
              onChange={(jobTitle) => update({ jobTitle })}
            />
          </Flex>

          <Flex direction="column" alignSecondary="stretch" gap="600">
            <TextHeading elementType="h2">Notifications</TextHeading>
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
              description="Always on for workspace admins."
              isSelected
              isDisabled
            />
          </Flex>

          <Flex direction="column" alignSecondary="stretch" gap="600">
            <TextHeading elementType="h2">Team members</TextHeading>
            <ul className="team-settings-members">
              {values.members.map((member) => {
                const isOwner = member.role === "Owner";
                return (
                  <li key={member.id} className="team-settings-member">
                    <AvatarBlock
                      className="team-settings-member-info"
                      title={member.name}
                      description={member.email}
                    >
                      <Avatar src={placeholder} size="large" />
                    </AvatarBlock>
                    <SelectField
                      className="team-settings-member-role"
                      aria-label={`Role for ${member.name}`}
                      selectedKey={member.role}
                      onSelectionChange={(key) => updateMember(member.id, key as Role)}
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
                      onPress={() => removeMember(member.id)}
                    >
                      Remove
                    </ButtonDanger>
                  </li>
                );
              })}
            </ul>
          </Flex>

          <ButtonGroup align="end">
            <Button type="button" variant="neutral" onPress={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isDisabled={!isDirty || emailInvalid}>
              Save changes
            </Button>
          </ButtonGroup>
        </Flex>
      </form>
    </Section>
  );
}
