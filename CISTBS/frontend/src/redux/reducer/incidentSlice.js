// src/redux/incidentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useIncidentService } from '../../services/incidentService';

// Async thunk to fetch incident details
export const fetchIncident = createAsyncThunk(
    'incident/fetchIncident',
    async (incidentId, { rejectWithValue }) => {
      try {
        const { getIncident } = useIncidentService();
        const response = await getIncident(incidentId);
        return response;  // <-- Return the data to fulfill the thunk
      } catch (error) {
        console.error('Error fetching incident:', error);
        return rejectWithValue(error.response.data);  // Handle errors
      }
    }
  );
  
const incidentSlice = createSlice({
  name: 'incident',
  initialState: {
    id: null,
    title: '',
    description: '',
    status: '',
    loading: false,
    error: null,
  },
  reducers: {
    updateIncidentTitle: (state, action) => {
      state.title = action.payload;
    },
    updateIncidentDescription: (state, action) => {
      state.description = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncident.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIncident.fulfilled, (state, action) => {
        state.loading = false;
        state.id = action.payload.id;
        state.title = action.payload.title;
        state.description = action.payload.description;
        state.status = action.payload.status;
      })
      .addCase(fetchIncident.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateIncidentTitle, updateIncidentDescription } = incidentSlice.actions;
export default incidentSlice.reducer;
