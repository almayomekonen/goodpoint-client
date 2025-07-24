import { Button } from '@mui/material';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryName } from '../../common/contexts/StudentListQueryContext';
import { ClassList } from '../../common/types/UserContext.type';
import { UserCard } from './../user-card/UserCard';

interface ClassButtonProps {
    grade: ClassList;
    handleBookMark: () => void;
    classInUserClassesOrGroup: (id: number, type: 'class' | 'study-group') => boolean;
}

export const ClassButton: FC<ClassButtonProps> = ({ grade, handleBookMark, classInUserClassesOrGroup }) => {
    const navigate = useNavigate();
    const { setStudentsQueryName } = useQueryName();

    const onClick = () => {
        setStudentsQueryName(['students', grade.grade, grade.classIndex].join('-'));
        navigate(`/students-by-class/${grade.grade}/${grade.classIndex}`);
    };

    return (
        <Button
            disableRipple
            className="flex-center user-card-button-wrapper"
            onClick={onClick}
            key={`${grade.grade}-${grade.classIndex}`}
        >
            <UserCard
                isBookedMarked={classInUserClassesOrGroup(grade.id, 'class')}
                handleBookMark={handleBookMark}
                cardType="class"
                classRoom={{ grade: grade.grade, classIndex: grade.classIndex }}
            />
        </Button>
    );
};
