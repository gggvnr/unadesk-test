export const TooltipTriggerType = {
  Hover: 'hover',
  Click: 'click',
} as const;

export type TooltipTriggerType = (typeof TooltipTriggerType)[keyof typeof TooltipTriggerType];
