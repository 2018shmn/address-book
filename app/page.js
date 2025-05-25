'use client'

import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./styles/globals.css";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut} from "firebase/auth";
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import Header from './components/Header';
import LoginForm from './components/LoginForm'
import Filters from './components/Filters'

export default function Home() {
    const [user, setUser] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [editContactID, setEditContactID] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false); 
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        tags: [],
        sortBy: 'dateAdded', 
        areaCodes: [],
        sortDirection: 'desc'
    });
    const [filteredContacts, setFilteredContacts] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            }
            else {
                setUser(null); 
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            fetchContacts();
        }
        else {
            setContacts([]);
        }
    }, [user]);

    useEffect(() => {
        applyFilters();
    }, [contacts, filters]);

    const fetchContacts = async() => {
        if(!user) return;

        try {
            setIsLoading(true);
            const q = query(
                collection(db, `users/${user.uid}/contacts`), 
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
            setContacts(data);
        }
        catch (error) {
            console.error("Error fetching contacts:", error);
            alert("Failed to fetch contacts.");
        }
        finally {
            setIsLoading(false);
        }
    };

    const addContact = async (contactData) => {
        if(!user) return;

        try {
            const contact = await addDoc(
                collection(db, `users/${user.uid}/contacts`), 
                {...contactData, createdAt: serverTimestamp()});
            fetchContacts();
            setShowAddForm(false);
            return contact.id;
        }
        catch(error) {
            console.error("Error adding contact:", error);
            alert("Failed to add contact.");
        }
    };

    const updateContact = async (id, data) => {
        if (!user) return;
        try {
            await updateDoc(doc(db, `users/${user.uid}/contacts`, id), data);
            fetchContacts();
            setEditContactID(null);
        }
        catch(error) {
            console.error("Error updating contact:", error);
            alert("Failed to update contact.");
        }
    };

    const deleteContact = async (id) => {
        if (!user) return;
        try{
            await deleteDoc(doc(db, `users/${user.uid}/contacts`, id));
            fetchContacts();
        }
        catch(error) {
            console.error("Error deleting contact:", error);
            alert("Failed to delete contact.");
        }
    };

    const uploadImage = async (file) => {
        if (!user || !file) return null;

        try {
            const timestamp = Date.now();
            const fileRef = ref(storage, `users/${user.uid}/contacts/${timestamp}_${file.name}`);
            await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(fileRef);
            return downloadURL;
        }
        catch (error) {
            console.error("Error uploading image", error);
            alert("Error uploading image. Please try again.");
            return null;
        }
    };

    const applyFilters = () => {
        let filtered = [...contacts];

        if (filters.tags.length > 0) {
            filtered = filtered.filter(contact => 
                contact.tags &&
                filters.tags.some(tag => contact.tags.includes(tag))
            );
        }

        if (filters.areaCodes.length > 0) {
            filtered = filtered.filter(contact => {
                if (contact.phone) {
                    let code = contact.phone.match(/\((\d{3})\)/);
                    if (!code) {
                        code = contact.phone.match(/^(\d{3})/);
                    }
                    if (code && code[1]) {
                        return code && filters.areaCodes.includes(code[1]);
                    }
                }
            });
        }

        filtered.sort((a,b) => {
            if (filters.sortBy === 'dateAdded') {
                const dateA = a.createdAt.toMillis?.();
                const dateB = b.createdAt.toMillis?.();
                return filters.sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
            }
            else if (filters.sortBy === 'name') {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                if (filters.sortDirection == 'desc') {
                    return nameB.localeCompare(nameA);
                }
                else {
                    return nameA.localeCompare(nameB);
                }
            }
            return 0;
        });

        setFilteredContacts(filtered);
    }

    const handleFilterChange = (newFilters) => {
        setFilters({...filters, ...newFilters});
    };

    const handleEditContact = (contact) => {
        setEditContactID(contact.id);
    }

    const toggleAddForm = () => {
        setShowAddForm(prev => !prev);
        if (!showAddForm) {
            setEditContactID(null);
        }
    }

    const handleCancelAdd = () => {
        setShowAddForm(false);
    }

    const handleCancelEdit = () => {
        setEditContactID(null);
    }

    const toggleFilters = () => {
        setShowFilters(prev => !prev);
    }

    const handleLogin = async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password);
    }

    const handleSignup = async (email, password) => {
        await createUserWithEmailAndPassword(auth, email, password);
    }

    const handleLogout = async () => {
        try {
            await signOut(auth);
        }
        catch (error) {
            console.error("Error logging out:", error);
            alert("Error logging out.");
        }
    }

    if (isLoading) {
        return <div className="loading">Loading...</div>
    }

    return (
      <div className="app-container">
        <div className="app-content">
            {user ? (
                <>
                    <Header user={user} onLogout={handleLogout} showFilters={showFilters} onToggleFilters={toggleFilters}/>
                
                    <div className="main-layout">
                        <div className="contact-form-container">
                            <button 
                                type="button"
                                className="button-add"
                                onClick={toggleAddForm}>
                                    {showAddForm ? 'Cancel' : 'Add New Contact'}
                            </button>

                            {showAddForm && (
                                <div className="contact-form">
                                <ContactForm 
                                contact={null}
                                onSubmit={addContact}
                                onCancel={handleCancelAdd}
                                uploadImage={uploadImage}/>
                            </div>)}
                        </div>

                        <div className="content-area">
                            <div className="filter-content">
                                {showFilters && (
                                    <div className="sidebar">
                                        <Filters 
                                            filters={filters} 
                                            onFilterChange={handleFilterChange} 
                                            contacts={contacts}
                                        />
                                    </div>
                                )}

                                <div className={`main-content ${showFilters ? 'with-sidebar' : ''}`}>
                                    <ContactList 
                                    contacts={filteredContacts}
                                    onEdit={handleEditContact}
                                    onDelete={deleteContact}
                                    editContactID={editContactID}
                                    onCancelEdit={handleCancelEdit}
                                    onSubmit={updateContact}
                                    uploadImage={uploadImage}/>
                                </div>
                            </div>
                        </div>
                    </div>
            </>
            ) : (
                <LoginForm onLogin={handleLogin} onSignup={handleSignup}/>
            )}
        </div>
      </div>  
    );
}