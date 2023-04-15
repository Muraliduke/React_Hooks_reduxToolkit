import React, { useMemo } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Moment from 'react-moment';

export default function AlignItemsList(props: any) {
    const val = useMemo(() => {
        return props.data
    }, [props.data])

    function stringToColor(string: string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }

    function stringAvatar(name: string) {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${name.split(' ')[0][0].toUpperCase()}`,
        };
    }

    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {
                val.map((item: any) => (
                    <>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar {...stringAvatar(item.author)} />
                            </ListItemAvatar>
                            <ListItemText
                                // primary={item.title}
                                secondary={
                                    <React.Fragment>
                                        <div>
                                        {(item.title || item.story_title || item.comment_text) +" "}
                                        {( item.url || item.story_url)&& (<a href={item.url || item.story_url} target="_blank">
                                        {item.story_url} 
                                        </a>)}
                                        </div>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {item.points} {item.points > 1 ? 'points ' : 'point '}
                                        </Typography>
                                        by {item.author}  <Moment fromNow>{item.created_at}</Moment> | {item.num_comments|| 0} comments
                                    </React.Fragment>
                                }
                            />
                            {/* <ListItemButton alignItems="flex-start" component="a" href={item.url}>
                                <ListItemText primary={item.url} />
                            </ListItemButton> */}
                        </ListItem>
                        <Divider variant="inset" component="li" /></>
                )
                )
            }
        </List>
    );
}
