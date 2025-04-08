import * as React from 'react';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { PostProps } from '../pages/Home';
import { Button } from '@mui/material';


export const CardPost = ({ post }: { post: PostProps }) => {
    return (
        <Card sx={{ borderRadius: "12px", maxWidth: 320, boxShadow: " rgba(0, 0, 0, 0.24) 0px 3px 8px" }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        {post.logo}
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title="NG van a"
                subheader="Giao vien Toan"
            />
            <CardMedia
                component="img"
                height="340"
                image="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/banners/FFiY6jdHbKGbZCfW9vqv.jpg"
                alt="Paella dish"
            />
            <CardContent>
                <Typography variant="body2" color='text.primary'>
                    This impressive paella is a perfect party dish and a fun meal to cook
                    together with your guests. Add 1 cup of frozen peas along with the mussels,
                    if you like.
                </Typography>
            </CardContent>
            <CardActions sx={{ display: "flex", flexDirection: "row-reverse", gap: 1 }} disableSpacing>
                <Button color='secondary' variant='contained'>Liên hệ</Button>
                <Button color='inherit'>Xem chi tiết</Button>
            </CardActions>

        </Card>
    );
}