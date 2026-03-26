export const LoadingState = {
  initial: 'initial',
  loading: 'loading',
  loaded: 'loaded',
  failed: 'failed',
} as const;

export type LoadingState = (typeof LoadingState)[keyof typeof LoadingState];
