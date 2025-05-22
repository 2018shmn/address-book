
const ContactList = ({ contacts, onEdit, onDelete }) => {
    if (contacts.length === 0) {
        return <div className="no-contacts">No contacts found. </div>
    }

    return ( 
        <div className="contact-list">
            <h2>Contacts</h2>
            <div className="contact-containers">
                {contacts.map(contact => (
                    <div key={contact.id} 
                    className="expanded">
                        <div className="contact-header">
                            {contact.imageUrl && (
                            <div className="contact-image">
                                <img src={contact.imageUrl} />
                            </div>
                            )}
                            <div className="contact-info">
                                <h3>{contact.name}</h3>
                                <p>Phone #: {contact.phone}</p>
                            </div>
                        </div>

                        <div className="contact-details">
                            <p><strong>Title:</strong>{contact.title}</p>
                            <p><strong>Address:</strong> {contact.address}</p>

                            <div className="contact-tags">
                                {contact.tags && contact.tags.map(tag => (
                                    <span key={tag} className="tag">{tag}</span>
                                ))}
                            </div>

                            <div className='actions'>
                                <button 
                                className="button-toggle"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(contact);
                                }}>
                                    Edit
                                </button>
                                <button 
                                className="button-red"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Delete ${contact.name}?`)) {
                                        onDelete(contact.id);
                                    }
                                }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContactList;