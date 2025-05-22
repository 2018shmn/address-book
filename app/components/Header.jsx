
const Header = ({user, onLogout, showFilters, onToggleFilters}) => {
    return (
        <header className="app-header">
            <div className="header-main">
                <div className="header-content">
                    <div className="header-left">
                        <button 
                            className={`button-filter ${showFilters ? 'active' : ''}`}
                            onClick={onToggleFilters}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
                            </svg>
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </button>
                        <h1>Address Book</h1>
                    </div>
                    <div className="user-info">
                        <span>{user.email}</span>
                        <button 
                        className="button-logout"
                        onClick={onLogout}>Logout</button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;