import { useEffect, useRef } from 'react';
import { Input } from 'reactstrap';

const Search = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef?.current?.focus();
    }, []);

    return (
        <Input type='search' placeholder='Search' innerRef={inputRef}/>
    )
}

export default Search