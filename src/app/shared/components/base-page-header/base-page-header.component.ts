import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-base-page-header',
  templateUrl: './base-page-header.component.html',
  styleUrl: './base-page-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasePageHeaderComponent {}
