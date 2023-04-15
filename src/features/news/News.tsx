import React, { useState, useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  newsAsync, selectNews, selectPerPage,
  selectTotalPages
} from './newsSlice';
import styles from './News.module.css';
import AlignItemsList from '../../common/List';
import { Pagination } from '@mui/material';

export function News() {
  const news = useAppSelector(selectNews);
  const perPage = useAppSelector(selectPerPage);
  const totalPage = useAppSelector(selectTotalPages);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(newsAsync({page: 0,perPage}));
  }, [perPage, dispatch])

  return (
    <div>
      <AlignItemsList data={news} />
      <div className={styles.pager}>
        <Pagination count={totalPage} color="secondary" onChange={(event: React.ChangeEvent<unknown>, page: number) => dispatch(newsAsync({page: page-1,perPage}))} />
      </div>
    </div>
  );
}
