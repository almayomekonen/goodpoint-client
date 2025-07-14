import React, { useEffect, useRef, useState } from 'react';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'axios';
import clsx from 'clsx';
import { useI18n } from '../../i18n/mainI18n';

import { savingEvents } from '../GoogleAnalytics';
import { useKeyboardOpen } from '../../common/contexts/KeyboardOpenContext';
import { isDesktop } from '../../common/functions/isDesktop';
import { GoodPointInformation } from '../../common/types';
import { StudentInformation } from '../students-list/StudentsList';
import { useQueryName } from '../../common/contexts/StudentListQueryContext';
import { useUser } from '../../common/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SendIcon from '@mui/icons-material/Send';
import { FormControl, InputAdornment, TextField } from '@mui/material';
import OpeningSentences from '../OpeningSentences';
import SendAnimation from '../send-message/SendAnimation';
import './goodPointTextBox.scss';

type SaveGP = {
    studentId: number;
    gpText: string;
    openSentenceId?: number;
};
type OpenSentence = {
    text: string | null;
    id: number | undefined;
};

interface TextBoxProps {
    gender: string;
    name: string;
    id: number;
    presetMessages: boolean;
    setPresetMessages: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TextBoxWithPM: React.FC<TextBoxProps> = ({ presetMessages, setPresetMessages, gender, name, id }) => {
    const i18n = useI18n((i18n) => i18n.chatTexts);
    const [gpText, setGpText] = useState('');
    const [openSentence, setOpenSentence] = useState<OpenSentence>({ text: null, id: undefined });
    const keyboardOpen = useKeyboardOpen();
    const [sendGp, setSendGp] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { studentsQueryName } = useQueryName();
    const navigate = useNavigate();

    useEffect(() => {
        keyboardOpen && setPresetMessages(false);
    }, [keyboardOpen]);

    const { setUser } = useUser();
    const queryClient = useQueryClient();

    const { status, mutate } = useMutation(['goodPoint'], async (saveGp: SaveGP) => {
        saveGp.gpText = gpText.trim();
        const { data } = await axios.post(`/api/good-points/save-gp`, saveGp);
        queryClient.invalidateQueries(['update-students']);
        updateChat(data);
        updateGpCount();

        queryClient.invalidateQueries(['teacher-activity', 'teacher-activity-students'], { type: 'all' });
        queryClient.invalidateQueries(['studentsFreeSearch'], { type: 'all' });
        queryClient.invalidateQueries({ queryKey: ['students'], type: 'all' });

        setGpText('');
        setUser((prev) => {
            return { ...prev, goodPointsCount: Number(prev.goodPointsCount) + 1 };
        });
        return data;
    });

    const updateChat = (data: GoodPointInformation & { created: string }) => {
        queryClient.setQueryData<InfiniteData<GoodPointInformation[]>>(['goodPoints', id], (prev) => {
            prev?.pages[0]?.unshift({ ...data, isMe: 1, date: data.created });

            return { pageParams: prev?.pageParams || [], pages: prev?.pages || [] };
        });
    };

    const updateGpCount = () => {
        queryClient.setQueryData<StudentInformation[] | undefined>([studentsQueryName], (prev) => {
            const studentIndex = prev?.findIndex((student) => student.id == id);
            if (prev && studentIndex != undefined) {
                prev[studentIndex].gpCount++;
            }

            return prev;
        });
    };

    const sendGoodPoint = () => {
        if (status !== 'idle') return;
        !isDesktop() && presetMessages && navigate(-1);
        const usedPM = openSentence.text && gpText.includes(openSentence.text);
        setSendGp(true);
        mutate({ studentId: id, gpText, openSentenceId: usedPM ? openSentence.id : undefined });
        savingEvents('send_gp');
    };

    return (
        <div className="goodpoint-textbox">
            <div className={clsx('box', isDesktop() && 'textbox-desktop', presetMessages && 'openSentences')}>
                <FormControl className="container">
                    <TextField
                        onKeyPress={(e) => {
                            if (isDesktop() && e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendGoodPoint();
                            }
                        }}
                        inputRef={(ref) => (inputRef.current = ref)}
                        multiline={true}
                        maxRows={4}
                        placeholder={i18n.sendGoodPoint}
                        value={gpText}
                        variant="outlined"
                        onChange={(e) => {
                            setGpText(e.target.value.trimStart());
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {gpText.length !== 0 && !sendGp && (
                                        <SendIcon className="sendIcon" onClick={sendGoodPoint} />
                                    )}
                                    {sendGp && <SendAnimation status={status} setSendGp={setSendGp} textBoxWithPM />}
                                </InputAdornment>
                            ),

                            startAdornment: (
                                <InputAdornment position="start">
                                    {presetMessages ? (
                                        <KeyboardIcon
                                            color="disabled"
                                            className="startIcons keyboardIcon"
                                            onClick={() =>
                                                isDesktop() ? setPresetMessages(false) : inputRef.current!.focus()
                                            }
                                        />
                                    ) : (
                                        <AddCircleIcon
                                            className="startIcons"
                                            onClick={() => {
                                                setPresetMessages(!presetMessages);
                                            }}
                                        />
                                    )}
                                </InputAdornment>
                            ),
                        }}
                    />
                </FormControl>
            </div>
            {presetMessages && (
                <OpeningSentences
                    setText={(value: string) => {
                        setGpText(value);
                        inputRef.current?.focus();
                    }}
                    setOpenSentence={setOpenSentence}
                    text={gpText}
                    gender={gender}
                    name={name}
                    presetMessages={presetMessages}
                />
            )}
        </div>
    );
};
