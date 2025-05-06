import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const ProfilePage = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return (
            <section className="section">
                <div className="container mx-auto px-4">
                    <p className="text-center text-lg">Loading user profile...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="section">
            <div className="container mx-auto px-4">
                <h2 className="section-title">My Profile</h2>
                <div className="bg-[var(--clr-card-background)] p-8 rounded-lg shadow-md border border-[var(--clr-border)] max-w-md mx-auto">
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-[var(--clr-text-light)]">First Name</p>
                            <p className="text-lg text-[var(--clr-text)]">{user.firstName}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[var(--clr-text-light)]">Last Name</p>
                            <p className="text-lg text-[var(--clr-text)]">{user.lastName}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[var(--clr-text-light)]">Email</p>
                            <p className="text-lg text-[var(--clr-text)]">{user.email}</p>
                        </div>
                        {/* TODO: Add more profile information as needed */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProfilePage;
