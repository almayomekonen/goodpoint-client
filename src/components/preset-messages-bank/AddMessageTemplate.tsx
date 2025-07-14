import { TextField, Select, MenuItem, SelectChangeEvent, useTheme, Button } from '@mui/material';
import clsx from 'clsx';
import { FC, useEffect, useRef, useState } from 'react';
import { Gender, PresetCategory } from '../../common/enums';
import { useDirection, useI18n } from '../../i18n/mainI18n';
import { useAddTeacherPm, useEditAdminPm, useAddAdminPm } from '../../lib/react-query/hooks/usePresetMessagesBank';
import { PmInfo } from '../../admin/common/types/pmInfo.type';
import { motion, useAnimationControls } from 'framer-motion';

import './addMessageTemplate.scss';

interface Props {
    onSave: () => void;
    editOrAdd: 'edit' | 'add';
    typeOfPm: 'teacher' | 'admin';
    initialValues?: Partial<PmInfo>;
}

/**
 * The AddMessageTemplate component is responsible for displaying a form for adding or editing a preset message.
 * It allows users to enter a message, select a category and gender, and add or edit the preset message.
 */

const AddMessageTemplate: FC<Props> = ({ onSave, editOrAdd, typeOfPm, initialValues }) => {
    // States
    const [gender, setGender] = useState<Gender>(initialValues?.gender || Gender.MALE);
    const [message, setMessage] = useState<string>(initialValues?.text || '');
    const [category, setCategory] = useState<PresetCategory | ''>(initialValues?.presetCategory || '');
    const [isMessageValid, setIsMessageValid] = useState<boolean>(false);

    // React Query
    const addPmMutation = typeOfPm === 'teacher' ? useAddTeacherPm() : useAddAdminPm();
    const editPmMutation = useEditAdminPm();

    //consts
    const inputRef = useRef<HTMLElement>(null);
    const categorySelectRef = useRef<HTMLElement>(null);
    const genderSelectRef = useRef<HTMLElement>(null);
    const errorMessageAnimationControls = useAnimationControls();
    const theme = useTheme();
    const dir = useDirection();
    const i18n = useI18n((i18n) => ({
        general: i18n.general,
        categories: i18n.openSentencesBar,
        addMessagePopup: i18n.presetMessagesBank.addMessagePopup,
    }));

    // Message validation
    useEffect(() => {
        if (gender === Gender.MALE) {
            if (!message.split(' ').includes(i18n.general.studentMale)) {
                setIsMessageValid(false);
                return;
            }
        } else if (gender === Gender.FEMALE) {
            if (!message.split(' ').includes(i18n.general.studentFemale)) {
                setIsMessageValid(false);
                return;
            }
        }
        setIsMessageValid(true);
    }, [message, gender]);

    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    const handleCategoryChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value as PresetCategory);
    };

    const handleGenderChange = (event: SelectChangeEvent) => {
        setGender(event.target.value as Gender);
    };

    /**
     * Clears the form input fields and calls the onSave callback.
     */
    const handleClear = () => {
        onSave();
        setMessage('');
        setCategory('');
        setGender(Gender.MALE);
    };

    /**
     * Event handler for add message button click event.
     * Validates the message and category, and adds or edits the preset message.
     */
    const handleAddMessage = () => {
        // Message validation
        if (!isMessageValid) {
            errorMessageAnimationControls.start({
                scale: [1, 1.05, 1],
                transition: {
                    duration: 0.4,
                },
            });
            return;
        }

        if (category === '') {
            categorySelectRef.current?.focus();
            return;
        }

        // Passed the validation
        if (editOrAdd === 'add') {
            addPmMutation.mutate({ message, category, gender });
        } else if (initialValues?.id) {
            editPmMutation.mutate({ id: initialValues.id, message, category, gender });
        }
        handleClear();
    };

    return (
        <div className="add-message-container">
            {/* text filed */}
            <TextField
                autoComplete="off"
                inputRef={inputRef}
                onChange={handleMessageChange}
                value={message}
                fullWidth
                id="outlined-basic"
                placeholder={i18n.addMessagePopup.enterMessage}
                margin="none"
                variant="outlined"
                inputProps={{ maxLength: 100 }}
            />
            <div className="dropdowns">
                {/* category dropdown */}
                <Select
                    style={{ borderRadius: '10px' }}
                    inputRef={categorySelectRef}
                    value={category}
                    displayEmpty
                    fullWidth
                    onChange={handleCategoryChange}
                    sx={{ color: category ? theme.customColors.dark_blue1 : '#8e8e8e' }}
                    MenuProps={{ dir }}
                >
                    <MenuItem value="" disabled sx={{ display: 'none' }}>
                        {i18n.addMessagePopup.chooseCategory}
                    </MenuItem>
                    <MenuItem value={PresetCategory.educational}>{i18n.categories.educational}</MenuItem>
                    <MenuItem value={PresetCategory.emotional}>{i18n.categories.emotional}</MenuItem>
                    <MenuItem value={PresetCategory.social}>{i18n.categories.social}</MenuItem>
                    <MenuItem value={PresetCategory.other}>{i18n.categories.other}</MenuItem>
                </Select>

                {/* gender dropdown */}
                <Select
                    style={{ borderRadius: '10px' }}
                    inputRef={genderSelectRef}
                    value={gender}
                    displayEmpty
                    fullWidth
                    onChange={handleGenderChange}
                    sx={{ color: theme.customColors.dark_blue1 }}
                    MenuProps={{ dir }}
                >
                    <MenuItem value={Gender.MALE}>{i18n.general.male}</MenuItem>
                    <MenuItem value={Gender.FEMALE}>{i18n.general.female}</MenuItem>
                </Select>
            </div>

            {/* validation text */}
            {
                <motion.div animate={errorMessageAnimationControls} className="warning-text">
                    {!isMessageValid
                        ? gender === Gender.MALE
                            ? i18n.addMessagePopup.warningTextMale
                            : i18n.addMessagePopup.warningTextFemale
                        : ''}
                </motion.div>
            }

            {/* add button */}

            <div className="buttons">
                <Button className={clsx('cancel-button')} onClick={onSave} variant="outlined">
                    {i18n.general.cancel}
                </Button>
                <Button
                    variant="contained"
                    className={clsx('add-button', (!isMessageValid || !category || !gender) && 'disabled')}
                    onClick={handleAddMessage}
                >
                    {i18n.general.add}
                </Button>
            </div>
        </div>
    );
};

export default AddMessageTemplate;
