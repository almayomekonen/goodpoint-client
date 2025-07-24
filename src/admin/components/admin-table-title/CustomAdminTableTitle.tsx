import React, { FC } from 'react';
import './customAdminTableTitle.scss';

interface CustomAdminTableTitle {
    title: string;
    secondaryTitle?: string;
    sideButtons?: React.ReactNode;
}

/**
 * CustomAdminTableTitle is a component that renders a custom title for an admin table.
 *
 * @component
 * @param {string} title - The main title to be displayed.
 * @param {string} [secondaryTitle] - Optional. The secondary title to be displayed.
 * @param {React.ReactNode} [sideButtons] - Optional. Additional buttons or elements to be displayed on the side.
 * @returns {JSX.Element} A React element representing the CustomAdminTableTitle component.
 */

const CustomAdminTableTitle: FC<CustomAdminTableTitle> = ({ title, sideButtons, secondaryTitle }) => {
    return (
        <div className="admin-table-title">
            <div>
                <h2 className="title">{title}</h2>
                {secondaryTitle && <h3 className="secondary-title">{secondaryTitle}</h3>}
            </div>
            {sideButtons && sideButtons}
        </div>
    );
};

export default CustomAdminTableTitle;
