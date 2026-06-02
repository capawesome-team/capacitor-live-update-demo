import { App } from '@capacitor/app';
import { LiveUpdate } from '@capawesome/capacitor-live-update';

// 👇 Bump this and publish a new bundle to watch the live update land on-device.
const BUNDLE_LABEL = 'v1';

let currentChannel = null;

const setText = (id, value) => {
  document.getElementById(id).textContent = value;
};

const renderBadge = () => {
  const badge = document.getElementById('badge-label');
  badge.textContent = BUNDLE_LABEL;
  badge.className = `badge-${BUNDLE_LABEL}`;
};

const refresh = async () => {
  const [version, bundle, channel, device] = await Promise.all([
    LiveUpdate.getVersionName(),
    LiveUpdate.getCurrentBundle(),
    LiveUpdate.getChannel(),
    LiveUpdate.getDeviceId(),
  ]);
  currentChannel = channel.channel;
  setText('version-name', version.versionName);
  setText('bundle-id', bundle.bundleId ?? 'Built-in');
  setText('channel', channel.channel ?? 'Default');
  setText('device-id', device.deviceId);
};

const presentToast = async message => {
  const toast = document.createElement('ion-toast');
  toast.message = message;
  toast.duration = 2500;
  document.body.appendChild(toast);
  await toast.present();
};

const presentReloadAlert = async (header, message) => {
  const alert = document.createElement('ion-alert');
  alert.header = header;
  alert.message = message;
  alert.buttons = [
    { text: 'Later', role: 'cancel' },
    { text: 'Reload', handler: () => void LiveUpdate.reload() },
  ];
  document.body.appendChild(alert);
  await alert.present();
};

const checkForUpdate = async (auto = false) => {
  const result = await LiveUpdate.sync();
  setText('last-sync', new Date().toLocaleTimeString());
  await refresh();
  if (result.nextBundleId) {
    await presentReloadAlert(
      'Update available',
      'A new version is ready. Reload now to apply it?',
    );
  } else if (!auto) {
    await presentToast('You are on the latest version. 🎉');
  }
};

const switchChannel = async () => {
  let channels;
  try {
    const result = await LiveUpdate.fetchChannels();
    channels = result.channels;
  } catch {
    await presentToast('Fetching channels is only supported on Android and iOS.');
    return;
  }
  if (channels.length === 0) {
    await presentToast(
      'No public channels available. Enable public channels in Capawesome Cloud.',
    );
    return;
  }
  const alert = document.createElement('ion-alert');
  alert.header = 'Switch channel';
  alert.inputs = channels.map(channel => ({
    type: 'radio',
    label: channel.name,
    value: channel.name,
    checked: channel.name === currentChannel,
  }));
  alert.buttons = [
    { text: 'Cancel', role: 'cancel' },
    { text: 'Switch', handler: channel => void applyChannel(channel) },
  ];
  document.body.appendChild(alert);
  await alert.present();
};

const applyChannel = async channel => {
  if (!channel) {
    return;
  }
  await LiveUpdate.setChannel({ channel });
  await refresh();
  await presentToast(`Switched to channel "${channel}".`);
};

const reset = async () => {
  await LiveUpdate.reset();
  await refresh();
  await presentReloadAlert(
    'Reset complete',
    'Reset to the built-in bundle. Reload now to apply it?',
  );
};

const init = async () => {
  try {
    // Notify LiveUpdate that the app is ready and no rollback should be performed.
    await LiveUpdate.ready();
    await refresh();
  } catch {
    // Live Update is only available on Android and iOS.
  }
};

document.addEventListener('DOMContentLoaded', () => {
  renderBadge();
  void init();
  // Check for updates whenever the app resumes from the background.
  void App.addListener('resume', () => {
    void checkForUpdate(true);
  });
  document
    .getElementById('check-button')
    .addEventListener('click', () => void checkForUpdate());
  document
    .getElementById('switch-channel-button')
    .addEventListener('click', () => void switchChannel());
  document
    .getElementById('reset-button')
    .addEventListener('click', () => void reset());
});
