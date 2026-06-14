const skill = {
  id: 'jkevinxu.meeting-notes-summarizer',
  version: '1.0.0',
  hermesCommand: 'hermes skills install jkevinxu.meeting-notes-summarizer@1.0.0',
  codexCommand: 'codex plugin marketplace add JKevinXu/Agent-Skill-Market --ref main && codex plugin add meeting-notes-summarizer@agent-skill-market',
  mcpConfig: `{
  "mcpServers": {
    "agent-skill-market": {
      "command": "node",
      "args": ["/absolute/path/to/Agent-Skill-Market/src/mcp/server.js"],
      "env": { "MCP_TRANSPORT": "stdio" }
    }
  }
}`,
  hermesLink: 'hermes://skills/install?id=jkevinxu.meeting-notes-summarizer&version=1.0.0&source=https%3A%2F%2Fgithub.com%2FJKevinXu%2FAgent-Skill-Market%2Ftree%2Fmain%2Fskills%2Fmeeting-notes-summarizer',
  zipPath: 'dist/meeting-notes-summarizer.skill.zip',
  codexZipPath: 'dist/meeting-notes-summarizer.codex-plugin.zip'
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
    pendingUrl = null;
    dialogTitle.textContent = 'Copy Codex install command';
    dialogBody.textContent = 'Browsers cannot let this website run Codex on your Mac, and Codex does not currently support third-party skill installs from a codex:// browser link. Copy and run this command in Terminal. After it succeeds, restart Codex, search for “meeting”, and make sure the plugin list is not filtered to “Built by OpenAI”.';
    dialogConfirm.textContent = 'Copy Codex commands';
  } else if (agent === 'mcp') {
    setCommand(skill.mcpConfig);
    pendingUrl = null;
    dialogTitle.textContent = 'Connect via MCP';
    dialogBody.textContent = 'Use this local stdio MCP server config to expose Agent Skill Market as installless skill discovery/loading tools in any MCP-aware client. Replace the placeholder path with your local clone path.';
    dialogConfirm.textContent = 'Copy MCP config';
  }

  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else if (pendingUrl) {
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
    if (action === 'codex-download') {
      setCommand(`curl -L -o meeting-notes-summarizer.codex-plugin.zip https://github.com/JKevinXu/Agent-Skill-Market/raw/main/${skill.codexZipPath}`);
      window.location.href = skill.codexZipPath;
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

dialogConfirm.addEventListener('click', async (event) => {
  event.preventDefault();
  if (!pendingUrl) {
    try {
      await navigator.clipboard.writeText(commandEl.textContent);
      dialogConfirm.textContent = 'Copied';
      setTimeout(() => { dialog.close(); }, 500);
    } catch (error) {
      dialogConfirm.textContent = 'Copy failed — use command box';
    }
    return;
  }
  dialog.close();
  window.location.href = pendingUrl;
});
