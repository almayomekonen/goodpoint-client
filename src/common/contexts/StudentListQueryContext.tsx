import React, { useContext, useState } from 'react';
import { createContext } from 'react';

const StudentListQueryContext = createContext<{
    studentsQueryName: string;
    setStudentsQueryName: React.Dispatch<React.SetStateAction<string>>;
}>({ studentsQueryName: '-', setStudentsQueryName: () => {} });

interface Props {
    children: React.ReactNode;
}

/**
 * Context provider component for managing the student list query key name.
 * Provides the current student query name and a function to update it.
 * chat feature can be accessed from different routes,
 * in mobile we want to return to the place we were before.
 * @component
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components.
 * @returns {JSX.Element} The StudentListQueryProvider component.
 */

export const StudentListQueryProvider = ({ children }: Props) => {
    const [studentsQueryName, setStudentsQueryName] = useState<string>('-');

    return (
        <StudentListQueryContext.Provider value={{ studentsQueryName, setStudentsQueryName }}>
            {children}
        </StudentListQueryContext.Provider>
    );
};
export const useQueryName = () => useContext(StudentListQueryContext);
