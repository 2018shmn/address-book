'use client'

import {useState, useEffect} from 'react';

const Filters = ({filters, onFilterChange, contacts}) => {
    //by tags
    const availTags = ['business', 'social', 'family', 'colleague', 'client', 'friend'];
    const [selectedTags, setSelectedTags] = useState([]);
    const [availAreaCodes, setAvailableAreaCodes] = useState([]);
    const [selectedCodes, setSelectedCodes] = useState([]);

    useEffect(() => {
        if (filters && filters.tags) {
            setSelectedTags(filters.tags);
        }
        if (filters && filters.areaCodes) {
            setSelectedCodes(filters.areaCodes);
        }
    },[filters]);

    useEffect(() => {
        if (contacts && contacts.length > 0) {
            const areaCodes = new Set();
            contacts.forEach(contact => {
                if (contact.phone) {
                    let code = contact.phone.match(/\((\d{3})\)/);
                    if (!code) {
                        code = contact.phone.match(/^(\d{3})/);
                    }
                    if (code && code[1]) {
                        areaCodes.add(code[1]);
                    }
                }
            });
            setAvailableAreaCodes(Array.from(areaCodes).sort());
        }
    }, [contacts]);

    const handleTagSelect = (tag) => {
        let newSelectedTags;

        if (selectedTags.includes(tag)) {
            newSelectedTags = selectedTags.filter(t => t !==tag);
        }
        else {
            newSelectedTags = [...selectedTags, tag];
        }
        
        setSelectedTags(newSelectedTags);
        onFilterChange({...filters, tags: newSelectedTags});
    };

    const handleCodeSelect = (code) => {
        let newSelectedCodes;

        if (selectedCodes.includes(code)) {
            newSelectedCodes = selectedCodes.filter(c => c !== code);
        }
        else {
            newSelectedCodes = [...selectedCodes, code];
        }
        
        setSelectedCodes(newSelectedCodes);
        onFilterChange({...filters, areaCodes: newSelectedCodes});
    };

    const clearFilters = () => {
        setSelectedTags([]);
        setSelectedCodes([]);
        onFilterChange({
            tags:[], 
            areaCodes: [],
            sortBy: 'dateAdded',
            sortDirection: 'desc'});
    };

    const handleSortChange = (sortBy) => {
        if (sortBy === filters.sortBy) {
            const newDirection = filters.sortDirection === 'asc' ? 'desc' : 'asc';
            onFilterChange({
                ...filters,
                sortDirection: newDirection
            });
        }
        else {
            const defaultDirection = sortBy === 'dateAdded' ? 'desc' : 'asc';
            onFilterChange({
                ...filters, 
                sortBy,
                sortDirection: defaultDirection
            });
        }
    }

    return (
        <div className="filters-container">
            <div className="filters-content">
                <div className="filter-group">
                    <h3>Filter by Tags</h3>
                    <div className="tags-container">
                        {availTags.map(tag => (
                            <button
                            key={tag}
                            className={`tag-button ${selectedTags.includes(tag) ? 'selected' : ''}`}
                            onClick={() => handleTagSelect(tag)}>
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {availAreaCodes.length > 0 && (
                    <div className="filter-group">
                        <h3> Filter by Area Code</h3>
                        <div className="tags-container">
                            {availAreaCodes.map(code => (
                                <button
                                key={code} 
                                value={code}
                                className={`tag-button ${selectedCodes.includes(code) ? 'selected' : ''}`}
                                onClick={() => handleCodeSelect(code)}>
                                    {code}
                            </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="filter-group">
                    <h3>Sort Options</h3>
                    <div className="sort-options">
                        <button 
                        type="button"
                        className={`sort-option ${filters.sortBy === 'dateAdded' ? 'selected' : ''}`}
                        onClick={() => handleSortChange('dateAdded')}>
                            Date Added {filters.sortBy === 'dateAdded' 
                            ? (filters.sortDirection === 'desc' ? '↓' : '↑'): ''}                         
                        </button>
                    </div>
                    <div className="sort-options">
                        <button 
                        type="button"
                        className={`sort-option ${filters.sortBy === 'name' ? 'selected' : ''}`}
                        onClick={() => handleSortChange('name')}>
                            Name {filters.sortBy === 'name' ? (filters.sortDirection === 'desc' ? '(Z-A)' : "(A-Z)") : ''}
                        </button>
                    </div>
                </div>

                <button 
                className="button-clear" 
                onClick={clearFilters}>
                     Clear Filters
                </button>
            </div>
        </div>
    );
};

export default Filters;