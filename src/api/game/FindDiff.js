import axios from 'axios';
export const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;


export const findDiff_start = async (roomId) => {
    try {
        const response = await axios({
            method: "POST",
            url: `${API_SERVER_URL}/api/findDiff/start`,
            data: {
                roomId,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error starting Find Diff game:", error);
    }
}

export const findDiff_upload = (formData) => {
  return axios.post(`${API_SERVER_URL}/api/findDiff/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const findDiff_og = (findDiffGameId, userId) => {
  return axios.get(
    `${API_SERVER_URL}/api/findDiff/og/${findDiffGameId}/${userId}`,
  );
};

export const findDiff_inpaint = (formData) => {
  return axios.post(`${API_SERVER_URL}/api/findDiff/inpaint`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


export const findDiff_gen = (findDiffGameId, userId) => {
  return axios.get(
    `${API_SERVER_URL}/api/findDiff/gen/${findDiffGameId}/${userId}`,
  );
};
