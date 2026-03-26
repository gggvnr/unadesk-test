import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-button, [appButton]',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"-" + appearance()',
  },
})
export class Button {
  appearance = input<'primary' | 'secondary'>();
}
