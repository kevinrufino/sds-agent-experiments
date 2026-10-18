import { useMediaQuery } from "hooks";
import { IconAlertCircle, IconCheckCircle } from "icons";
import { Flex, Section } from "layout";
import {
  Avatar,
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
  TextSmall,
  TextStrong,
  TextSubtitle,
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
const INITIAL: Settings = {
  name: "Avery Johnson",
  email: "avery@example.com",
  jobTitle: "Product Lead",
  productUpdates: true,
  weeklyDigest: false,
  members: [
    { id: "1", name: "Avery Johnson", email: "avery@example.com", role: "Owner" },
    { id: "2", name: "Sam Rivera", email: "sam@example.com", role: "Admin" },
    { id: "3", name: "Priya Patel", email: "priya@example.com", role: "Editor" },
    { id: "4", name: "Leo Chen", email: "leo@example.com", role: "Viewer" },
  ],
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const initials = (name: string) =>
  name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

export function TeamSettings() {
  const { isMobile } = useMediaQuery();
  const [saved, setSaved] = useState<Settings>(INITIAL);
  const [values, setValues] = useState<Settings>(INITIAL);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const nameError = values.name.trim() ? undefined : "Enter your full name.";
  const emailError = EMAIL_PATTERN.test(values.email.trim())
    ? undefined
    : "Enter a valid email address, like name@example.com.";
  const isInvalid = Boolean(nameError || emailError);
  const isDirty = JSON.stringify(values) !== JSON.stringify(saved);

  const update = (patch: Partial<Settings>) => {
    setValues((current) => ({ ...current, ...patch }));
    setShowConfirmation(false);
  };
  const updateMembers = (fn: (members: Member[]) => Member[]) =>
    update({ members: fn(values.members) });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isDirty || isInvalid) return;
    setSaved(values);
    setShowConfirmation(true);
  };
  const onCancel = () => {
    setValues(saved);
    setShowConfirmation(false);
  };

  return (
    <Section padding={isMobile ? "600" : "1600"} variant="stroke">
      <Flex direction="column" gap="800" container className="team-settings">
        <Flex direction="column" gap="200">
          <TextTitlePage elementType="h1">Team settings</TextTitlePage>
          <TextSubtitle>
            Manage your profile, notifications and who has access to your team.
          </TextSubtitle>
        </Flex>

        <div aria-live="polite" className="team-settings-feedback">
          {isInvalid && (
            <Notification variant="alert" icon={<IconAlertCircle />}>
              <TextStrong>Please fix the highlighted fields before saving.</TextStrong>
            </Notification>
          )}
          {showConfirmation && (
            <Notification icon={<IconCheckCircle />}>
              <TextStrong>Your changes have been saved.</TextStrong>
            </Notification>
          )}
        </div>

        <Form onSubmit={onSubmit} validationBehavior="aria">
          <Flex direction="column" gap="1200">
            <section aria-labelledby="ts-profile">
              <Flex direction="column" gap="600">
                <TextHeading elementType="h2" id="ts-profile">Profile</TextHeading>
                <InputField
                  label="Full name"
                  value={values.name}
                  onChange={(name) => update({ name })}
                  isRequired
                  isInvalid={!!nameError}
                  errorMessage={nameError}
                  autoComplete="name"
                />
                <InputField
                  label="Email"
                  type="email"
                  value={values.email}
                  onChange={(email) => update({ email })}
                  isRequired
                  isInvalid={!!emailError}
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
            </section>

            <section aria-labelledby="ts-notifications">
              <Flex direction="column" gap="600">
                <TextHeading elementType="h2" id="ts-notifications">Notifications</TextHeading>
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
                    description="Always on to keep your account safe."
                    isSelected
                    isDisabled
                  />
                </SwitchGroup>
              </Flex>
            </section>

            <section aria-labelledby="ts-members">
              <Flex direction="column" gap="600">
                <TextHeading elementType="h2" id="ts-members">Team members</TextHeading>
                <ul className="team-members">
                  {values.members.map((member) => {
                    const isOwner = member.role === "Owner";
                    return (
                      <li key={member.id} className="team-member">
                        <Flex
                          direction={isMobile ? "column" : "row"}
                          alignSecondary={isMobile ? "stretch" : "center"}
                          gap="400"
                        >
                          <Flex alignSecondary="center" gap="300" className="team-member-info">
                            <Avatar initials={initials(member.name)} />
                            <Flex direction="column">
                              <Text>{member.name}</Text>
                              <TextSmall>{member.email}</TextSmall>
                            </Flex>
                          </Flex>
                          <Flex alignSecondary="center" gap="300">
                            <SelectField
                              aria-label={`Role for ${member.name}`}
                              selectedKey={member.role}
                              isDisabled={isOwner}
                              onSelectionChange={(key) =>
                                updateMembers((list) =>
                                  list.map((m) => (m.id === member.id ? { ...m, role: key as Role } : m)),
                                )
                              }
                            >
                              {ROLES.filter((role) => isOwner || role !== "Owner").map((role) => (
                                <SelectItem key={role} id={role}>{role}</SelectItem>
                              ))}
                            </SelectField>
                            <ButtonDanger
                              variant="danger-subtle"
                              size="small"
                              aria-label={`Remove ${member.name}`}
                              isDisabled={isOwner}
                              onPress={() => updateMembers((list) => list.filter((m) => m.id !== member.id))}
                            >
                              Remove
                            </ButtonDanger>
                          </Flex>
                        </Flex>
                      </li>
                    );
                  })}
                </ul>
              </Flex>
            </section>

            <ButtonGroup align={isMobile ? "stack" : "end"}>
              <Button variant="neutral" onPress={onCancel}>
                Cancel
              </Button>
              <Button type="submit" isDisabled={!isDirty || isInvalid}>
                Save changes
              </Button>
            </ButtonGroup>
          </Flex>
        </Form>
      </Flex>
    </Section>
  );
}
