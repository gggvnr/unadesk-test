import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, TemplateRef, input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  host: {
    '[style.--tooltip-width.px]': 'width()',
  },
})
export class TooltipComponent {
  text = input('');
  content = input<TemplateRef<unknown>>();
  width = input(220);
}
