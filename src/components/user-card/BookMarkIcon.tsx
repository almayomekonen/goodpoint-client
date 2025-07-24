import React, { FC } from 'react';
import './user-card.scss';
interface props {
    isClicked: boolean;
    setClicked: React.MouseEventHandler<HTMLElement>;
}
export const BookMarkIcon: FC<props> = ({ isClicked, setClicked }) => {
    return (
        <div className="bookmark-button flex-center" tabIndex={0} onClick={setClicked}>
            <svg
                style={{ fill: isClicked ? '#FCCC02' : 'white', color: isClicked ? '#FCCC02' : 'grey' }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="bookmark-icon"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                />
            </svg>
        </div>
    );
};
