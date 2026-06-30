import api from "../utils/api";

export const projectApi = {
    getAllProjects: async () => {
        const response = await api.get("/projects");
        return response.data;
    },
    
    getHighImpactProjects: async () => {
        const response = await api.get("/projects/high-impact");
        return response.data;
    },
    
    createProject: async (projectData) => {
        const response = await api.post("/projects", projectData);
        return response.data;
    },
    
    updateProject: async (id, projectData) => {
        const response = await api.put(`/projects/${id}`, projectData);
        return response.data;
    },
    
    deleteProject: async (id) => {
        const response = await api.delete(`/projects/${id}`);
        return response.data;
    }
};
