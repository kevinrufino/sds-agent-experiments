import { useState } from "react";
import { useMediaQuery } from "hooks";
import { Flex, Section } from "layout";
import {
  Button,
  ButtonDanger,
  ButtonGroup,
  Form,
  InputField,
  Notification,
  SelectField,
  SelectItem,
  SwitchField,
  Text,
  TextHeading,
  TextSmall,
  TextStrong,
  TextTitlePage,
} from "primitives";

type Member = { id: string; name: string; email: string; role: string };
type Settings = {
  name: string;
  email: string;
  notifications: boolean;
  members: Member[];
};

const initialSettings: Settings = {
  name: "Studio North",
  email: "team@studionorth.example",
  notifications: true,
  members: [
    { id: "maya", name: "Maya Chen", email: "maya@studionorth.example", role: "admin" },
    { id: "alex", name: "Alex Rivera", email: "alex@studionorth.example", role: "member" },
  ],
};

function App() {
  const { isMobile } = useMediaQuery();
  const [saved, setSaved] = useState(initialSettings);
  const [draft, setDraft] = useState(initialSettings);
  const [attemptedSave, setAttemptedSave] = useState(false);
  const [feedback, setFeedback] = useState("");
  const emailInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim());

  function updateDraft(patch: Partial<Settings>) {
    setDraft((current) => ({ ...current, ...patch }));
    setFeedback("");
  }

  function save() {
    setAttemptedSave(true);
    if (emailInvalid) {
      setFeedback("");
      return;
    }
    const next = { ...draft, email: draft.email.trim() };
    setSaved(next);
    setDraft(next);
    setAttemptedSave(false);
    setFeedback("Team settings saved successfully.");
  }

  function cancel() {
    setDraft(saved);
    setAttemptedSave(false);
    setFeedback("Changes canceled. Your saved settings have been restored.");
  }

  return (
    <main>
      <Section padding={isMobile ? "600" : "1600"} variant="subtle">
        <Flex container direction="column" alignSecondary="stretch" gap="800">
          <Flex direction="column" gap="200">
            <TextTitlePage elementType="h1">Team Settings</TextTitlePage>
            <Text>Manage your team details, notifications, and member access.</Text>
            <TextSmall>Changes are saved locally for this session.</TextSmall>
          </Flex>

          <Form
            aria-label="Team settings"
            validationBehavior="aria"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              save();
            }}
          >
            <Flex direction="column" alignSecondary="stretch" gap="800">
              <Section variant="stroke" padding="600" aria-labelledby="details-heading">
                <Flex direction="column" alignSecondary="stretch" gap="600">
                  <TextHeading elementType="h2" id="details-heading">Team details</TextHeading>
                  <Flex
                    direction={isMobile ? "column" : "row"}
                    type={isMobile ? "auto" : "half"}
                    alignSecondary="stretch"
                    gap="600"
                  >
                    <InputField
                      label="Team name"
                      name="teamName"
                      value={draft.name}
                      onChange={(name) => updateDraft({ name })}
                    />
                    <InputField
                      label="Team email"
                      name="teamEmail"
                      type="email"
                      value={draft.email}
                      onChange={(email) => updateDraft({ email })}
                      validationBehavior="aria"
                      isInvalid={attemptedSave && emailInvalid}
                      errorMessage="Enter a valid email address, such as team@example.com."
                      description="The contact address for your team."
                    />
                  </Flex>
                  <SwitchField
                    label="Email notifications"
                    description="Receive updates about your team's activity."
                    isSelected={draft.notifications}
                    onChange={(notifications) => updateDraft({ notifications })}
                  />
                </Flex>
              </Section>

              <Section variant="stroke" padding="600" aria-labelledby="members-heading">
                <Flex direction="column" alignSecondary="stretch" gap="600">
                  <Flex
                    direction={isMobile ? "column" : "row"}
                    alignPrimary="space-between"
                    alignSecondary={isMobile ? "stretch" : "center"}
                    gap="400"
                  >
                    <Flex direction="column" gap="200">
                      <TextHeading elementType="h2" id="members-heading">Team members</TextHeading>
                      <TextSmall>Role changes and removals take effect when you save.</TextSmall>
                    </Flex>
                    <Button type="button" variant="neutral" isDisabled>Invite member</Button>
                  </Flex>
                  <TextSmall>Invitations are currently unavailable.</TextSmall>
                  {draft.members.map((member) => (
                    <Flex
                      key={member.id}
                      direction={isMobile ? "column" : "row"}
                      alignPrimary="space-between"
                      alignSecondary={isMobile ? "stretch" : "center"}
                      gap="400"
                    >
                      <Flex direction="column" gap="100">
                        <TextStrong>{member.name}</TextStrong>
                        <TextSmall>{member.email}</TextSmall>
                      </Flex>
                      <SelectField
                        label={`Role for ${member.name}`}
                        selectedKey={member.role}
                        onSelectionChange={(role) => {
                          if (role !== null) updateDraft({
                            members: draft.members.map((item) =>
                              item.id === member.id ? { ...item, role: String(role) } : item,
                            ),
                          });
                        }}
                      >
                        <SelectItem id="admin">Admin</SelectItem>
                        <SelectItem id="member">Member</SelectItem>
                        <SelectItem id="viewer">Viewer</SelectItem>
                      </SelectField>
                      <ButtonDanger
                        type="button"
                        variant="danger-subtle"
                        aria-label={`Remove ${member.name}`}
                        onPress={() => updateDraft({
                          members: draft.members.filter((item) => item.id !== member.id),
                        })}
                      >Remove member</ButtonDanger>
                    </Flex>
                  ))}
                  {draft.members.length === 0 && <Text>No team members. Cancel to restore unsaved removals.</Text>}
                </Flex>
              </Section>

              {attemptedSave && emailInvalid && (
                <Notification variant="alert" role="alert">
                  Settings were not saved. Enter a valid team email address.
                </Notification>
              )}
              <div role="status" aria-live="polite">
                {feedback && <Notification>{feedback}</Notification>}
              </div>
              <ButtonGroup align={isMobile ? "stack" : "end"}>
                <Button type="button" variant="neutral" onPress={cancel}>Cancel</Button>
                <Button type="submit">Save</Button>
              </ButtonGroup>
            </Flex>
          </Form>
        </Flex>
      </Section>
    </main>
  );
}

export default App;
