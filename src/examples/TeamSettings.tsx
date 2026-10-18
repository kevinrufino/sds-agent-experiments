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
import { useState } from "react";

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

const INITIAL: Settings = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  jobTitle: "Engineering lead",
  productUpdates: true,
  weeklyDigest: false,
  members: [
    { id: "1", name: "Ada Lovelace", email: "ada@example.com", role: "owner" },
    {
      id: "2",
      name: "Grace Hopper",
      email: "grace@example.com",
      role: "admin",
    },
    { id: "3", name: "Alan Turing", email: "alan@example.com", role: "editor" },
    {
      id: "4",
      name: "Linus Pauling",
      email: "linus@example.com",
      role: "viewer",
    },
  ],
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function MemberRow({
  member,
  onRoleChange,
  onRemove,
}: {
  member: Member;
  onRoleChange: (role: Role) => void;
  onRemove: () => void;
}) {
  const { isMobile } = useMediaQuery();
  const isOwner = member.role === "owner";
  return (
    <Flex
      role="listitem"
      direction={isMobile ? "column" : "row"}
      alignPrimary="space-between"
      alignSecondary={isMobile ? "stretch" : "center"}
      gap="400"
    >
      <AvatarBlock title={member.name} description={member.email}>
        <Avatar initials={member.name.charAt(0)} />
      </AvatarBlock>
      <Flex gap="400" alignSecondary="end" wrap>
        <SelectField
          label={`Role for ${member.name}`}
          selectedKey={member.role}
          onSelectionChange={(key) => key && onRoleChange(key as Role)}
          isDisabled={isOwner}
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
          onPress={onRemove}
          aria-label={`Remove ${member.name}`}
        >
          Remove
        </ButtonDanger>
      </Flex>
    </Flex>
  );
}

export function TeamSettings() {
  const { isMobile } = useMediaQuery();
  const [values, setValues] = useState<Settings>(INITIAL);
  const [saved, setSaved] = useState<Settings>(INITIAL);
  const [showSaved, setShowSaved] = useState(false);

  const update = (patch: Partial<Settings>) => {
    setValues((prev) => ({ ...prev, ...patch }));
    setShowSaved(false);
  };
  const updateMembers = (fn: (members: Member[]) => Member[]) =>
    update({ members: fn(values.members) });

  const emailInvalid = !EMAIL_PATTERN.test(values.email.trim());
  const nameInvalid = values.name.trim() === "";
  const isInvalid = emailInvalid || nameInvalid;
  const isDirty = JSON.stringify(values) !== JSON.stringify(saved);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isInvalid || !isDirty) return;
    setSaved(values);
    setShowSaved(true);
  };

  return (
    <Section padding={isMobile ? "600" : "1600"} variant="neutral">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
        <TextContentTitle
          title="Team settings"
          subtitle="Manage your profile, notifications and who has access to your team."
        />

        {isInvalid && (
          <Notification variant="alert" icon={<IconAlertCircle />} role="alert">
            Please fix the highlighted fields before saving.
          </Notification>
        )}
        {showSaved && (
          <Notification
            variant="message"
            icon={<IconCheckCircle />}
            role="status"
          >
            Your changes have been saved.
          </Notification>
        )}

        <Form onSubmit={handleSubmit} validationBehavior="aria">
          <Flex direction="column" alignSecondary="stretch" gap="1200">
            <Flex direction="column" alignSecondary="stretch" gap="400">
              <TextHeading elementType="h2">Profile</TextHeading>
              <InputField
                label="Full name"
                value={values.name}
                onChange={(name) => update({ name })}
                isInvalid={nameInvalid}
                errorMessage="Enter your full name."
                isRequired
              />
              <InputField
                label="Email"
                type="email"
                value={values.email}
                onChange={(email) => update({ email })}
                isInvalid={emailInvalid}
                errorMessage="Enter a valid email address, like name@example.com."
                isRequired
              />
              <InputField
                label="Job title"
                value={values.jobTitle}
                onChange={(jobTitle) => update({ jobTitle })}
                description="Shown to teammates next to your name."
              />
            </Flex>

            <Flex direction="column" alignSecondary="stretch" gap="400">
              <TextHeading elementType="h2">Notifications</TextHeading>
              <Fieldset>
                <Legend>Email me about</Legend>
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
              </Fieldset>
            </Flex>

            <Flex direction="column" alignSecondary="stretch" gap="400">
              <TextHeading elementType="h2">Team members</TextHeading>
              <Text>
                The owner's role can't be changed and they can't be removed.
              </Text>
              <Flex
                role="list"
                direction="column"
                alignSecondary="stretch"
                gap="600"
              >
                {values.members.map((member) => (
                  <MemberRow
                    key={member.id}
                    member={member}
                    onRoleChange={(role) =>
                      updateMembers((list) =>
                        list.map((m) =>
                          m.id === member.id ? { ...m, role } : m,
                        ),
                      )
                    }
                    onRemove={() =>
                      updateMembers((list) =>
                        list.filter((m) => m.id !== member.id),
                      )
                    }
                  />
                ))}
              </Flex>
            </Flex>

            <ButtonGroup align={isMobile ? "stack" : "end"}>
              <Button
                variant="neutral"
                isDisabled={!isDirty}
                onPress={() => {
                  setValues(saved);
                  setShowSaved(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isDisabled={!isDirty || isInvalid}
              >
                Save changes
              </Button>
            </ButtonGroup>
          </Flex>
        </Form>
      </Flex>
    </Section>
  );
}
