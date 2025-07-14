import { ReactNode } from 'react';
import { popupType } from '../enums/popUpType.enum';

export interface PopupContent {
    title: string;
    content?: ReactNode;
    okayText?: string;
    cancelText?: string;
    showCancel?: boolean;
    showButtons?: boolean;
    clearIcon?: boolean;
    onClickCancel?: () => void;
    onConfirm?: () => void;
    containerClassName?: string;
    deleting?: boolean;
    checkboxText?: string;
    checkboxWarning?: string;
    showLoading?: boolean;
}

export interface SmallPopupCtxValue {
    openPopup: (type: popupType, additionalData?: Partial<PopupContent>) => void;
    closePopup: () => void;
}
