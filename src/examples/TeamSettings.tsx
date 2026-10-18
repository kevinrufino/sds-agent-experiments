import { useMediaQuery } from "hooks";
import { IconAlertCircle, IconCheckCircle } from "icons";
import { Flex, FlexItem, Section } from "layout";
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
const INITIAL: Settings = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  jobTitle: "",
  productUpdates: true,
  weeklyDigest: false,
  members: [
    {
      id: "ada",
      name: "Ada Lovelace",
      email: "ada@example.com",
      role: "Owner",
    },
    {
      id: "grace",
      name: "Grace Hopper",
      email: "grace@example.com",
      role: "Admin",
    },
    {
      id: "alan",
      name: "Alan Turing",
      email: "alan@example.com",
      role: "Viewer",
    },
  ],
};

/** Team Settings page assembled only from existing SDS primitives and layout components. */
export function TeamSettings() {
  const { isMobile } = useMediaQuery();
  const [saved, setSaved] = useState<Settings>(INITIAL);
  const [values, setValues] = useState<Settings>(INITIAL);
  const [justSaved, setJustSaved] = useState(false);

  const update = (patch: Partial<Settings>) => {
    setValues((current) => ({ ...current, ...patch }));
    setJustSaved(false);
  };
  const updateRole = (id: string, role: Role) =>
    update({
      members: values.members.map((m) => (m.id === id ? { ...m, role } : m)),
    });

  const cancel = () => {
    setValues(saved);
    setJustSaved(false);
  };

  const nameError = values.name.trim() ? undefined : "Enter your full name.";
  const emailError = EMAIL_PATTERN.test(values.email)
    ? undefined
    : "Enter a valid email address.";
  const errorCount = [nameError, emailError].filter(Boolean).length;
  const isDirty = JSON.stringify(values) !== JSON.stringify(saved);

  return (
    <Section
      padding={isMobile ? "600" : "1600"}
      aria-labelledby="team-settings-title"
    >
      <Form
        validationBehavior="aria"
        onSubmit={(event) => {
          event.preventDefault();
          if (errorCount || !isDirty) return;
          setSaved(values);
          setJustSaved(true);
        }}
      >
        <Flex
          direction="column"
          alignSecondary="stretch"
          gap={isMobile ? "800" : "1200"}
          container
        >
          <Flex direction="column" gap="200">
            <TextTitlePage id="team-settings-title" elementType="h1">
              Team settings
            </TextTitlePage>
            <TextSubtitle>
              Manage your profile, notifications, and team members.
            </TextSubtitle>
          </Flex>

          {errorCount > 0 && (
            <Notification
              variant="alert"
              role="alert"
              icon={<IconAlertCircle />}
            >
              <Text>
                {errorCount === 1
                  ? "1 field needs"
                  : `${errorCount} fields need`}{" "}
                attention before you can save.
              </Text>
            </Notification>
          )}
          {justSaved && (
            <Notification
              variant="message"
              role="status"
              icon={<IconCheckCircle />}
            >
              <Text>Your changes have been saved.</Text>
            </Notification>
          )}

          <section aria-labelledby="profile-heading">
            <Flex direction="column" alignSecondary="stretch" gap="600">
              <TextHeading id="profile-heading" elementType="h2">
                Profile
              </TextHeading>
              <InputField
                label="Full name"
                value={values.name}
                onChange={(name) => update({ name })}
                isInvalid={!!nameError}
                errorMessage={nameError}
              />
              <InputField
                label="Email"
                type="email"
                value={values.email}
                onChange={(email) => update({ email })}
                isInvalid={!!emailError}
                errorMessage={emailError}
              />
              <InputField
                label="Job title"
                placeholder="e.g. Engineering manager"
                description="Shown to teammates on your profile."
                value={values.jobTitle}
                onChange={(jobTitle) => update({ jobTitle })}
              />
            </Flex>
          </section>

          <section aria-labelledby="notifications-heading">
            <Flex direction="column" alignSecondary="stretch" gap="600">
              <TextHeading id="notifications-heading" elementType="h2">
                Notifications
              </TextHeading>
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
                  description="Always on for workspace admins."
                  isSelected
                  isDisabled
                />
              </SwitchGroup>
            </Flex>
          </section>

          <section aria-labelledby="members-heading">
            <Flex direction="column" alignSecondary="stretch" gap="600">
              <TextHeading id="members-heading" elementType="h2">
                Team members
              </TextHeading>
              {values.members.map((member) => {
                const isOwner = member.role === "Owner";
                return (
                  <Flex
                    key={member.id}
                    direction={isMobile ? "column" : "row"}
                    alignSecondary={isMobile ? "stretch" : "center"}
                    gap="400"
                  >
                    <FlexItem size="fill">
                      <AvatarBlock
                        title={member.name}
                        description={member.email}
                      >
                        <Avatar initials={member.name.charAt(0)} />
                      </AvatarBlock>
                    </FlexItem>
                    <FlexItem>
                      <SelectField
                        aria-label={`Role for ${member.name}`}
                        selectedKey={member.role}
                        onSelectionChange={(key) =>
                          updateRole(member.id, key as Role)
                        }
                        disabledKeys={isOwner ? [] : ["Owner"]}
                        isDisabled={isOwner}
                      >
                        {ROLES.map((role) => (
                          <SelectItem key={role} id={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectField>
                    </FlexItem>
                    <ButtonDanger
                      variant="danger-subtle"
                      size="small"
                      isDisabled={isOwner}
                      aria-label={
                        isOwner
                          ? "The owner cannot be removed"
                          : `Remove ${member.name}`
                      }
                      onPress={() =>
                        update({
                          members: values.members.filter(
                            (m) => m.id !== member.id,
                          ),
                        })
                      }
                    >
                      Remove
                    </ButtonDanger>
                  </Flex>
                );
              })}
            </Flex>
          </section>

          <ButtonGroup align={isMobile ? "stack" : "end"}>
            <Button variant="neutral" onPress={cancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isDisabled={!isDirty || errorCount > 0}
            >
              Save changes
            </Button>
          </ButtonGroup>
        </Flex>
      </Form>
    </Section>
  );
}
