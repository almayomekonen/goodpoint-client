import { Button } from '@mui/material';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryName } from '../../common/contexts/StudentListQueryContext';
import { StarredStudyGroup } from '../../common/types/UserContext.type';
import { UserCard } from '../../components/user-card/UserCard';

interface GroupsButtonProps {
    group: StarredStudyGroup;
    handleBookMark: () => void;
    isBookedMarked: boolean;
}

export const GroupsButton: FC<GroupsButtonProps> = ({ isBookedMarked, group, handleBookMark }) => {
    const navigate = useNavigate();
    const { setStudentsQueryName } = useQueryName();

    const onClick = () => {
        setStudentsQueryName(['studentsStudyGroupList', group.id].join('-'));
        navigate(`/students-by-study-group/${group.id}/${group.name}`);
    };

    return (
        <Button disableRipple className="flex-center user-card-button-wrapper" onClick={onClick} key={`${group.name}`}>
            <UserCard
                isBookedMarked={isBookedMarked}
                handleBookMark={handleBookMark}
                iconText={group.name.slice(0, 2)}
                name={group.name}
                cardType="study-group"
            />
        </Button>
    );
};
