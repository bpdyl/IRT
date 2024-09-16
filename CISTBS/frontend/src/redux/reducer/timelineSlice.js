// timelineSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useTimelineService } from '../../services/timelineService';

export const fetchTimelineEvents = createAsyncThunk(
  'timeline/fetchTimelineEvents',
  async (incidentId, { rejectWithValue }) => {
    try {
      const { getTimelineEvents } = useTimelineService();
      return await getTimelineEvents(incidentId);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addTimelineEvent = createAsyncThunk(
  'timeline/addTimelineEvent',
  async ({ incidentId, newEvent }, { rejectWithValue }) => {
    try {
      const { createTimelineEvent } = useTimelineService();
      return await createTimelineEvent(incidentId, newEvent);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTimelineEvent = createAsyncThunk(
  'timeline/updateTimelineEvent',
  async ({ eventId, eventData }, { rejectWithValue }) => {
    try {
      const { updateTimelineEvent } = useTimelineService();
      return await updateTimelineEvent(eventId, eventData);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTimelineEvent = createAsyncThunk(
  'timeline/deleteTimelineEvent',
  async (eventId, { rejectWithValue }) => {
    try {
      const { deleteTimelineEvent } = useTimelineService();
      await deleteTimelineEvent(eventId);
      return eventId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addCommentToEvent = createAsyncThunk(
  'timeline/addCommentToEvent',
  async ({ eventId, comment }, { rejectWithValue }) => {
    try {
      const { addComment } = useTimelineService();
      return await addComment(eventId, comment);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const timelineSlice = createSlice({
  name: 'timeline',
  initialState: {
    events: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimelineEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTimelineEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchTimelineEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTimelineEvent.fulfilled, (state, action) => {
        state.events.unshift(action.payload); // Add to the beginning
      })
      .addCase(updateTimelineEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex((event) => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(deleteTimelineEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((event) => event.id !== action.payload);
      })
      .addCase(addCommentToEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex((event) => event.id === action.payload.event);
        if (index !== -1) {
          state.events[index].comments.push(action.payload);
        }
      });
  },
});

export default timelineSlice.reducer;
