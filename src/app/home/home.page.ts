import { Component } from '@angular/core';
import { App } from '@capacitor/app';
import { LiveUpdate } from '@capawesome/capacitor-live-update';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

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
        IonInput,
        IonIcon,
    ]
})
export class HomePage {
  constructor() {
    // Notify LiveUpdate that the app is ready and no rollback should be performed.
    void LiveUpdate.ready();
    // Listen for the app to resume and check for updates when that happens.
    void App.addListener('resume', async () => {
      const result = await LiveUpdate.sync();
      if (result.nextBundleId) {
        const confirmed = await window.confirm(
          'A new update is available. Do you want to reload the app to apply the update?',
        );
        if (confirmed) {
          await LiveUpdate.reload();
        }
      }
    });
  }

  public onLogin(): void {
    // alert('Ooops! An error occurred.');
    alert('Welcome!');
  }

  public onReset(): void {
    void LiveUpdate.reset();
  }
}
