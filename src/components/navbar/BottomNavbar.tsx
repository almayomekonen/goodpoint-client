import { Button } from '@mui/material';
import clsx from 'clsx';
import { useNavigate } from 'react-router';
import teachers_room_grey from '/images/teachersroom-grey.svg';
import { SourceNavbar } from '../../common/enums/source-navbar.enum';
import { useI18n } from '../../i18n/mainI18n';
import './bottomNavbar.scss';
import students_blue from '/images/students-blue.svg';
import students from '/images/students.svg';
import teachers_room from '/images/teachersroom.svg';

interface NavbarProps {
    source: SourceNavbar;
}

function BottomNavbar({ source }: NavbarProps) {
    const i18n = useI18n((i18n) => i18n.navbar);

    const navigate = useNavigate();

    function navigateToTeachersRoom() {
        navigate('/teachers-room');
    }
    function navigateToMyClasses() {
        navigate('/');
    }

    function navigateToSendGp() {
        sessionStorage.removeItem('groupMessageReceivers');
        navigate('/send-gp');
    }
    return (
        <div className="bottomNavbar">
            <div className="add-gp-button-container" onClick={navigateToSendGp}>
                <Button className="add-gp-button flex-center">
                    <div className="plus">+</div>
                </Button>
            </div>
            <div className="navbar">
                <div className="inner-navbar">
                    <div className="icons">
                        <Button className="nav-bar-text-container" onClick={navigateToMyClasses}>
                            <img
                                className="icon"
                                src={source === SourceNavbar.TEACHERS ? students : students_blue}
                                alt="students icon"
                            />
                            <div className={clsx('text', source === SourceNavbar.TEACHERS && 'grey')}>
                                {i18n.students}
                            </div>
                        </Button>
                        <div className="text nav-bar-no-icon-text">{i18n.goodPoint}</div>
                        <Button className="nav-bar-text-container" onClick={navigateToTeachersRoom}>
                            <img
                                className="icon"
                                src={source === SourceNavbar.TEACHERS ? teachers_room : teachers_room_grey}
                                alt="teachers icon"
                            />
                            <div className={clsx('text', source === SourceNavbar.STUDENT && 'grey')}>
                                {i18n.teachersroom}
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default BottomNavbar;
