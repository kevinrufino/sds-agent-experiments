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
  TextContentHeading,
  TextContentTitle,
} from "primitives";
import { FormEvent, useState } from "react";

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
  name: "Avery Johnson",
  email: "avery@example.com",
  jobTitle: "Product designer",
  productUpdates: true,
  weeklyDigest: false,
  members: [
    { id: "1", name: "Avery Johnson", email: "avery@example.com", role: "owner" },
    { id: "2", name: "Blake Rivera", email: "blake@example.com", role: "admin" },
    { id: "3", name: "Casey Kim", email: "casey@example.com", role: "editor" },
    { id: "4", name: "Devon Patel", email: "devon@example.com", role: "viewer" },
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
      direction={isMobile ? "column" : "row"}
      gap="400"
      alignPrimary={isMobile ? "start" : "space-between"}
      alignSecondary={isMobile ? "stretch" : "center"}
    >
      <AvatarBlock title={member.name} description={member.email}>
        <Avatar initials={member.name.charAt(0)} />
      </AvatarBlock>
      <Flex gap="200" alignSecondary="end" wrap>
        <SelectField
          label={`Role for ${member.name}`}
          selectedKey={member.role}
          onSelectionChange={(key) => onRoleChange(key as Role)}
          isDisabled={isOwner}
          description={isOwner ? "The owner's role can't be changed" : undefined}
        >
          {ROLES.filter((r) => isOwner || r.id !== "owner").map((r) => (
            <SelectItem key={r.id} id={r.id}>
              {r.label}
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
  const [saved, setSaved] = useState<Settings>(INITIAL);
  const [values, setValues] = useState<Settings>(INITIAL);
  const [showSaved, setShowSaved] = useState(false);

  const update = (patch: Partial<Settings>) => {
    setValues((v) => ({ ...v, ...patch }));
    setShowSaved(false);
  };
  const updateMembers = (fn: (m: Member[]) => Member[]) =>
    update({ members: fn(values.members) });

  const emailInvalid = !EMAIL_PATTERN.test(values.email.trim());
  const nameInvalid = values.name.trim() === "";
  const isInvalid = emailInvalid || nameInvalid;
  const isDirty = JSON.stringify(values) !== JSON.stringify(saved);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isInvalid || !isDirty) return;
    setSaved(values);
    setShowSaved(true);
  };

  const onCancel = () => {
    setValues(saved);
    setShowSaved(false);
  };

  return (
    <Section padding="1200" aria-label="Team settings">
      <Form onSubmit={onSubmit} validationBehavior="aria">
        <Flex direction="column" gap="1200">
          <TextContentTitle
            title="Team settings"
            subtitle="Manage your profile, notifications and who has access to your team."
          />

          <div aria-live="polite">
            {isInvalid && (
              <Notification variant="alert" icon={<IconAlertCircle />}>
                Please fix the highlighted fields before saving.
              </Notification>
            )}
            {showSaved && !isInvalid && (
              <Notification variant="message" icon={<IconCheckCircle />}>
                Your changes have been saved.
              </Notification>
            )}
          </div>

          <Flex direction="column" gap="600">
            <TextContentHeading heading="Profile" subheading="How you appear to your team." />
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
              description="Shown next to your name in team lists."
            />
          </Flex>

          <Flex direction="column" gap="600">
            <TextContentHeading heading="Notifications" subheading="Choose what we email you about." />
            <SwitchGroup>
              <SwitchField
                label="Product updates"
                description="News about features and improvements."
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

          <Flex direction="column" gap="600">
            <TextContentHeading heading="Team members" subheading="Manage roles and access." />
            {values.members.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                onRoleChange={(role) =>
                  updateMembers((ms) => ms.map((m) => (m.id === member.id ? { ...m, role } : m)))
                }
                onRemove={() => updateMembers((ms) => ms.filter((m) => m.id !== member.id))}
              />
            ))}
          </Flex>

          <ButtonGroup align="end">
            <Button variant="neutral" onPress={onCancel} isDisabled={!isDirty}>
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
