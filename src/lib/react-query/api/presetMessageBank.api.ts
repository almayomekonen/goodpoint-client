import axios from 'axios';
import { Gender } from '../../../common/enums';
import { OpenSentence } from '../../../common/types';

export const getPresetMessagesQuery = async () => {
    const { data } = await axios.get<OpenSentence[]>(`/api/preset-messages/get-my-preset-messages`);
    return data;
};

export const deletePresetMessageQuery = async (id: number) => {
    const { data } = await axios.delete(`/api/preset-messages/delete-personal-preset-message`, { data: { pmId: id } });
    return data;
};

export const addTeacherPmQuery = async (text: string, presetCategory: string, gender: Gender) => {
    const { data } = await axios.post<OpenSentence>(`/api/preset-messages/add-a-pm`, { text, presetCategory, gender });
    return data;
};

export const addAdminPm = async (text: string, presetCategory: string, gender: Gender) => {
    const { data } = await axios.post<OpenSentence>(`/api/preset-messages/add-admin-pm`, {
        text,
        presetCategory,
        gender,
    });
    return data;
};

export const editAdminPm = async (id: number, text: string, presetCategory: string, gender: Gender) => {
    const { data } = await axios.patch<OpenSentence>(`/api/preset-messages/edit-admin-pm`, {
        id,
        text,
        presetCategory,
        gender,
    });
    return data;
};
