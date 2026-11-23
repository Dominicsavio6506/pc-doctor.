# PC Doctor – Computer Troubleshooting Assistant

A responsive, multi-page educational website built with **HTML5, CSS3 and Vanilla JavaScript**. It helps users explore common computer hardware, software and network problems and use a guided symptom-based troubleshooting wizard.

## Pages

1. `index.html` – Home and issue categories
2. `diagnose.html` – Interactive guided diagnosis
3. `hardware.html` – Hardware troubleshooting guide
4. `software.html` – Software and operating-system guide
5. `network.html` – Network troubleshooting guide
6. `about.html` – Project information, technology stack and sample feedback form

## Technologies

- HTML5: semantic page structure
- CSS3: responsive layouts, design tokens, cards, gradients and media queries
- Vanilla JavaScript (ES6): mobile navigation, diagnostic wizard, form validation and print summary

No frameworks, libraries, server, database or API are required.

## Run the project

1. Download and extract the project folder.
2. Open the `pc_doctor` folder in Visual Studio Code or another editor.
3. Open `index.html` in a modern browser.
4. For a local development server, use the VS Code Live Server extension if available. A server is optional.

All page links use relative paths, so the project can be hosted as a static website.

## Diagnostic tool logic

The diagnostic wizard is a **rule-based educational demonstration**, not a trained AI model and not a hardware scanner. The user selects one of six symptoms, answers two questions, and receives possible causes and safe next steps from predefined JavaScript data.

The tool does not read operating-system logs, inspect hardware, collect network credentials, repair a computer or confirm a fault.

## Safety and limitations

- Do not open a power supply unit or damaged battery.
- Stop using a device if there is smoke, a burning smell, liquid damage or battery swelling.
- Back up important data before major repair steps.
- Use manufacturer or official software sources.
- Seek a qualified technician for internal hardware repairs or persistent faults.

The feedback form validates input in the browser only. It does not send or store submissions.

## Suggested improvements

- Add a larger searchable knowledge base.
- Add language selection.
- Add accessible troubleshooting diagrams.
- Connect a secure backend for genuine support tickets.
- Integrate a verified diagnostic API or trained model only with appropriate privacy and security controls.

## Project objective

To demonstrate how core frontend technologies can be used to organize technical information and provide an interactive, user-friendly troubleshooting experience.
