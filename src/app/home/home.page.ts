import { Component } from '@angular/core';
import { LiveUpdate } from '@capawesome/capacitor-live-update';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  LoadingController,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class HomePage {
  constructor(private readonly loadingCtrl: LoadingController) {
    void LiveUpdate.ready();
  }

  public onClick(): void {
    // alert('Ooops! An error occurred.');
    alert('Hello World!');
  }

  public async onSync(): Promise<void> {
    let loadingElement: HTMLIonLoadingElement | undefined;
    try {
      loadingElement = await this.loadingCtrl.create({
        message: 'Please wait...',
      });
      const result = await LiveUpdate.sync();
      if (result.nextBundleId) {
        await LiveUpdate.reload();
      }
    } finally {
      await loadingElement?.present();
    }
  }
}
