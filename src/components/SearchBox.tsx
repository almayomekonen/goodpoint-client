import { RTL } from '@hilma/forms';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, InputAdornment, TextField } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { isDesktop } from '../common/functions/isDesktop';
import './searchBox.scss';

interface SearchBoxProps {
    placeholder?: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    search: string;
}

function SearchBox({ placeholder, search, setSearch }: SearchBoxProps) {
    return (
        <RTL>
            <div className="searchBox">
                <FormControl className="container">
                    <TextField
                        className={clsx(isDesktop() && 'searchBox-with-border')}
                        placeholder={placeholder}
                        value={search}
                        variant="outlined"
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {search.length === 0 ? (
                                        <SearchIcon fontSize="large" className="icons" />
                                    ) : (
                                        <div className="clear-icon" onClick={() => setSearch('')}>
                                            {' '}
                                            <ClearIcon className="icons" />
                                        </div>
                                    )}
                                </InputAdornment>
                            ),
                        }}
                    />
                </FormControl>
            </div>
        </RTL>
    );
}

export default SearchBox;
