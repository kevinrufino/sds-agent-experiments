import { useRef, useState, type FormEvent } from "react";
import { useMediaQuery } from "hooks";
import { Flex, FlexItem, Section } from "layout";
import { Button, ButtonDanger } from "./ui/primitives/Button/Button";
import { InputField } from "./ui/primitives/Input/Input";
import { SelectField, SelectItem } from "./ui/primitives/Select/Select";
import { SwitchField } from "./ui/primitives/Switch/Switch";
import {
  Text,
  TextHeading,
  TextSmall,
  TextStrong,
  TextTitlePage,
} from "./ui/primitives/Text/Text";

const roles = ["Admin", "Editor", "Viewer"] as const;
type Role = (typeof roles)[number];
type Member = { id: string; name: string; email: string; role: Role };
type Settings = {
  name: string;
  email: string;
  notifications: boolean;
  members: Member[];
};

const initialSettings: Settings = {
  name: "Studio team",
  email: "team@example.com",
  notifications: true,
  members: [
    { id: "alex", name: "Alex Morgan", email: "alex@example.com", role: "Admin" },
    { id: "sam", name: "Sam Rivera", email: "sam@example.com", role: "Editor" },
  ],
};

function App() {
  const { isMobile } = useMediaQuery();
  const [settings, setSettings] = useState(initialSettings);
  const [attemptedSave, setAttemptedSave] = useState(false);
  const [message, setMessage] = useState("");
  const saveButton = useRef<HTMLElement>(null);
  const emailInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email);

  function update(changes: Partial<Settings>) {
    setSettings((current) => ({ ...current, ...changes }));
    setMessage("");
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttemptedSave(true);
    if (emailInvalid) {
      setMessage("Settings were not saved. Check the email address.");
      event.currentTarget.querySelector<HTMLInputElement>('input[name="email"]')?.focus();
      return;
    }
    setMessage("Team settings saved locally.");
  }

  function cancel() {
    setSettings(initialSettings);
    setAttemptedSave(false);
    setMessage("Changes canceled. Initial settings restored.");
  }

  return (
    <main>
      <Section padding={isMobile ? "600" : "1600"} variant="subtle">
        <Flex container direction="column" gap="800" alignSecondary="stretch">
          <Flex direction="column" gap="200">
            <TextTitlePage elementType="h1">Team Settings</TextTitlePage>
            <Text>Manage your team details, notifications, and member access.</Text>
            <TextSmall>Changes are stored only for this session.</TextSmall>
          </Flex>
          <form onSubmit={save} noValidate aria-label="Team settings">
            <Flex direction="column" gap="800" alignSecondary="stretch">
              <Flex direction="column" gap="400" alignSecondary="stretch">
                <TextHeading elementType="h2">Team details</TextHeading>
                <Flex
                  direction={isMobile ? "column" : "row"}
                  alignSecondary="stretch"
                  alignPrimary="stretch"
                  gap="600"
                >
                  <InputField
                    label="Team name"
                    name="teamName"
                    value={settings.name}
                    onChange={(name) => update({ name })}
                  />
                  <InputField
                    label="Team email"
                    name="email"
                    type="email"
                    value={settings.email}
                    onChange={(email) => update({ email })}
                    isRequired
                    validationBehavior="aria"
                    isInvalid={attemptedSave && emailInvalid}
                    errorMessage="Enter a valid email address, such as team@example.com."
                    description="Where we send team updates."
                  />
                </Flex>
              </Flex>

              <Flex direction="column" gap="400" alignSecondary="stretch">
                <TextHeading elementType="h2">Notifications</TextHeading>
                <SwitchField
                  label="Email notifications"
                  description="Receive updates about team activity."
                  isSelected={settings.notifications}
                  onChange={(notifications) => update({ notifications })}
                />
              </Flex>

              <Flex direction="column" gap="600" alignSecondary="stretch">
                <Flex
                  direction={isMobile ? "column" : "row"}
                  alignPrimary="space-between"
                  alignSecondary={isMobile ? "stretch" : "center"}
                  gap="400"
                >
                  <Flex direction="column" gap="200">
                    <TextHeading elementType="h2">Team members</TextHeading>
                    <TextSmall>Role changes and removals apply when you save.</TextSmall>
                  </Flex>
                  <Button type="button" variant="neutral" isDisabled>
                    Invite member
                  </Button>
                </Flex>
                <TextSmall>Invitations are unavailable in this local demo.</TextSmall>
                {settings.members.map((member) => (
                  <Flex
                    key={member.id}
                    role="group"
                    aria-label={member.name}
                    direction={isMobile ? "column" : "row"}
                    alignSecondary={isMobile ? "stretch" : "center"}
                    gap="600"
                  >
                    <FlexItem size="fill">
                      <Flex direction="column" gap="100">
                        <TextStrong>{member.name}</TextStrong>
                        <TextSmall>{member.email}</TextSmall>
                      </Flex>
                    </FlexItem>
                    <FlexItem size="fill">
                      <SelectField
                        label={`Role for ${member.name}`}
                        selectedKey={member.role}
                        onSelectionChange={(key) => {
                          if (!roles.includes(key as Role)) return;
                          update({
                            members: settings.members.map((item) =>
                              item.id === member.id ? { ...item, role: key as Role } : item,
                            ),
                          });
                        }}
                      >
                        {roles.map((role) => <SelectItem key={role} id={role}>{role}</SelectItem>)}
                      </SelectField>
                    </FlexItem>
                    <ButtonDanger
                      type="button"
                      variant="danger-subtle"
                      aria-label={`Remove ${member.name}`}
                      onPress={() => {
                        update({ members: settings.members.filter((item) => item.id !== member.id) });
                        setMessage(`${member.name} marked for removal. Save to apply or Cancel to restore.`);
                        saveButton.current?.focus();
                      }}
                    >
                      Remove
                    </ButtonDanger>
                  </Flex>
                ))}
                {settings.members.length === 0 && <Text>No team members. Cancel to restore them.</Text>}
              </Flex>

              <Flex direction={isMobile ? "column" : "row"} gap="400" alignSecondary="stretch">
                <Button ref={saveButton} type="submit">Save</Button>
                <Button type="button" variant="neutral" onPress={cancel}>Cancel</Button>
              </Flex>
              <Text role="status" aria-live="polite" aria-atomic="true">{message}</Text>
            </Flex>
          </form>
        </Flex>
      </Section>
    </main>
  );
}

export default App;
