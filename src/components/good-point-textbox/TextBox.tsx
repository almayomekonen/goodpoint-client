import React, { useState } from 'react';

import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import clsx from 'clsx';
import { useI18n } from '../../i18n/mainI18n';

import { savingEvents } from '../GoogleAnalytics';

import { useUser } from '../../common/contexts/UserContext';
import { isDesktop } from '../../common/functions/isDesktop';
import { GoodPointInformation } from '../../common/types';

import SendIcon from '@mui/icons-material/Send';
import { FormControl, InputAdornment, TextField } from '@mui/material';
import SendAnimation from '../send-message/SendAnimation';

import './goodPointTextBox.scss';

type SaveGP = {
    receiverId: number | number[];
    gpText: string;
};

type TextBoxProps = {
    id: number[];
    queryName: string;
    apiPath: string;
    groupGp?: boolean;
};

export const TextBox: React.FC<TextBoxProps> = ({ id, queryName, apiPath, groupGp }) => {
    const [gpText, setGpText] = useState('');
    const [sendGp, setSendGp] = useState(false);
    const i18n = useI18n((i18n) => i18n.chatTexts);
    const { setUser } = useUser();

    const queryClient = useQueryClient();

    const { status, mutate } = useMutation(
        [queryName],
        async (saveGp: SaveGP) => {
            const { data } = await axios.post(
                apiPath,
                !groupGp
                    ? saveGp
                    : {
                          studentIds: saveGp.receiverId,
                          gpText: saveGp.gpText,
                      },
            );

            return data;
        },
        {
            onSuccess: (data) => {
                queryClient.setQueryData<InfiniteData<GoodPointInformation[]>>([queryName, id], (prev) => {
                    if (!groupGp)
                        return {
                            pageParams: prev?.pageParams || [],
                            pages: [
                                [{ ...data, isMe: 1, date: data.created }, ...(prev?.pages[0] || [])],
                                ...(prev?.pages.splice(1) || []),
                            ],
                        };
                    else
                        return {
                            pageParams: prev?.pageParams || [],
                            pages: [
                                [{ ...data[0], isMe: 1, date: data[0].created }, ...(prev?.pages[0] || [])],
                                ...(prev?.pages.splice(1) || []),
                            ],
                        };
                });

                queryClient.invalidateQueries(['teacher-activity', 'teacher-activity-teachers'], {
                    type: 'inactive',
                });
            },
        },
    );

    const sendGoodPoint = () => {
        mutate({ receiverId: id, gpText });
        setGpText('');
        setSendGp(true);
        savingEvents(groupGp ? 'send_group_gp' : 'send_teacher_gp');

        if (groupGp) {
            const sessionVar = sessionStorage.getItem('messagesSent');
            if (sessionVar) {
                const chat: { messages: [GoodPointInformation]; student_ids: number[] } = JSON.parse(sessionVar);
                chat.messages.push({ date: new Date().toString(), isMe: 1, gpText, viewCount: 0 });
                sessionStorage.setItem('messagesSent', JSON.stringify(chat));
            } else {
                sessionStorage.setItem(
                    'messagesSent',
                    JSON.stringify({
                        messages: [{ date: new Date().toString(), isMe: 1, gpText, viewCount: null }],
                        student_ids: id,
                    }),
                );
            }
            setUser((prev) => {
                return { ...prev, goodPointsCount: Number(prev.goodPointsCount) + id.length };
            });
        }
    };

    return (
        <div className="goodpoint-textbox">
            <div className={clsx('box', isDesktop() && 'textbox-desktop')}>
                <FormControl className="container">
                    <TextField
                        onKeyPress={(e) => {
                            if (isDesktop() && e.key === 'Enter' && !e.shiftKey && !!gpText) {
                                e.preventDefault();
                                sendGoodPoint();
                            }
                        }}
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
                                    {gpText.length !== 0
                                        ? !sendGp && <SendIcon className="sendIcon" onClick={sendGoodPoint} />
                                        : ''}
                                    {sendGp ? <SendAnimation status={status} setSendGp={setSendGp} /> : ''}
                                </InputAdornment>
                            ),
                        }}
                    />
                </FormControl>
            </div>
        </div>
    );
};
