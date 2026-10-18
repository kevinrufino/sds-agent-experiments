import { useMediaQuery } from "hooks";
import { IconAlertCircle, IconCheckCircle, IconTrash } from "icons";
import { Flex, Section } from "layout";
import {
  Avatar,
  AvatarBlock,
  Button,
  ButtonDanger,
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
import { useState } from "react";
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
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL: Settings = {
  name: "Avery Johnson",
  email: "avery@example.com",
  jobTitle: "Product Designer",
  productUpdates: true,
  weeklyDigest: false,
  members: [
    { id: "1", name: "Avery Johnson", email: "avery@example.com", role: "Owner" },
    { id: "2", name: "Jordan Lee", email: "jordan@example.com", role: "Admin" },
    { id: "3", name: "Sam Rivera", email: "sam@example.com", role: "Editor" },
    { id: "4", name: "Taylor Kim", email: "taylor@example.com", role: "Viewer" },
  ],
};

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export function TeamSettings() {
  const { isMobile } = useMediaQuery();
  const [saved, setSaved] = useState<Settings>(INITIAL);
  const [form, setForm] = useState<Settings>(INITIAL);
  const [justSaved, setJustSaved] = useState(false);

  const update = (patch: Partial<Settings>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setJustSaved(false);
  };
  const updateMember = (id: string, patch: Partial<Member>) =>
    update({
      members: form.members.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    });

  const emailInvalid = !EMAIL_PATTERN.test(form.email.trim());
  const nameInvalid = form.name.trim() === "";
  const isInvalid = emailInvalid || nameInvalid;
  const isDirty = JSON.stringify(form) !== JSON.stringify(saved);

  const handleSave = () => {
    setSaved(form);
    setJustSaved(true);
  };
  const handleCancel = () => {
    setForm(saved);
    setJustSaved(false);
  };

  return (
    <Section padding={isMobile ? "600" : "1600"} variant="stroke">
      <form
        className="team-settings"
        aria-labelledby="team-settings-title"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (isDirty && !isInvalid) handleSave();
        }}
      >
        <Flex direction="column" gap="1200" alignSecondary="stretch">
          <Flex direction="column" gap="200">
            <TextTitlePage elementType="h1" id="team-settings-title">
              Team settings
            </TextTitlePage>
            <Text>Manage your profile, notifications and who has access.</Text>
          </Flex>

          {isInvalid && (
            <Notification variant="alert" role="alert" icon={<IconAlertCircle />}>
              Please fix the highlighted fields before saving.
            </Notification>
          )}
          {justSaved && !isDirty && (
            <Notification role="status" icon={<IconCheckCircle />}>
              Your changes have been saved.
            </Notification>
          )}

          <section aria-labelledby="profile-heading">
            <Flex direction="column" gap="600" alignSecondary="stretch">
              <TextHeading elementType="h2" id="profile-heading">
                Profile
              </TextHeading>
              <InputField
                label="Full name"
                value={form.name}
                onChange={(name) => update({ name })}
                isRequired
                isInvalid={nameInvalid}
                errorMessage="Enter your full name."
              />
              <InputField
                label="Email"
                type="email"
                value={form.email}
                onChange={(email) => update({ email })}
                isRequired
                isInvalid={emailInvalid}
                errorMessage="Enter a valid email address, like name@example.com."
              />
              <InputField
                label="Job title"
                value={form.jobTitle}
                onChange={(jobTitle) => update({ jobTitle })}
                description="Shown to teammates next to your name."
              />
            </Flex>
          </section>

          <section aria-labelledby="notifications-heading">
            <Flex direction="column" gap="600" alignSecondary="stretch">
              <TextHeading elementType="h2" id="notifications-heading">
                Notifications
              </TextHeading>
              <SwitchGroup>
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
                  description="Always on to keep your account safe."
                  isSelected
                  isDisabled
                />
              </SwitchGroup>
            </Flex>
          </section>

          <section aria-labelledby="members-heading">
            <Flex direction="column" gap="600" alignSecondary="stretch">
              <TextHeading elementType="h2" id="members-heading">
                Team members
              </TextHeading>
              <ul className="team-settings-members">
                {form.members.map((member) => {
                  const isOwner = member.role === "Owner";
                  return (
                    <li key={member.id} className="team-settings-member">
                      <AvatarBlock title={member.name} description={member.email}>
                        <Avatar initials={initialsOf(member.name)} />
                      </AvatarBlock>
                      <div className="team-settings-member-actions">
                        <SelectField
                          aria-label={`Role for ${member.name}`}
                          selectedKey={member.role}
                          onSelectionChange={(key) =>
                            updateMember(member.id, { role: key as Role })
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
                        <ButtonDanger
                          variant="danger-subtle"
                          size="small"
                          aria-label={`Remove ${member.name}`}
                          isDisabled={isOwner}
                          onPress={() =>
                            update({
                              members: form.members.filter((m) => m.id !== member.id),
                            })
                          }
                        >
                          <IconTrash />
                          {!isMobile && "Remove"}
                        </ButtonDanger>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Flex>
          </section>

          <Flex direction={isMobile ? "column-reverse" : "row"} gap="400" alignPrimary="end" alignSecondary={isMobile ? "stretch" : "center"}>
            <Button variant="neutral" onPress={handleCancel} isDisabled={!isDirty}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isDisabled={!isDirty || isInvalid}>
              Save changes
            </Button>
          </Flex>
        </Flex>
      </form>
    </Section>
  );
}
