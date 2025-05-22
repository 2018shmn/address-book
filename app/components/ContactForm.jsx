import {useState, useEffect} from 'react';

const ContactForm = ({contact, onSubmit, onCancel, uploadImage}) => {
    const [data, setData] = useState({
        name: '',
        title: '',
        phone: '',
        address: '',
        tags: [],
        imageUrl: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const availTags = ['business', 'social', 'family'];

    useEffect(() => {
        if (contact) {
            setData({
                name: contact.name || '',
                title: contact.title || '',
                phone: contact.phone || '',
                address: contact.address || '',
                tags: contact.tags || [],
                imageUrl: contact.imageUrl || ''
            });
            setShowForm(true);
        }
        else {
            resetForm();
        }
    }, [contact]);

    const resetForm = () => {
        setData({
            name: '',
            title: '',
            phone: '',
            address: '',
            tags: [],
            imageUrl: ''
        });
        setImageFile(null);
    } 

    const handleChange = (e) => {
        const {name, value} = e.target;
        setData({...data, [name]: value});
    };

    const handleTag = (tag) => {
        setData(prev => {
            const updatedTags = prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag];
            return {...prev, tags: updatedTags};
        });
    };

    const handleImage = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if(!data.name || !data.title || !data.address) {
            alert('Name, title, and address are required.');
            return;
        }

        try {
            let imageUrl = data.imageUrl;

            if(imageFile) {
                const uploadedUrl = await uploadImage(imageFile);
                if (uploadedUrl) {
                    imageUrl = uploadedUrl;
                }
            }

            const contactData = {...data, imageUrl};
            if (contact) {
                await onSubmit(contact.id, contactData);
            }
            else {
                await onSubmit(contactData);
                resetForm();
            }

            setShowForm(false);
        }
        catch (error) {
            console.error("Error submitting form", error);
            alert("Failed to create contact");
        }
        setIsLoading(false);
    };

    return (
        <div className="contact-form-container">
            {!showForm && !contact ? (
                <button 
                type="button"
                className="button-add"
                onClick={()=> setShowForm(true)}>
                    Add New Contact
                </button>
            ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                    <h2>{contact ? 'Edit Contact' : 'Add New Contact'}</h2>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                        type="text"
                        name="title"
                        value={data.title}
                        onChange={handleChange}
                        required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                        type="tel"
                        name="phone"
                        value={data.phone}
                        onChange={handleChange}
                        required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <input
                        type="text"
                        name="address"
                        value={data.address}
                        onChange={handleChange}
                        required/>
                    </div>

                    <div className="form-group">
                        <label>Tags</label>
                        <div className='tags-container'>
                            {availTags.map(tag => (
                                <button
                                type="button"
                                key={tag}
                                className={`tag-button ${data.tags.includes(tag) ? 'selected' : ''}`}
                                onClick={() => handleTag(tag)}>
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Profile Image</label>
                        <input
                        type="file"
                        id="image"
                        onChange={handleImage}
                        />
                        {data.imageUrl && (
                            <div className="curr-image">
                                <img src={data.imageUrl}/>
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button
                        type="button"
                        className="cancel-button"
                        onClick={() => {
                            onCancel();
                            setShowForm(false);
                        }}>
                            Cancel
                        </button>
                        <button
                        type="submit"
                        className="save-button"
                        disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Contact'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ContactForm;