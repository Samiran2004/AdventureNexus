import { useState, useEffect, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { profileService } from '../services/profileService';
import { experiencesService } from '../services/experiencesService';
import toast from 'react-hot-toast';

export const useProfile = () => {
    const { getToken } = useAuth();
    const { user: clerkUser } = useUser();
    const clerkUserId = clerkUser?.id;

    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({
        postsCount: 0,
        experiencesCount: 0,
        commentsCount: 0,
        likedPostsCount: 0,
        groupsCount: 0
    });

    const [loadingProfile, setLoadingProfile] = useState(true);
    const [tabData, setTabData] = useState({
        posts: null,
        experiences: null,
        comments: null,
        likes: null,
        groups: null
    });
    const [loadingTab, setLoadingTab] = useState({});

    // Fetch primary profile data and stats
    const fetchProfile = useCallback(async () => {
        if (!clerkUserId) return;
        setLoadingProfile(true);
        try {
            const token = await getToken();
            const res = await profileService.getProfile(clerkUserId, token);
            if (res.success) {
                setProfile(res.data.profile);
                setStats(res.data.stats);
            }
        } catch (err) {
            console.error('Failed to fetch profile stats:', err);
            toast.error('Could not load profile details.');
        } finally {
            setLoadingProfile(false);
        }
    }, [clerkUserId, getToken]);

    // Fetch content for a specific tab lazily
    const fetchTabData = useCallback(async (tabKey) => {
        if (!clerkUserId || tabData[tabKey] !== null) return; // Cached
        setLoadingTab(prev => ({ ...prev, [tabKey]: true }));
        try {
            const token = await getToken();
            let data = [];
            if (tabKey === 'posts') {
                const res = await profileService.getPosts(clerkUserId, token);
                data = res.data || [];
            } else if (tabKey === 'experiences') {
                const res = await profileService.getExperiences(clerkUserId, token);
                data = res.data || [];
            } else if (tabKey === 'comments') {
                const res = await profileService.getComments(clerkUserId, token);
                data = res.data || [];
            } else if (tabKey === 'likes') {
                const res = await profileService.getLikes(clerkUserId, token);
                data = res.data || [];
            } else if (tabKey === 'groups') {
                const res = await profileService.getGroups(clerkUserId, token);
                data = res.data || [];
            }

            setTabData(prev => ({ ...prev, [tabKey]: data }));
        } catch (err) {
            console.error(`Failed to fetch ${tabKey} tab data:`, err);
            toast.error(`Could not load ${tabKey}.`);
        } finally {
            setLoadingTab(prev => ({ ...prev, [tabKey]: false }));
        }
    }, [clerkUserId, getToken, tabData]);

    // Refresh everything
    const refreshProfile = useCallback(() => {
        setTabData({
            posts: null,
            experiences: null,
            comments: null,
            likes: null,
            groups: null
        });
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (clerkUserId) {
            fetchProfile();
        }
    }, [clerkUserId, fetchProfile]);

    // Update profile
    const updateProfileData = async (formData) => {
        try {
            const token = await getToken();
            const res = await profileService.updateProfile(formData, token);
            if (res.success) {
                toast.success('Profile updated successfully!');
                setProfile(res.data);
                fetchProfile(); // Update initials/stats
                return true;
            }
        } catch (err) {
            console.error('Update profile error:', err);
            toast.error('Failed to update profile.');
            return false;
        }
    };

    // Delete community post
    const deleteCommunityPost = async (postId) => {
        try {
            const token = await getToken();
            const res = await profileService.deletePost(postId, token);
            if (res.success) {
                toast.success('Community post deleted!');
                // Optimistic UI state update
                setTabData(prev => ({
                    ...prev,
                    posts: prev.posts ? prev.posts.filter(p => p._id !== postId) : null
                }));
                setStats(prev => ({ ...prev, postsCount: Math.max(0, prev.postsCount - 1) }));
                return true;
            }
        } catch (err) {
            console.error('Delete post error:', err);
            toast.error('Could not delete post.');
            return false;
        }
    };

    // Delete travel experience post
    const deleteExperiencePost = async (expId) => {
        try {
            const token = await getToken();
            const res = await experiencesService.delete(expId, token);
            if (res.success) {
                toast.success('Experience post deleted!');
                // Optimistic UI state update
                setTabData(prev => ({
                    ...prev,
                    experiences: prev.experiences ? prev.experiences.filter(e => e._id !== expId) : null
                }));
                setStats(prev => ({ ...prev, experiencesCount: Math.max(0, prev.experiencesCount - 1) }));
                return true;
            }
        } catch (err) {
            console.error('Delete experience error:', err);
            toast.error('Could not delete experience.');
            return false;
        }
    };

    // Delete comment
    const deleteUserComment = async (commentId) => {
        try {
            const token = await getToken();
            const res = await profileService.deleteComment(commentId, token);
            if (res.success) {
                toast.success('Comment deleted!');
                // Optimistic UI state update
                setTabData(prev => ({
                    ...prev,
                    comments: prev.comments ? prev.comments.filter(c => c._id !== commentId) : null
                }));
                setStats(prev => ({ ...prev, commentsCount: Math.max(0, prev.commentsCount - 1) }));
                return true;
            }
        } catch (err) {
            console.error('Delete comment error:', err);
            toast.error('Could not delete comment.');
            return false;
        }
    };

    return {
        profile,
        stats,
        loadingProfile,
        tabData,
        loadingTab,
        fetchTabData,
        updateProfileData,
        deleteCommunityPost,
        deleteExperiencePost,
        deleteUserComment,
        refreshProfile
    };
};
