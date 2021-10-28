export * from './api';
export * from './user';

export interface ModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export interface PageInfoParams {
  pn: number;
  ps: number;
}

export interface Time {
  updatedAt: string;
  createdAt: string;
}
