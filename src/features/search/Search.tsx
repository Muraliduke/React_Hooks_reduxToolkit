import React, { useState, useEffect } from "react";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import SearchIcon from "@mui/icons-material/Search";
import { useSearchParams } from "react-router-dom";
import {
  searchAsync,
  selectSearch,
  selectPerPage,
  selectTotalPages,
} from "./searchSlice";

import AlignItemsList from "../../common/List";
import { Pagination } from "@mui/material";
import { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import styles from "./Search.module.css";
import moment from "moment";

export function Search() {
  let [searchParams, setSearchParams] = useSearchParams();
  const [type, setType] = useState("Stories");
  const [by, setBy] = useState("Popularity");
  const [time, setTime] = useState("All time");
  const [from, setFrom] = useState<Dayjs | null>(null);
  const [to, setTo] = useState<Dayjs | null>(null);
  const [rangeDate, setRangeDate] = useState<boolean>(false);
  const [openStart, setOpenStart] = useState<boolean>(false);
  const [openEnd, setOpenEnd] = useState<boolean>(false);


  const [fil, setFil] = useState<{
    numericFilters: Array<any>;
    tagFilters: Array<any>;
  }>({
    numericFilters: [],
    tagFilters: ["story", []],
  });

  const timeStampCal = (val: string): string[]| null => {
    if(val === 'Custom range'){
      setRangeDate(true);
      setOpenStart(true);
      return null;
    }else{
      setRangeDate(false)
    }
    let w: any = moment().subtract(7, "d"),
      d: any = moment().subtract(1, "d"),
      m: any = moment().subtract(1, "M"),
      y: any = moment().subtract(1, "y");
    const day = new Date(d?._d).getTime() / 1000;
    const week = new Date(w?._d).getTime() / 1000;
    const month = new Date(m?._d).getTime() / 1000;
    const year = new Date(y?._d).getTime() / 1000;

    const obj: any = {
      "All time": [],
      "Last 24h": [`created_at_i>${day}`],
      "Past Week": [`created_at_i>${week}`],
      "Past Month": [`created_at_i>${month}`],
      "Past Year": [`created_at_i>${year}`],
      "Custom range": ["created_at_i>1667264400", "created_at_i<1668042000"],
    };

    return obj[val];
  };

  const dateRange = () => {
    
  }
  const filter: any = {
    type: [
      {
        label: "All",
        value: "All",
        extraFields: [["story", "comment", "poll", "job"], []],
      },
      { label: "Stories", value: "Stories", extraFields: ["story", []] },
      { label: "Comments", value: "Comments", extraFields: ["comment", []] },
    ],
    by: [
      { label: "Popularity", value: "Popularity", extraFields: "" },
      { label: "Date", value: "Date", extraFields: "" },
    ],
    time: [
      { label: "All time", value: "All time", extraFields: "" },
      {
        label: "Last 24h",
        value: "Last 24h",
        extraFields: ["created_at_i>1668277013.35"],
      },
      {
        label: "Past Week",
        value: "Past Week",
        extraFields: ["created_at_i>1667758663.138"],
      },
      {
        label: "Past Month",
        value: "Past Month",
        extraFields: ["created_at_i>1665685090.865"],
      },
      {
        label: "Past Year",
        value: "Past Year",
        extraFields: ["created_at_i>1636827505.656"],
      },
      {
        label: "Custom range",
        value: "Custom range",
        extraFields: ["created_at_i>1667264400", "created_at_i<1668042000"],
      },
    ],
  };

  const query = searchParams.get("q") || "";
  const [search, setSearch] = useState<string>(query);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const name = event.target.name;
    const val = event.target.value;
    switch (name) {
      case "type":
        setType(val);
        const subSet = filter[name];
        const subSetFil = subSet.filter((i: any) => i.value === val);
        const filState = {
          ...fil,
          tagFilters: subSetFil[0].extraFields,
        };
        setFil(filState);
        dispatch(searchAsync({ page: 0, perPage, search ,fil: filState}))

        //Dispatch
        break;

      case "by":
        setBy(val);
        break;

      case "time":
        setTime(val);
        const filVal = timeStampCal(val);
        if(filVal){
          const upFil = {
            ...fil,
            numericFilters: filVal
          }
          setFil(upFil)       
          dispatch(searchAsync({ page: 0, perPage, search ,fil: upFil}))
        }
        break;
    }
  };

  const news = useAppSelector(selectSearch);
  const perPage = useAppSelector(selectPerPage);
  const totalPage = useAppSelector(selectTotalPages);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(searchAsync({ page: 0, perPage, search,fil }));
  }, [ search]);

  const selectForm = (
    val: any[],
    name: string,
    stat: string,
    label: string
  ) => {
    return (
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Select
          name={name}
          value={stat}
          onChange={handleSelectChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          {val.map((e: any) => {
            return <MenuItem value={e.value}>{e.label}</MenuItem>;
          })}
        </Select>
        <FormHelperText>{label}</FormHelperText>
      </FormControl>
    );
  };

  return (
    <div>
      <FormControl fullWidth sx={{ m: 1 }} variant="standard">
        <InputLabel htmlFor="standard-adornment-amount">Search</InputLabel>
        <Input
          id="standard-adornment-amount"
          value={search}
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(ev)
          }
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </FormControl>
      <section className={styles.formSelect}>
        {selectForm(filter.type, "type", type, "Search")}
        {selectForm(filter.by, "by", by, "By")}
        {selectForm(filter.time, "time", time, "Time")}
      </section>

      {rangeDate && (<section className={styles.formSelect}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="From"
            value={from}
            onChange={(newValue) => {
              setOpenStart(false);
              setOpenEnd(true);
              setFrom(newValue);
            }}
            open={openStart}
            closeOnSelect
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="To"
            value={to}
            onChange={(newValue) => {
              setOpenEnd(false);
              setTo(newValue);
            }}
            open={openEnd}
            closeOnSelect
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </section>)}
      <div>
        <AlignItemsList data={news} />
        <div className={styles.pager}>
          <Pagination
            count={totalPage}
            color="secondary"
            onChange={(event: React.ChangeEvent<unknown>, page: number) =>
              dispatch(searchAsync({ page: page - 1, perPage, search ,fil}))
            }
          />
        </div>
      </div>
    </div>
  );
}
