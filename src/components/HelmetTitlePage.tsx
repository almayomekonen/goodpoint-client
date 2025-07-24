import React, { FC } from 'react';
import { Helmet } from 'react-helmet';

interface HelmetTitlePageProps {
    title: string;
    description?: string;
}

export const HelmetTitlePage: FC<HelmetTitlePageProps> = ({ title, description }) => {
    return (
        <Helmet>
            <meta name="description" content={description} />
            <title>{title}</title>
        </Helmet>
    );
};
