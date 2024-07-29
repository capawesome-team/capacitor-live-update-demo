import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { LiveUpdate } from '@capawesome/capacitor-live-update';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class HomePage {
  constructor() {}

  public onClick(): void {
    alert('Ooops! An error occurred.');
    // alert('Hello World!');
  }

  public async onSync(): Promise<void> {
    const result = await LiveUpdate.sync();
    if (result.nextBundleId) {
        await LiveUpdate.reload();
    }
  }
}
