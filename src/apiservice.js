import apiClient from "./apiclient";

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
