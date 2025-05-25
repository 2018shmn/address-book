import ContactForm from './ContactForm';

const ContactList = ({ contacts, onEdit, onDelete, editContactID, 
    onCancelEdit, onSubmit, uploadImage}) => {
    if (contacts.length === 0) {
        return <div className="no-contacts">No contacts found. </div>
    }

    const getSocialMediaIcon = (platform) => {
        return <div className = {`icon-${platform}`}></div>
    }

    const formatSocialMediaUrl = (platform, val) => {
        if (!val) return '';
        switch (platform) {
            case 'linkedin':
                return val.startsWith('http') ? val: `https://linkedin.com/in/${val}`;
            case 'instagram':
                return val.startsWith('http') ? val : `https://instagram.com/${val.replace('@','')}`;
            case 'facebook':
                return val.startsWith('http') ? val: `https://facebook.com/${val}`;
            case 'x':
                return val.startsWith('http') ? val : `https://x.com/${val.replace('@','')}`;
            default:
                return val;
        }
    };

    return ( 
        <div className="contact-list">
            <h2>Contacts</h2>
            <div className="contact-containers">
                {contacts.map(contact => (
                    <div key={contact.id}>
                        <div className="expanded">
                            <div className="contact-header">
                                {contact.imageUrl && (
                                <div className="contact-image">
                                    <img src={contact.imageUrl} />
                                </div>
                                )}
                                <div className="contact-info">
                                    <h3>{contact.name}</h3>
                                    <div className="contact-methods">
                                        {contact.phone && (
                                            <div className="contact-method">
                                                <span className="icon-phone"/>
                                                <span>: {contact.phone}</span>
                                            </div>
                                        )}
                                        {contact.email && (
                                            <div className="contact-method">
                                                <div className="icon-email"></div>
                                                <span>: </span>
                                                <a href={`mailto:${contact.email}`}> {contact.email}</a>
                                            </div>
                                        )}
                                        {contact.address && (
                                            <div className="info-item">
                                                <div className="icon-location"></div>
                                                <span>: {contact.address}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="contact-details">
                                {(contact.company || contact.title) && (
                                    <div className="info-section">
                                        {contact.company && (
                                            <div className="info-item">
                                                <span>Company: {contact.company}</span>
                                            </div>
                                        )}
                                        {contact.title && (
                                            <div className="info-item">
                                                <span>Title: {contact.title}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {contact.birthday && (
                                    <div className="info-item">
                                        <span>Birthday: {contact.birthday}</span>
                                    </div>
                                )}
                                
                                {contact.notes && (
                                    <div className="info-item">
                                        <span>Notes: {contact.notes}</span>
                                    </div>
                                )}

                                {Object.values(contact.socialMedia ||{}).some(Boolean) && (
                                    <div className = "social-media-section">
                                        <div className="social-media-links">
                                            {Object.entries(contact.socialMedia).map(([platform, val]) => {
                                                if (!val) return null;

                                                return (
                                                    <a
                                                    key={platform}
                                                    href={formatSocialMediaUrl(platform,val)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="social-link">{getSocialMediaIcon(platform)}</a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

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

                        {editContactID === contact.id && (
                            <div className="contact-form">
                                <ContactForm
                                contact={contact}
                                onSubmit={(updatedData) => onSubmit(contact.id, updatedData)}
                                onCancel={onCancelEdit}
                                uploadImage={uploadImage}></ContactForm>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContactList;