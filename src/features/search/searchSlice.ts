import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { fetchNews } from './searchAPI';
import { IFilter } from './searchAPI'

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

export const searchAsync = createAsyncThunk(
  'news/fetchSearch',
  async (param: {page: Number; perPage: Number; search: string, fil: IFilter}) => {
    const response = await fetchNews(param.page,param.perPage, param.search, param.fil);
    // return response.data;
    return response
  }
);

export const counterSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    updateData: (state) => {
      state.value += 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchAsync.fulfilled, (state, action) => {
        const payload = action.payload;
        const data = JSON.parse(payload).hits
        state.status = 'success';
        state.data = [...data]
        // state.value += action.payload;
      })
      .addCase(searchAsync.rejected, (state) => {

        state.status = 'failed';
      });
  },
});

export const { updateData } = counterSlice.actions;

export const selectSearch = (state: RootState) => state.search.data;
export const selectPerPage = (state: RootState) => state.search.perPage;
export const selectTotalPages = (state: RootState) => state.search.totalPages;


export default counterSlice.reducer;
