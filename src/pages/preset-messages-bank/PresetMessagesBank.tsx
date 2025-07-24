import clsx from 'clsx';
import { motion, useAnimationControls } from 'framer-motion';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { vw } from '../../common/functions/get-vw';
import { isDesktop } from '../../common/functions/isDesktop';
import { useDeletePresetMessage, useGetPresetMessageQuery } from '../../lib/react-query/hooks/usePresetMessagesBank';
import { useI18n } from '../../i18n/mainI18n';
import pmBankImage from '/images/pages-images/pmBankMessage.svg';

import { PresetCategory } from '../../common/enums';
import GenericPopup from '../../components/generic-popup/GenericPopup';
import AddMessagePopup from '../../components/preset-messages-bank/AddMessageTemplate';
import PresetMessageContainer from '../../components/preset-messages-bank/PresetMessageContainer';
import TitledHeader from '../../components/titled-header/TitledHeader';
import { HelmetTitlePage } from '../../components/HelmetTitlePage';

import './preset-messages-bank.scss';

//types
type CategoryType = PresetCategory | 'all';

/**
 * Function: PresetMessagesBank
 * ----------------------------
 * This component represents the preset messages bank page. It displays a list of preset messages
 * categorized by different categories. Users can add, delete, and navigate through the preset messages.
 *
 * @returns {JSX.Element} The PresetMessagesBank component JSX element.
 */
const PresetMessagesBank = () => {
    // States
    const [currentCategory, setCurrentCategory] = useState<CategoryType>('all');
    const [openDeletePopup, setOpenDeletePopup] = useState<boolean>(false);
    const [openAddMessagePopup, setOpenAddMessagePopup] = useState<boolean>(false);
    const [messageToDelete, setMessageToDelete] = useState<{ id: number; message: string } | undefined>(undefined);
    const [animationFinished, setAnimationFinished] = useState<boolean>(true);

    // React Query
    const { data: presetMessages } = useGetPresetMessageQuery();
    const deleteMessageMutation = useDeletePresetMessage();

    // translations
    const i18n = useI18n((i18n) => ({
        addMessagePopup: i18n.presetMessagesBank.addMessagePopup,
        categories: i18n.openSentencesBar,
        title: i18n.menuSideBarText.presetMessagesBank,
        deletePopup: i18n.presetMessagesBank.deleteMessagePopup,
        general: i18n.general,
        pagesTitles: i18n.pagesTitles,
    }));

    // hooks and consts
    const categories: CategoryType[] = ['all', ...Object.values(PresetCategory)];
    const selectedCategoryRef = useRef<HTMLButtonElement>(null);
    const controls = useAnimationControls();
    const navigate = useNavigate();

    // Effects
    // for the animations
    useEffect(() => {
        window.addEventListener('resize', handleResize, true);
        return () => {
            window.removeEventListener('resize', handleResize, true);
        };
    }, []);

    /**
     * Calculates the left padding of the content container.
     * the number needs to match the padding-left value in the .desktop-container class
     * @returns The left padding value in pixels.
     */
    const getLeftPadding = () => {
        if (!isDesktop()) return 0;
        return vw(2);
    };

    /**
     * Event handler for window resize event.
     * Moves the selected category div to the new position based on the category clicked.
     */
    const handleResize = () => {
        if (selectedCategoryRef.current) {
            controls.start({
                left: selectedCategoryRef.current?.getBoundingClientRect().left - getLeftPadding(),
                transition: { duration: 0 },
            });
        }
    };

    /**
     * Event handler for changing the preset message category.
     * Moves the selected category div to the new position based on the category clicked.
     * @param e - The event object.
     * @param category - The selected category.
     */
    const handleCategoryChange = (e: SyntheticEvent, category: CategoryType) => {
        if (currentCategory !== category) {
            controls.start({
                left: e.currentTarget?.getBoundingClientRect().left - getLeftPadding(),
                transition: { damping: 0, stiffness: 0 },
            });
            setCurrentCategory(category);
        }
    };

    /**
     * Opens the delete message popup with the specified message details.
     * @param id - The ID of the message to delete.
     * @param message - The content of the message.
     */
    const handleDeletePopupOpen = (id: number, message: string) => {
        setOpenDeletePopup(true);
        setMessageToDelete({ id, message });
    };

    /**
     * Handles the acceptance of the delete message popup.
     * Closes the popup and initiates the delete message mutation.
     */
    const handleDeletePopupAccept = () => {
        setOpenDeletePopup(false);
        if (!messageToDelete?.id) return;
        deleteMessageMutation.mutate(messageToDelete.id);
    };

    /**
     * Handles the click event of the add message button.
     * Opens the add message popup.
     */
    const handleAddMessageClick = () => {
        setOpenAddMessagePopup(true);
    };

    return (
        <div className="preset-messages-bank-container">
            <div className={clsx('bank-container', !isDesktop() && 'titled-page')}>
                <HelmetTitlePage title={i18n.pagesTitles.presetMessagesBank} />

                {/* popups */}

                {/* delete message popup */}
                <GenericPopup
                    open={openDeletePopup}
                    title={i18n.deletePopup.title}
                    content={`"${messageToDelete?.message}"`}
                    acceptText={i18n.general.yes}
                    cancelText={i18n.general.no}
                    onAccept={handleDeletePopupAccept}
                    onCancel={() => setOpenDeletePopup(false)}
                    containerClassName="delete-pm-popup-container"
                />
                {/* add message popup */}
                <GenericPopup
                    open={openAddMessagePopup}
                    title={i18n.addMessagePopup.title}
                    content={i18n.addMessagePopup.content}
                    clearIcon
                    onCancel={() => setOpenAddMessagePopup(false)}
                    containerClassName="add-pm-popup-container"
                >
                    <AddMessagePopup
                        typeOfPm={'teacher'}
                        onSave={() => setOpenAddMessagePopup(false)}
                        editOrAdd="add"
                    />
                </GenericPopup>

                {/* for phone use */}
                {!isDesktop() && (
                    <TitledHeader size="small" title={i18n.title} icon={'clear'} onNavigate={() => navigate(-1)} />
                )}

                {/* main content */}
                <div className="categories-bar">
                    {categories.map((category, index) => (
                        <button
                            ref={category === currentCategory ? selectedCategoryRef : null}
                            key={index}
                            className={clsx(
                                'tab',
                                'flex-center',
                                category === currentCategory && animationFinished && 'selected',
                            )}
                            onClick={(e: SyntheticEvent) => handleCategoryChange(e, category)}
                        >
                            {i18n.categories[category]}
                        </button>
                    ))}

                    {/* this div will always cover the selected div (based on the category the user chooses) */}
                    {
                        <motion.div
                            className="background-div"
                            animate={controls}
                            onAnimationComplete={() => setAnimationFinished(true)}
                            onAnimationStart={() => setAnimationFinished(false)}
                        ></motion.div>
                    }
                </div>

                <div className="messages-div custom-scroll-bar">
                    {presetMessages?.filterAndMap((message) => {
                        if (message.presetCategory === currentCategory || currentCategory === 'all')
                            return (
                                <PresetMessageContainer
                                    key={message.id}
                                    id={message.id}
                                    message={message.text}
                                    handleDeletePopupOpen={handleDeletePopupOpen}
                                />
                            );
                    })}
                    <div className="padding-div"></div>
                </div>

                {/* add button */}
                <button className="add-button" onClick={handleAddMessageClick}>
                    <div className="plus-sign">+</div>
                </button>
            </div>

            {isDesktop() && <img className="side-image" src={pmBankImage} alt="" />}
        </div>
    );
};
export default PresetMessagesBank;
