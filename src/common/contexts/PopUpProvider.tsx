import React, { createContext, PropsWithChildren, useCallback, useContext, useReducer } from 'react';
import GenericPopup from '../../components/generic-popup/GenericPopup';
import { useI18n } from '../../i18n/mainI18n';

import { useImmer } from 'use-immer';
import { popupType } from '../enums/popUpType.enum';
import { PopupContent, SmallPopupCtxValue } from '../types/popUpContent.interface';
import { useAlert } from './AlertContext';

export const ARE_U_SURE_TYPES = [popupType.SAVE, popupType.DELETE, popupType.CLOSE];

const PopupContext = createContext<SmallPopupCtxValue>({ openPopup: () => {}, closePopup: () => {} });

/**
 * Context provider component for managing popups.
 * Provides functions to open and close popups and handles popup content and logic.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components.
 * @returns {JSX.Element} The PopupProvider component.
 * @example
 * // Usage example:
 * import { usePopup, popupType } from './PopupProvider';
 * import {popUpType.enum} from '../common/enums/popUpType.enum';
 *
 * function MyComponent() {
 *   const { openPopup, closePopup } = usePopup();
 *
 *   function toggleLogOutPopup() {
 *     openPopup(popupType.ARE_U_SURE, {
 *       title: general.logoutConfirmation,
 *       cancelText: general.cancel,
 *       okayText: general.accept,
 *       onConfirm: logout,
 *     });
 *   }
 *
 *  function closeLogOutPopup(){
 *    closePopup();
 *  }
 *
 *   // ... rest of the component code ...
 * }
 */

const PopupProvider: React.FC<PropsWithChildren> = ({ children }) => {
    // state popup content and logic
    const [popupContent, setPopupContent] = useImmer<null | (PopupContent & { isLoading?: boolean })>(null);

    const showAlert = useAlert();

    // If the action is a boolean value, set the state to that value ,Otherwise, toggle the state
    const [open, setOpen] = useReducer((state: boolean, action: boolean) => {
        return typeof action === 'boolean' ? action : !state;
    }, false);

    // Use useI18n hook to retrieve translated strings
    const { general } = useI18n((i18n) => {
        return {
            general: i18n.general,
        };
    });

    //logic:
    const openPopup = useCallback((type: popupType, additionalData?: Partial<PopupContent>) => {
        const PopupContent = getPopupContentByType(type, additionalData);
        setPopupContent({ okayText: PopupContent.okayText || 'ok', ...PopupContent }); //setting default to ok
        setOpen(true);
    }, []);

    const closePopup = useCallback(() => setOpen(false), []);

    function getPopupContentByType(type: popupType, additionalData?: Partial<PopupContent>): PopupContent {
        const {
            title = '',
            content,
            onConfirm,
            onClickCancel,
            showCancel,
            cancelText,
            deleting,
            checkboxText,
            checkboxWarning,
            containerClassName,
            showLoading,
        } = additionalData || {};

        const typeForSwitch = ARE_U_SURE_TYPES.includes(type) ? popupType.ARE_U_SURE : type;

        switch (typeForSwitch) {
            case popupType.REGULAR:
                return {
                    title,
                    content,
                    showCancel,
                    okayText: additionalData?.okayText,
                    cancelText: additionalData?.cancelText,
                    onConfirm,
                    onClickCancel,
                    checkboxText,
                    checkboxWarning,
                    containerClassName,
                    showLoading,
                };

            case popupType.ERROR:
                return {
                    title,
                    okayText: additionalData?.okayText ?? general.goBack,
                    cancelText,
                    onConfirm,
                    onClickCancel,
                    containerClassName,
                };

            case popupType.SUCCESS_SAVE:
            case popupType.SUCCESS_DELETE:
                return {
                    title: type === popupType.SUCCESS_SAVE ? general.savedSuccessfully : general.deletedSuccessfully,
                    onConfirm,
                    containerClassName,
                };

            case popupType.ARE_U_SURE:
                return {
                    title: title || `areYouSure${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()}`,
                    onConfirm,
                    onClickCancel,
                    content,
                    okayText: additionalData?.okayText,
                    cancelText: additionalData?.cancelText,
                    showCancel: true,
                    deleting: deleting || type === popupType.DELETE,
                    checkboxText,
                    checkboxWarning,
                    containerClassName,
                    showLoading,
                };

            default:
                return { title: '' };
        }
    }

    async function handlePopupAccept() {
        try {
            const { onConfirm, deleting, showLoading } = popupContent || {};
            if (onConfirm) {
                if (showLoading) {
                    setPopupContent((draft) => {
                        draft!.isLoading = true;
                    });
                    await onConfirm();
                    setPopupContent((draft) => {
                        draft!.isLoading = false;
                    });
                } else onConfirm();
            }
            closePopup();
            deleting && showAlert(general.deletedSuccessfully, 'success');
        } catch (error) {
            setPopupContent((draft) => {
                draft!.isLoading = false;
            });
            throw error;
        }
    }

    function handlePopupCancel() {
        const { onClickCancel } = popupContent || {};
        onClickCancel && onClickCancel();
        closePopup();
    }

    return (
        <PopupContext.Provider value={{ closePopup, openPopup }}>
            {children}
            <GenericPopup
                open={open}
                title={popupContent?.title ?? ''}
                acceptText={popupContent?.okayText}
                cancelText={popupContent?.cancelText}
                onAccept={handlePopupAccept}
                onCancel={handlePopupCancel}
                clearIcon={popupContent?.clearIcon ?? true}
                checkboxText={popupContent?.checkboxText}
                checkboxWarning={popupContent?.checkboxWarning}
                containerClassName={popupContent?.containerClassName}
                isLoading={popupContent?.isLoading}
                isForm
            >
                {popupContent?.content}
            </GenericPopup>
        </PopupContext.Provider>
    );
};

export default PopupProvider;

export const usePopup = () => useContext(PopupContext)!;
