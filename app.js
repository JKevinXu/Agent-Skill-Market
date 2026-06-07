const skill = {
  id: 'jkevinxu.meeting-notes-summarizer',
  version: '1.0.0',
  hermesCommand: 'hermes skills install jkevinxu.meeting-notes-summarizer@1.0.0',
  codexCommand: '$skill-installer https://github.com/JKevinXu/Agent-Skill-Market/tree/main/skills/meeting-notes-summarizer',
  hermesLink: 'hermes://skills/install?id=jkevinxu.meeting-notes-summarizer&version=1.0.0&source=https%3A%2F%2Fgithub.com%2FJKevinXu%2FAgent-Skill-Market%2Ftree%2Fmain%2Fskills%2Fmeeting-notes-summarizer',
  codexLink: 'codex://skills/install?id=jkevinxu.meeting-notes-summarizer&version=1.0.0&source=https%3A%2F%2Fgithub.com%2FJKevinXu%2FAgent-Skill-Market%2Ftree%2Fmain%2Fskills%2Fmeeting-notes-summarizer',
  zipPath: 'dist/meeting-notes-summarizer.skill.zip'
};

const commandEl = document.querySelector('#install-command');
const copyButton = document.querySelector('#copy-command');
const dialog = document.querySelector('#install-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogBody = document.querySelector('#dialog-body');
const dialogConfirm = document.querySelector('#dialog-confirm');
let pendingUrl = skill.hermesLink;

function setCommand(command) {
  commandEl.textContent = command;
}

function showInstallPreview(agent) {
  if (agent === 'hermes') {
    setCommand(skill.hermesCommand);
    pendingUrl = skill.hermesLink;
    dialogTitle.textContent = 'Install in Hermes';
    dialogBody.textContent = 'Hermes will receive a package reference, verify the manifest, show the same permission plan, and install only after your confirmation.';
    dialogConfirm.textContent = 'Open Hermes installer';
  } else if (agent === 'codex') {
    setCommand(skill.codexCommand);
    pendingUrl = skill.codexLink;
    dialogTitle.textContent = 'Install in Codex';
    dialogBody.textContent = 'Codex-compatible clients can install this skill from its GitHub path. If your Codex client does not support deep links yet, copy the displayed $skill-installer command.';
    dialogConfirm.textContent = 'Open Codex installer';
  }

  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    window.location.href = pendingUrl;
  }
}

document.querySelectorAll('[data-action]').forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    if (action === 'download') {
      setCommand(`curl -L -o meeting-notes-summarizer.skill.zip https://github.com/JKevinXu/Agent-Skill-Market/raw/main/${skill.zipPath}`);
      window.location.href = skill.zipPath;
      return;
    }
    showInstallPreview(action);
  });
});

copyButton.addEventListener('click', async () => {
  const command = commandEl.textContent;
  try {
    await navigator.clipboard.writeText(command);
    copyButton.textContent = 'Copied';
    setTimeout(() => { copyButton.textContent = 'Copy'; }, 1400);
  } catch (error) {
    copyButton.textContent = 'Select text';
    commandEl.focus?.();
  }
});

dialogConfirm.addEventListener('click', (event) => {
  event.preventDefault();
  dialog.close();
  window.location.href = pendingUrl;
});
