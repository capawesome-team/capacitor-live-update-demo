import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { refresh } from 'ionicons/icons';

addIcons({
  refresh,
});
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    imports: [IonApp, IonRouterOutlet]
})
export class AppComponent {
  constructor() {}
}
