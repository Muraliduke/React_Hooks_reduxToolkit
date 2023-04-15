import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { fetchNews } from './newsAPI';

export interface CounterState {
  value: number;
  status: 'success' | 'loading' | 'failed';
  data: any[];
  perPage: number;
  totalPages: number;
}

const perPage = 20;

const initialState: CounterState = {
  value: 0,
  status: 'success',
  data: [],
  perPage,
  totalPages: 1000/perPage
};

export const newsAsync = createAsyncThunk(
  'news/fetchNews',
  async (param: {page: Number; perPage: Number}) => {
    const response = await fetchNews(param.page,param.perPage);
    // return response.data;
    return response
  }
);

export const counterSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    updateData: (state) => {
      state.value += 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(newsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(newsAsync.fulfilled, (state, action) => {
        const payload = action.payload;
        const data = JSON.parse(payload).hits
        state.status = 'success';
        state.data = [...data]
        // state.value += action.payload;
      })
      .addCase(newsAsync.rejected, (state) => {

        state.status = 'failed';
      });
  },
});

export const { updateData } = counterSlice.actions;

export const selectNews = (state: RootState) => state.news.data;
export const selectPerPage = (state: RootState) => state.news.perPage;
export const selectTotalPages = (state: RootState) => state.news.totalPages;


export default counterSlice.reducer;
