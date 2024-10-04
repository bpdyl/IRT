import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useFollowUpService } from '../../services/followUpService';

export const fetchFollowUps = createAsyncThunk(
  'followUps/fetchFollowUps',
  async (incidentId, { rejectWithValue }) => {
    try {
      const { getFollowUps } = useFollowUpService();
      return await getFollowUps(incidentId);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addFollowUp = createAsyncThunk(
  'followUps/addFollowUp',
  async ({ incidentId, newFollowUp }, { rejectWithValue }) => {
    try {
      const { createFollowUp } = useFollowUpService();
      return await createFollowUp(incidentId, newFollowUp);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to delete a followup
export const deleteFollowUp = createAsyncThunk(
  'followUps/deleteFollowUp',
  async (followUpId, { rejectWithValue }) => {
    try {
      const { removeFollowUp } = useFollowUpService();
      await removeFollowUp(followUpId);
      return followUpId; // Return followUpId to remove it from state
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to update a followup
export const updateFollowUp = createAsyncThunk(
  'followUps/updateFollowUp',
  async ({ followUpId, followUpData }, { rejectWithValue }) => {
    try {
      const { updateFollowUp } = useFollowUpService();
      return await updateFollowUp(followUpId, followUpData);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const followUpSlice = createSlice({
  name: 'followUps',
  initialState: {
    followUps: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowUps.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFollowUps.fulfilled, (state, action) => {
        state.loading = false;
        state.followUps = action.payload;
      })
      .addCase(fetchFollowUps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFollowUp.fulfilled, (state, action) => {
        state.followUps.push(action.payload);
      })
      .addCase(addFollowUp.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteFollowUp.fulfilled, (state, action) => {
        state.followUps = state.followUps.filter((followup) => followup.id !== action.payload);
      })
      .addCase(deleteFollowUp.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateFollowUp.fulfilled, (state, action) => {
        const index = state.followUps.findIndex((followup) => followup.id === action.payload.id);
        if (index !== -1) {
          state.followUps[index] = action.payload;
        }
      })
      .addCase(updateFollowUp.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default followUpSlice.reducer;
