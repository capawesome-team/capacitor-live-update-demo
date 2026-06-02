import { Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { LiveUpdate } from '@capawesome/capacitor-live-update';
import {
  AlertController,
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';

// 👇 Bump this and publish a new bundle to watch the live update land on-device.
const BUNDLE_LABEL = 'v1';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
  ],
})
export class HomePage implements OnInit {
  public readonly bundleLabel = BUNDLE_LABEL;
  public versionName = '–';
  public currentBundleId: string | null = null;
  public channel: string | null = null;
  public deviceId = '–';
  public lastSync = 'Never';

  constructor(
    private readonly alertController: AlertController,
    private readonly toastController: ToastController,
  ) {
    // Notify LiveUpdate that the app is ready and no rollback should be performed.
    void LiveUpdate.ready();
    // Check for updates whenever the app resumes from the background.
    void App.addListener('resume', () => {
      void this.checkForUpdate(true);
    });
  }

  public async ngOnInit(): Promise<void> {
    await this.refresh();
  }

  public async refresh(): Promise<void> {
    const [version, bundle, channel, device] = await Promise.all([
      LiveUpdate.getVersionName(),
      LiveUpdate.getCurrentBundle(),
      LiveUpdate.getChannel(),
      LiveUpdate.getDeviceId(),
    ]);
    this.versionName = version.versionName;
    this.currentBundleId = bundle.bundleId;
    this.channel = channel.channel;
    this.deviceId = device.deviceId;
  }

  public async checkForUpdate(auto = false): Promise<void> {
    const result = await LiveUpdate.sync();
    this.lastSync = new Date().toLocaleTimeString();
    await this.refresh();
    if (result.nextBundleId) {
      await this.presentReloadAlert(
        'Update available',
        'A new version is ready. Reload now to apply it?',
      );
    } else if (!auto) {
      await this.presentToast('You are on the latest version. 🎉');
    }
  }

  public async switchChannel(): Promise<void> {
    let channels;
    try {
      const result = await LiveUpdate.fetchChannels();
      channels = result.channels;
    } catch {
      await this.presentToast(
        'Fetching channels is only supported on Android and iOS.',
      );
      return;
    }
    if (channels.length === 0) {
      await this.presentToast(
        'No public channels available. Enable public channels in Capawesome Cloud.',
      );
      return;
    }
    const alert = await this.alertController.create({
      header: 'Switch channel',
      inputs: channels.map((channel) => ({
        type: 'radio',
        label: channel.name,
        value: channel.name,
        checked: channel.name === this.channel,
      })),
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Switch',
          handler: (channel: string) => {
            void this.applyChannel(channel);
          },
        },
      ],
    });
    await alert.present();
  }

  public async reset(): Promise<void> {
    await LiveUpdate.reset();
    await this.refresh();
    await this.presentReloadAlert(
      'Reset complete',
      'Reset to the built-in bundle. Reload now to apply it?',
    );
  }

  private async applyChannel(channel: string): Promise<void> {
    if (!channel) {
      return;
    }
    await LiveUpdate.setChannel({ channel });
    await this.refresh();
    await this.presentToast(`Switched to channel "${channel}".`);
  }

  private async presentReloadAlert(
    header: string,
    message: string,
  ): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        { text: 'Later', role: 'cancel' },
        {
          text: 'Reload',
          handler: () => {
            void LiveUpdate.reload();
          },
        },
      ],
    });
    await alert.present();
  }

  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
    });
    await toast.present();
  }
}
