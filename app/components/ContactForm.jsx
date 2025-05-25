import {useState, useEffect} from 'react';

const ContactForm = ({contact, onSubmit, onCancel, uploadImage}) => {
    const [data, setData] = useState({
        name: '',
        phone: '',
        email: '',
        company: '',
        title: '',
        address: '',
        birthday: '',
        notes: '',
        tags: [],
        imageUrl: '',
        socialMedia: {
            linkedin: '',
            instagram: '',
            facebook: '',
            x: ''
        }
    });
    const [imageFile, setImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const availTags = ['business', 'social', 'family', 'colleague', 'client', 'friend'];

    const isEditMode = contact !== null;

    useEffect(() => {
        if (contact) {
            setData({
                name: contact.name || '',
                phone: contact.phone || '',
                email: contact.email || '',
                company: contact.company || '',
                title: contact.title || '',
                address: contact.address || '',
                tags: contact.tags || [],
                imageUrl: contact.imageUrl || '',
                birthday: contact.birthday || '',
                notes: contact.notes || '',
                socialMedia: contact.socialMedia || {
                    linkedin: '',
                    instagram: '',
                    facebook: '',
                    x: ''
                }
            });
        }
    }, [contact]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setData({...data, [name]: value});
    };

    const handleSocialMediaChange = (platform, val) => {
        setData(prev => ({
            ...prev, socialMedia: {
                ...prev.socialMedia, [platform]: val
            }
        }));
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

        if(!data.name) {
            alert('Name is required.');
            setIsLoading(false);
            return;
        }

        if (!data.phone && !data.email) {
            alert('At least one contact (phone or email) is required.');
            setIsLoading(false);
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
            await onSubmit(contactData);
        }
        catch (error) {
            console.error("Error submitting form", error);
            alert("Failed to create contact");
        }
        setIsLoading(false);
    };

    return (
        <div className="contact-form-container">
            <h2>{contact ? 'Edit Contact' : 'Add New Contact'}</h2>
            <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-group">
                    <label htmlFor="name">Full Name<span className='required'>*</span></label>
                    <input
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    required/>
                </div>
                <div className="form-group">
                    <label htmlFor="image">Profile Picture</label>
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
            </div>

            <div className="form-section">
                <h3>Contact Information</h3>
                <div className="form-group">
                    <label htmlFor="phone">Phone Number<span className='required'>*</span></label>
                    <input
                    type="tel"
                    name="phone"
                    value={data.phone}
                    onChange={handleChange}
                    required/>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address<span className='required'>*</span></label>
                    <input
                    type="text"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    required/>
                </div>
                <div className="form-group">
                    <label htmlFor="address">Home Address</label>
                    <input
                    type="text"
                    name="address"
                    value={data.address}
                    onChange={handleChange}
                    required/>
                </div>
                <div className="form-note">
                    <span className='required'>*</span> At least one contact (phone or email) is required
                </div>
            </div>

            <div className="form-section">
                <h3> Work Information</h3>
                <div className="form-group">
                    <label htmlFor="company">Company</label>
                    <input
                    type="text"
                    name="company"
                    value={data.company}
                    onChange={handleChange}/>
                </div>

                <div className="form-group">
                    <label htmlFor="title">Job Title</label>
                    <input
                    type="text"
                    name="title"
                    value={data.title}
                    onChange={handleChange}/>
                </div>
            </div>

            <div className="form-section">
                <h3> Social Media Links</h3>
                <div className="form-group">
                    <label htmlFor="linkedin">LinkedIn</label>
                    <input
                    type="url"
                    name="linkedin"
                    value={data.socialMedia.linkedin}
                    onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/username"/>
                </div>
                <div className="form-group">
                    <label htmlFor="instagram">Instagram</label>
                    <input
                    type="text"
                    name="instagram"
                    value={data.socialMedia.instagram}
                    onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                    placeholder="@username"/>
                </div>
                <div className="form-group">
                    <label htmlFor="facebook">Facebook</label>
                    <input
                    type="text"
                    name="facebook"
                    value={data.socialMedia.facebook}
                    onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                    placeholder="https://facebook.com/username"/>
                </div>
                <div className="form-group">
                    <label htmlFor="x">X</label>
                    <input
                    type="text"
                    name="x"
                    value={data.socialMedia.x}
                    onChange={(e) => handleSocialMediaChange('x', e.target.value)}
                    placeholder="@username"/>
                </div>
            </div>

            <div className="form-actions">
                {isEditMode && (<button
                type="button"
                className="cancel-button"
                onClick={onCancel}>
                    Cancel
                </button>
                )}
                <button
                type="submit"
                className="save-button"
                disabled={isLoading}
                onClick={handleSubmit}>
                    {isLoading ? 'Saving...' : 'Save Contact'}
                </button>
            </div>
        </div>
    );
};

export default ContactForm;