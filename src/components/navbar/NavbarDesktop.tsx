import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import clsx from 'clsx';
import { useI18n } from '../../i18n/mainI18n';

import { SourceNavbar } from '../../common/enums';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import students_blue from '/images/students-blue.svg';
import students from '/images/students.svg';

import './navbarDesktop.scss';

//the mapping between the path and the index in the navbar
const pathToIndexMapping = { '/teachers-room': SourceNavbar.TEACHERS, '/': SourceNavbar.STUDENT };
export default function NavbarDesktop() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const i18n = useI18n((i18n) => i18n.navbar);

    const [index, setIndex] = useState(0);

    useEffect(() => {
        setIndex(window.location.pathname.includes('teachers-room') ? SourceNavbar.TEACHERS : SourceNavbar.STUDENT);
    }, []);

    useEffect(() => {
        //detect the change in the url , and slide to the relevant tab
        for (const [path, pathIndex] of Object.entries(pathToIndexMapping)) {
            if (pathname === path) {
                setIndex(pathIndex);
                return;
            }
        }
    }, [pathname]);

    const handleChange = (newIndex: number) => {
        //only do this if the index is different from the current one
        if (newIndex === index) return;
        //For the transition between the tabs in navbar to be smooth and pleasant,
        //we will wait for the animation to be completed
        if (newIndex) {
            navigate('/teachers-room', { replace: newIndex !== index });
        } else navigate('/', { replace: true });
    };

    return (
        <>
            <Box width="100%" className="navbar-desktop">
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs sx={{ display: 'flex' }} className="navbar-container" value={index}>
                        <Tab
                            sx={{ flex: 1 }}
                            onClick={() => {
                                handleChange(SourceNavbar.STUDENT);
                            }}
                            label={
                                <div>
                                    <div className="navbar">
                                        <img
                                            className="icon"
                                            src={index === SourceNavbar.TEACHERS ? students : students_blue}
                                            alt=""
                                        />
                                        <div className={clsx('text', index === SourceNavbar.TEACHERS && 'grey')}>
                                            {i18n.students}{' '}
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                        <Tab
                            sx={{ flex: 1 }}
                            onClick={() => {
                                handleChange(SourceNavbar.TEACHERS);
                            }}
                            label={
                                <div className="navbar">
                                    <img
                                        className="icon"
                                        src={
                                            index === SourceNavbar.TEACHERS
                                                ? '/images/teachersroom.svg'
                                                : '/images/teachersroom-grey.svg'
                                        }
                                        alt=""
                                    />
                                    <div className={clsx('text', index === SourceNavbar.STUDENT && 'grey')}>
                                        {i18n.teachersroom}{' '}
                                    </div>
                                </div>
                            }
                        />
                    </Tabs>
                </Box>
            </Box>
        </>
    );
}
