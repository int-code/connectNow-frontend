"use client";

import AppFooter from "../components/AppFooter";
import ComponentHeader from "../components/ComponentHeader";
import PageLoader from "../components/PageLoader";

import React, { useEffect, useState } from 'react';

interface UserProfile {
  username: string;
  email: string;
  name: string;
  bio: string;
  profile_pic: string;
}

const UserDetailsPage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'John Doe',
    bio: 'Im a software developer passionate about creating user-friendly applications.',
    profile_pic: 'https://via.placeholder.com/150',
    username: 'johndoe',
    email: 'john@doe.com'
  });
  
  useEffect(() => {
    const access_token = sessionStorage.getItem("access_token");
    if(!access_token)
      window.location.href = "/login";
    const fetchUserDetails = async () =>{
      const response = await fetch("http://152.42.222.73/api/connectnow/user", {
        headers:{
          "access-token": `${access_token}`,
        }
      });
      const responseBody = await response.json();
      if(responseBody.detail){
        return;
      }
      else{
        setUserProfile(responseBody);
      }
    };
    fetchUserDetails();
  }, []);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Here you would typically send the updated profile to your backend
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      const deleteAccount = async ()=>{
        const response = await fetch("http://152.42.222.73/api/connectnow/user", {
          method: "DELETE",
          headers: {
            "access-token": `${sessionStorage.getItem("access_token")}`,
          }
        })
      };
      deleteAccount();
      console.log('Account deleted');
    }
  };

  return (
    
    <div className="min-h-screen bg-white text-slate-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">User Profile</h1>
        
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <img 
                src={userProfile.profile_pic} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-900"
              />
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={userProfile.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-900 focus:ring focus:ring-slate-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-slate-700">Bio</label>
                  <textarea 
                    id="bio" 
                    name="bio"
                    value={userProfile.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-900 focus:ring focus:ring-slate-200 focus:ring-opacity-50"
                  />
                </div>
                <button 
                  onClick={handleSave}
                  className="bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-semibold mb-2">{userProfile.name}</h2>
                <p className="text-slate-600 mb-4">{userProfile.bio}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8">
          <button 
            onClick={handleDeleteAccount}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;