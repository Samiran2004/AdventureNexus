import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    username: null,
    token: null,
    isLoaded: false,
    userData: null,
    isLogin: false,

    // Fixed: Accept formData directly
    signUpStudent: async (formData) => {
        console.log("🏪 signUpStudent called in store");
        console.log("📝 Received formData:", formData);

        set({ isLoaded: true });

        try {
            console.log("Student Signup Form Data:", formData);


            // Add your actual API call here
            const response = await fetch('https://adventure-nexus-backend.onrender.com/api/v1/signup/student', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Something went wrong");
            }

            set({ isLoaded: false });
            console.log("✅ Signup successful", response);
            return { success: true };

        } catch (error) {
            set({ isLoaded: false });
            console.error("Student Signup error:", error);
            return {
                success: false,
                error: error.message
            }
        }
    },

    signUpTeacher: async () => {
        console.log("Signup teacher...");
    },

    loginStudent: async () => {
        console.log("Login student...");
    },

    loginTeacher: async () => {
        console.log("Login teacher...");
    },

    loginAdmin: async () => {
        console.log("Login admin...");
    }
}));