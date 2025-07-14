import * as React from 'react';

import clsx from 'clsx';
import { useI18n } from '../i18n/mainI18n';

import { Gender, PresetCategory } from '../common/enums';
import { useGetPresetMessageQuery } from '../lib/react-query/hooks/usePresetMessagesBank';

import { Slide, Box, Tab, Tabs } from '@mui/material';

import './openingSentences.scss';
import { isDesktop } from '../common/functions/isDesktop';

type TabOptions = PresetCategory | 'all';

interface TabPanelProps {
    children?: React.ReactNode;
    selected: TabOptions;
    value: TabOptions;
}
type OpenSentence = {
    text: string | null;
    id: number | undefined;
};
interface OpenSentencesProps {
    name: string;
    gender: string;
    setText: (value: string) => void;
    setOpenSentence: React.Dispatch<React.SetStateAction<OpenSentence>>;
    text: string;
    presetMessages: boolean;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, selected, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== selected}
            id={`simple-tabpanel-${selected}`}
            aria-labelledby={`simple-tab-${selected}`}
            {...other}
        >
            {value === selected && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

/**
 * Component for displaying and selecting opening sentences.
 * Renders a tab-based UI with different categories of opening sentences.
 * Allows selecting an opening sentence and updating the text state.
 */
export default function OpeningSentences({
    name,
    gender,
    setText,
    setOpenSentence,
    presetMessages,
    text,
}: OpenSentencesProps) {
    const i18n = useI18n((i18n) => ({ openSentecesNar: i18n.openSentencesBar, general: i18n.general }));

    const [selected, setSelected] = React.useState<TabOptions>('all');
    const handleChange = (event: React.SyntheticEvent, newValue: TabOptions) => {
        setSelected(newValue);
    };

    const { studentFemale, studentMale } = i18n.general;
    const { data: openingSentences } = useGetPresetMessageQuery();

    const openingSentencesFilteredByGender = openingSentences?.filterAndMap((item) => {
        if (item.gender === gender) {
            return {
                ...item,
                text:
                    gender === Gender.MALE
                        ? item.text?.replaceAll(studentMale, name)
                        : item.text?.replaceAll(studentFemale, name),
            };
        }
    });

    const allOpeningSentencesByGender = openingSentencesFilteredByGender?.map((sentence) => (
        <p
            key={sentence.id}
            spellCheck={false}
            className={clsx('sentence', text.startsWith(sentence.text) && 'selected')}
            onClick={() => {
                setText(sentence.text), setOpenSentence({ text: sentence.text, id: sentence.id });
            }}
        >
            {sentence.text}
        </p>
    ));

    const listByCategory = openingSentencesFilteredByGender?.filterAndMap((sentence) => {
        if (sentence.presetCategory === selected) {
            return (
                <p
                    key={sentence.id}
                    spellCheck={false}
                    className={clsx('sentence', text.startsWith(sentence.text) && 'selected')}
                    onClick={() => setText(sentence.text)}
                >
                    {sentence.text}
                </p>
            );
        }
    });

    return (
        <Slide direction="up" in={presetMessages}>
            <div className={clsx('openingSentences', isDesktop() && 'openingSentences-desktop')}>
                <Box sx={{ width: '100%' }}>
                    <Box>
                        <Tabs value={selected} onChange={handleChange}>
                            <Tab label={i18n.openSentecesNar.all} value="all" {...a11yProps(0)} />
                            <Tab
                                label={i18n.openSentecesNar.educational}
                                value={PresetCategory.educational}
                                {...a11yProps(1)}
                            />
                            <Tab label={i18n.openSentecesNar.social} value={PresetCategory.social} {...a11yProps(2)} />
                            <Tab
                                label={i18n.openSentecesNar.emotional}
                                value={PresetCategory.emotional}
                                {...a11yProps(3)}
                            />
                            <Tab label={i18n.openSentecesNar.other} value={PresetCategory.other} {...a11yProps(4)} />
                        </Tabs>
                    </Box>
                    <TabPanel selected={selected} value={'all'}>
                        {allOpeningSentencesByGender}
                    </TabPanel>
                    <TabPanel selected={selected} value={PresetCategory.educational}>
                        {listByCategory}
                    </TabPanel>
                    <TabPanel selected={selected} value={PresetCategory.social}>
                        {listByCategory}
                    </TabPanel>
                    <TabPanel selected={selected} value={PresetCategory.emotional}>
                        {listByCategory}
                    </TabPanel>
                    <TabPanel selected={selected} value={PresetCategory.other}>
                        {listByCategory}
                    </TabPanel>
                </Box>
            </div>
        </Slide>
    );
}
