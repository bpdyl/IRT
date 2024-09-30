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
        console.log('Incident Data from thunk: '+ response);
        return response;  // <-- Return the data to fulfill the thunk
      } catch (error) {
        console.error('Error fetching incident:', error);
        return rejectWithValue(error.response ? error.response.data : error.message); // Handle errors
      }
    }
  );
  
// Async thunk to update incident data
export const updateIncident = createAsyncThunk(
  'incident/updateIncident',
  async ({incidentId, data}, { rejectWithValue }) => {
    try {
      const { updateIncident } = useIncidentService();
      const response = await updateIncident(incidentId,data);
      return response;  // <-- Return the data to fulfill the thunk
    } catch (error) {
      console.error('Error fetching incident:', error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Fetch Retrospective Data
export const fetchRetrospective = createAsyncThunk(
  'incident/fetchRetrospective',
  async (incidentId, { rejectWithValue }) => {
    try {
      const { getRetrospective } = useIncidentService();
      const response = await getRetrospective(incidentId);
      return response;
    } catch (error) {
      console.error('Error fetching retrospective:', error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Update Retrospective Data
export const updateRetrospective = createAsyncThunk(
  'incident/updateRetrospective',
  async ({ incidentId, data }, { rejectWithValue }) => {
    try {
      const { updateRetrospective } = useIncidentService();
      const response = await updateRetrospective(incidentId, data);
      return response;
    } catch (error) {
      console.error('Error updating retrospective:', error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const incidentSlice = createSlice({
  name: 'incident',
  initialState: {
    incident: null, // Store the entire incident object
    retrospective: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Existing reducers for inline editing
    updateIncidentTitle: (state, action) => {
      if (state.incident) {
        state.incident.title = action.payload;
      }
    },
    updateIncidentDescription: (state, action) => {
      if (state.incident) {
        state.incident.description = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchIncident.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchIncident.fulfilled, (state, action) => {
      state.loading = false;
      state.incident = action.payload;
    })
    .addCase(fetchIncident.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    })
    .addCase(updateIncident.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateIncident.fulfilled, (state, action) => {
      state.loading = false;
      state.incident = action.payload; // Update the incident data
    })
    .addCase(updateIncident.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    })
    // Handle fetchRetrospective
    .addCase(fetchRetrospective.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchRetrospective.fulfilled, (state, action) => {
      state.loading = false;
      state.retrospective = action.payload;
    })
    .addCase(fetchRetrospective.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    })

    // Handle updateRetrospective
    .addCase(updateRetrospective.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateRetrospective.fulfilled, (state, action) => {
      state.loading = false;
      state.retrospective = action.payload;
    })
    .addCase(updateRetrospective.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });
  },
});

export const { updateIncidentTitle, updateIncidentDescription } = incidentSlice.actions;
export default incidentSlice.reducer;
