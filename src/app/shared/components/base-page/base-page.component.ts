import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-base-page',
  templateUrl: './base-page.component.html',
  styleUrl: './base-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasePageComponent {}
