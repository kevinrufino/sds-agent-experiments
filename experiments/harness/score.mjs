// Automated rubric detector. Usage: node score.mjs <worktree>
// Regex-based (documented limitation); every automated result is re-checked by manual review notes.
import { execSync } from "node:child_process";
import fs from "node:fs";
const wt = process.argv[2];
const changed = execSync("git status --porcelain -uall", { cwd: wt }).toString().split("\n").filter(Boolean).map(l => l.slice(3));
const tsx = changed.filter(f => /\.tsx?$/.test(f) && !/App\.tsx$/.test(f));
const css = changed.filter(f => /\.css$/.test(f));
const src = tsx.map(f => fs.readFileSync(`${wt}/${f}`, "utf8")).join("\n");
const cssSrc = css.map(f => fs.readFileSync(`${wt}/${f}`, "utf8")).join("\n");
const has = (re) => re.test(src);
const count = (re, s = src) => (s.match(re) || []).length;
const tag = (name) => new RegExp(`<${name}[\\s>/]`);
// Eligible UI opportunities, fixed before any run (see experiments/README.md#rubric)
const items = {
  R01_page_title_sds: has(/<TextContentTitle|<TextTitlePage|<TextTitleHero/),
  R02_section_headings_sds: has(/<TextHeading|<TextContentHeading|<TextSubheading|<Legend/),
  R03_inputs_InputField: count(/<InputField[\s>]/g) >= 3,
  R04_email_error_via_field: /<InputField[\s\S]{0,600}?errorMessage/.test(src) && has(/isInvalid|validate=/),
  R05_help_text_description: /<InputField[\s\S]{0,400}?description=/.test(src),
  R06_prefs_SwitchOrCheckboxField: count(/<SwitchField[\s>]|<CheckboxField[\s>]/g) >= 1,
  R07_security_disabled: /<(SwitchField|CheckboxField)[\s\S]{0,300}?isDisabled/.test(src),
  R08_member_AvatarBlock_or_Avatar: has(/<AvatarBlock|<Avatar[\s>]/),
  R09_role_SelectField_or_Radio: has(/<SelectField|<RadioGroup/),
  R10_remove_ButtonDanger: has(/<ButtonDanger|<DestructiveIconButton/),
  R11_save_Button_isDisabled: /<Button[\s\S]{0,300}?isDisabled[\s\S]{0,300}?Save|Save[\s\S]{0,10}<\/Button>/.test(src) && has(/<Button[\s\S]{0,300}?isDisabled/),
  R12_cancel_nonprimary: /variant="(neutral|subtle)"[\s\S]{0,200}?Cancel/.test(src),
  R13_ButtonGroup: has(tag("ButtonGroup")),
  R14_feedback_Notification: has(tag("Notification")),
  R15_layout_components: has(/<Flex[\s>]|<Section[\s>]|<Grid[\s>]|<FlexItem/),
};
const reuse = Object.values(items).filter(Boolean).length;
const raw = {
  raw_button: count(/<button[\s>]/g), raw_input: count(/<input[\s>]/g), raw_select: count(/<select[\s>]/g),
  raw_heading: count(/<h[1-6][\s>]/g), raw_label: count(/<label[\s>]/g),
};
const danger_misuse = count(/<Button\s[^>]*variant="danger/g);
const rac_imports = count(/from\s+["']react-aria-components["']|from\s+["']@react-(aria|stately)/g);
const sds_imports = [...new Set([...src.matchAll(/import\s*\{([^}]*)\}\s*from\s*["'](primitives|layout|compositions|icons|hooks|data|utils)["']/g)].flatMap(m => m[1].split(",").map(s => s.trim().replace(/^type\s+/, "")).filter(Boolean)))].sort();
const localComponents = [...src.matchAll(/(?:function|const)\s+([A-Z]\w*)\s*(?:=\s*(?:\([^)]*\)|\w+)\s*=>|\()/g)].map(m => m[1]);
const inline_styles = count(/style=\{\{/g);
const css_hex = count(/#[0-9a-fA-F]{3,8}\b|rgba?\(/g, cssSrc);
const css_px = count(/\b\d+(\.\d+)?px\b/g, cssSrc);
const css_layout = count(/display:\s*(flex|grid)/g, cssSrc);
const css_vars = count(/var\(--sds-/g, cssSrc);
const loc = tsx.reduce((n, f) => n + fs.readFileSync(`${wt}/${f}`, "utf8").split("\n").length, 0);
const cssLoc = css.reduce((n, f) => n + fs.readFileSync(`${wt}/${f}`, "utf8").split("\n").length, 0);
console.log(JSON.stringify({ files: changed, rubric: items, reuse_score: `${reuse}/15`, reuse_n: reuse, raw, danger_variant_on_Button: danger_misuse, rac_imports, sds_imports, local_components: localComponents, inline_styles, css: { css_hex, css_px, css_layout, css_vars }, loc_tsx: loc, loc_css: cssLoc }, null, 1));
