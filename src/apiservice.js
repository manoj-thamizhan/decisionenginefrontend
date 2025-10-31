import apiClient from "./apiclient";

// Get all workflows
export async function getWorkflows({ search = "" }) {
  try {
    const params = new URLSearchParams();
    if (search) {
      params.append("search", search);
    }
    const response = await apiClient.get(`/api/workflows/?${params.toString()}`);
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Failed to fetch workflows:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

export async function getWorkflow({ id }) {
  try {
    const response = await apiClient.get(`/api/workflows/${id}/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Failed to fetch workflow:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}


// Create a new workflow
export async function createWorkflow(data) {
  try {
    const response = await apiClient.post(`/api/workflows/`, data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Failed to create workflow:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}
// Create a new changes-involved workflow
export async function createChangeinvolved(data) {
  try {
    const response = await apiClient.post(`/api/changes-involved/`, data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Failed to create changes-involved workflow:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

// Patch (update) an existing workflow or perform barcode split
export async function patchWorkflow(data, id) {
  try {
    const response = await apiClient.patch(`/api/workflows/${id}/`, data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Failed to update workflow:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}
